export interface Annotation {
    id: string;
    datasetId: string;
    imageId: string;
    label: string;
    x: number;
    y: number;
    width: number;
    height: number;
    createdAt: string;
    updatedAt: string;
}