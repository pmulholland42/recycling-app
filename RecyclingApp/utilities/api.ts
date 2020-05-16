import firestore from '@react-native-firebase/firestore';
import Material from 'interfaces/Material';
import AsyncStorage from '@react-native-community/async-storage';

const MATERIALS_COLLECTION = 'materials';
const MATERIALS_STORAGE_KEY = 'materials';

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