import firestore from '@react-native-firebase/firestore';
import Material from '../interfaces/Material';
import Item from '../interfaces/Item';
import { store } from '../redux/store';
import { cachify } from './common';
import { Location } from '../redux/reducers';
import { apiKey } from '../apiKey'; // Google Maps api key

// API call functions

const MATERIALS_COLLECTION = 'materials';
const MATERIALS_STORAGE_KEY = 'materials';
const ITEMS_COLLECTION = 'items';

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
            console.log(store);
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
 * Gets the name of the municipality/city at a lat-long coord
 * Uses the Google Maps places api
 * @param location 
 */
export function getLocationName(location: Location): Promise<string> {
    let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.latitude},${location.longitude}&radius=1&key=${apiKey}`;
    return fetch(url).then(response => response.json()).then(data => {
        return data.results[0].name;
    });
}

