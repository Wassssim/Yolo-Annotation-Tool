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

export interface DatasetImage {
    id: string,
    datasetId: string;
    url: string;
    url_sm: string;
}