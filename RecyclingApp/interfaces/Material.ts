export default interface Material {
    id: string,
    type: 'plastic' | 'glass' | 'metal' | 'paper',
    plasticNumber?: number,
    name: string,
    code?: string,
}