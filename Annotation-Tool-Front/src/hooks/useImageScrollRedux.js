export function useImageScrollRedux(url, pageNumber) {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const images = useSelector((state) => state.annotationTool.images);
    const dispatch = useDispatch();
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
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).token}`
          }
        })
        .then(res => {
          dispatch(setImagesList([...images, ...res.data.images]))
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
  
    return { loading, error, images, hasMore }
  }