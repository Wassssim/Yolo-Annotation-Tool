import axios from 'axios';

/** Configuration */
//const base_url = "http://192.168.1.162:8000/api";
const base_url = "http://ns3089849.ip-54-36-61.eu:3002/api";

const headers = {
    'Content-Type': 'application/json',
    timeout: 1000*60*5 // 5 mins
}

/** Fetch functions */
export const fetchSegmentList = async (data, cancelToken) => {
    console.log(base_url)
    const response = axios({
        method: "GET",
        url: `${base_url}/site/${data.siteId}/segments/list`,
        headers: { 
            ...headers,
            
        },
        cancelToken
    })
    
    return await response;
}

/** Save functions */
export const updateSegment = async (data, cancelToken) => {
    console.log(data)
    const response = axios({
        method: "PUT",
        url: `${base_url}/segment/update/${data.segmentId}`,
        headers: { 
            ...headers,
            
        },
        cancelToken,
        data: data.body
    })
    
    return await response;
}

export const saveAnnotations = async (data, cancelToken) => {
    const response = axios({
        method: "PUT",
        url: `${base_url}/segment/images/save-annotations`,
        headers: { 
            ...headers,
            
        },
        cancelToken,
        data
    })
    
    return await response;
}

export const selectSegment = async (segmentId, cancelToken) => {
    const response = axios({
        method: "POST",
        url: `${base_url}/segment/${segmentId}/select`,
        headers: { 
            ...headers,
            
        },
        cancelToken
    })
    
    return await response;
}

export const finishSegment = async (segmentId, cancelToken) => {
    const response = axios({
        method: "POST",
        url: `${base_url}/segment/${segmentId}/finish`,
        headers: { 
            ...headers,
            
        },
        cancelToken
    })
    
    return await response;
}
