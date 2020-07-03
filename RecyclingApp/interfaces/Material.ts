/**
 * A material, such as a specific type of plastic or color of glass.
 */
export default interface Material {
    /** Auto-generated material id */
    id: string,
    /** General material type */
    type: 'plastic' | 'glass' | 'metal' | 'paper',
    /** Plastic number, if the material is plastic */
    plasticNumber?: number,
    /** Name of the material (e.g 'Low-Density Polyethylene') */
    name: string,
    /** Material code, if applicable (e.g. 'LDPE') */
    code?: string,
}