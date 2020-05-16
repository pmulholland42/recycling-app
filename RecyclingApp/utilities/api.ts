import firestore from '@react-native-firebase/firestore';
import Material from 'interfaces/Material';

export function getMaterials(): Promise<Material[]> {
    return firestore().collection('materials').get().then(snapshot => {
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
    })
}