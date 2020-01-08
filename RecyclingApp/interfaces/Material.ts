export default interface Material {
    type: 'plastic' | 'glass' | 'metal' | 'paper',
    plasticNumber?: number,
    name: string,
    code?: string,
    isRecyclable?: boolean,
}