import firestore from '@react-native-firebase/firestore';
import Material from '../interfaces/Material';
import Item from '../interfaces/Item';
import { store } from '../redux/store';
import { cachify } from './common';
import { LatLong } from '../interfaces/LatLong';
import { apiKey } from '../apiKey'; // Google Maps api key
import { Location } from '../interfaces/Location';

// API call functions

const MATERIALS_COLLECTION = 'materials';
const MATERIALS_STORAGE_KEY = 'materials';
const ITEMS_COLLECTION = 'items';
const LOCATIONS_COLLECTION = 'locations';

export const getMaterials = cachify(fetchMaterialsFromFirestore, MATERIALS_STORAGE_KEY);

/**
 * Fetches the list of materials from firestore database
 */
function fetchMaterialsFromFirestore(): Promise<Material[]> {
    return firestore().collection(MATERIALS_COLLECTION).get().then(snapshot => {
        return snapshot.docs.map(doc => {
            let data = doc.data();
            let material: Material = {
                id: doc.id,
                type: data.type,
                plasticNumber: data.plasticNumber,
                name: data.name,
                code: data.code,
            };
            return material;
        });
    });
}

/**
 * Fetches item data from the firestore database based on a barcode
 * @param barcode The barcode data of the item
 * @throws 'Material X not found' if the fetched item's material is unknown.
 */
export function fetchItemFromFirestore(barcode: string): Promise<Item | null> {
    return firestore().collection(ITEMS_COLLECTION).doc(barcode).get().then(doc => {
        if (doc.exists) {
            let data = doc.data()!;
            let materialId = data.material.id;
            let material = store.getState().recyclingReducer.materials.find(mat => mat.id === materialId);
            if (material !== undefined) {
                let item: Item = {
                    name: data.name,
                    material,
                }
                return item;
            } else {
                throw `Material ${materialId} not found`;
            }
        } else {
            return null;
        }
    })
}

/**
 * Adds a new item to firestore
 * @param itemName The name of the item
 * @param materialId The id of the material
 * @param barcode The barcode
 */
export function addItem(itemName: string, materialId: string, barcode: string): Promise<void> {
    let material = firestore().collection(MATERIALS_COLLECTION).doc(materialId);
    console.log(`Creating item ${barcode}`);
    return firestore().collection(ITEMS_COLLECTION).doc(barcode).set({
        name: itemName,
        material,
    });
}

/**
 * Gets the name of the municipality/city at a lat/long coord.
 * Uses the Google Maps places api
 * @param position The lat/long coord
 */
export function getLocation(position: LatLong): Promise<Location> {
    let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${position.latitude},${position.longitude}&radius=1&key=${apiKey}`;
    return fetch(url).then(response => response.json()).then(data => {
        return {
            id: data.results[0].id,
            name: data.results[0].name,
        }
    });
}

/**
 * Gets the recyclabilty info for a location
 * @param locationId
 */
export function getRecyclabilityInfo(locationId: string): Promise<Map<string, boolean>> {
    return firestore().collection(LOCATIONS_COLLECTION).doc(locationId).get().then(doc => {
        if (doc.exists) {
            let data = doc.data()!;
            let recyclabilityMap = new Map<string, boolean>();
            data.recyclables.forEach((recyclable: { material: { id: string }, isRecyclable: boolean }) => {
                recyclabilityMap.set(recyclable.material.id, recyclable.isRecyclable);
            });
            return recyclabilityMap;
        } else {
            throw `${locationId} does not exist`;
        }
    })
}

export function addLocation(locationId: string, locationName: string): Promise<void> {
    let recyclables = store.getState().recyclingReducer.materials.map(mat => {
        return {
            isRecyclable: true,
            material: firestore().collection(MATERIALS_COLLECTION).doc(mat.id),
        }
    })
    console.log(recyclables);
    return firestore().collection(LOCATIONS_COLLECTION).doc(locationId).set({
        name: locationName,
        recyclables,
    })
}

