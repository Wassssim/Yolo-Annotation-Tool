import { useEffect, useState } from 'react';
import axios from 'axios';

export function useImageScroll(url, pageNumber) {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [images, setImages] = useState([])
    const [hasMore, setHasMore] = useState(false)
  
    useEffect(() => {
        setLoading(true)
        setError(false)
        let cancel;
  
        axios({
          method: 'GET',
          url,
          params: { page: pageNumber, limit: 10 },
          cancelToken: new axios.CancelToken(c => cancel = c),
        })
        .then(res => {
          setImages(prevImages => {
            const new_arr = [...prevImages, ...res.data.images]
            console.log("page:", pageNumber, "new state:", new_arr)
            return new_arr
          })
          setHasMore(res.data.images.length > 0)
          setLoading(false)
        })
        .catch(e => {
          if (axios.isCancel(e)) return
          setError(e)
          setHasMore(false)
          setLoading(false)
        })
  
        return () => {
          console.log("Image fetch cancelled")
          cancel()
        }
    }, [pageNumber])
  
    return { loading, error, images, setImages, hasMore }
  }