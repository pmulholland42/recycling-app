import firestore from '@react-native-firebase/firestore';
import Material from 'interfaces/Material';
import AsyncStorage from '@react-native-community/async-storage';
import Item from 'interfaces/Item';
import { store } from '../redux/store';

const MATERIALS_COLLECTION = 'materials';
const MATERIALS_STORAGE_KEY = 'materials';
const ITEMS_COLLECTION = 'items';

export const getMaterials = cachify(fetchMaterialsFromFirestore, MATERIALS_STORAGE_KEY);

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

function cachify<T extends (...args: any[]) => Promise<any>>(apiCall: T, storageKey: string) {
    return function(...args: Parameters<T>): ReturnType<T> {
        return AsyncStorage.getItem(storageKey).then(localData => {
            if (localData == null) {
                return apiCall(...args).then(fetchedData => {
                    AsyncStorage.setItem(storageKey, JSON.stringify(fetchedData));
                    return fetchedData;
                });
            } else {
                return JSON.parse(localData);
            }
        }) as ReturnType<T>
    }
}