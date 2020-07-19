import Material from '../interfaces/Material';
import { SET_MATERIALS } from './actions';


export function setMaterials(materials: Material[]) {
    return {
        type: SET_MATERIALS,
        payload: {
            materials,
        },
    }
}