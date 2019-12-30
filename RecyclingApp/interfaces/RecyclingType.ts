export default interface RecyclingType {
    materialType: "plastic" | "glass" | "metal" | "paper",
    plasticNumber?: number,
    name: string,
    code?: string,
    isRecyclable?: boolean,
}