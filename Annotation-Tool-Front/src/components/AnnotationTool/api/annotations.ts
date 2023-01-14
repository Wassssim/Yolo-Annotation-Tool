import axios from "axios";
import { Annotation } from "../interfaces";

// fetches annotations from the backend
export const fetchDataset = (datasetId: string) => {
  //`/api/datasets/${datasetId}`

  return new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve([
            {}
        ]);
    }, 1000)
  })
}

export const saveAnnotation = (annotation: Annotation) => {
    // "/api/annotations"

    //`/api/datasets/${datasetId}`
  
    return new Promise((resolve, reject) => {
      setTimeout(() => {
          resolve([
              {status: "ok"}
          ]);
      }, 1000)
    })
}