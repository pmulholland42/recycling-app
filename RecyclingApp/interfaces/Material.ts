export default interface Material {
    id: number,
    type: 'plastic' | 'glass' | 'metal' | 'paper',
    plasticNumber?: number,
    name: string,
    code?: string,
}