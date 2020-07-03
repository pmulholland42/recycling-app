import Material from "./Material";

/**
 * A potentially recyclable item (e.g. a plastic bottle or aluminum can)
 */
export default interface Item {
    /** The name of the item (e.g. 'Dasani water bottle) */
    name: string,
    /** The item's material */
    material: Material,
}