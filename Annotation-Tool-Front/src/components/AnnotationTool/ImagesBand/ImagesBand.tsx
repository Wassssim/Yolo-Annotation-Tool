import { FC, useRef, useCallback, useEffect } from 'react';
import { useImageScroll } from "~/hooks/useImageScroll";
import styles from './ImagesBand.module.scss';
import './ImagesBand.css';
import ImageWithLoader from "../../ImageWithLoader/ImageWithLoader";
import { BBox } from '../shapes';
import { useParams } from 'react-router-dom';
import { setSelectedImageId } from '~/redux/slices/annotationSlice';
import { DatasetImage } from '../interfaces';

interface ImagesBandProps {
  images: DatasetImage[],
  onImageSelect: (imageId: DatasetImage["id"]) => void
  selectedImageId: string,
  hasMore: boolean,
  page: number,
  setPage: any,
}

const ImagesBand: FC<ImagesBandProps> = ({ images, selectedImageId, onImageSelect, hasMore, page, setPage }) => {
  const imgRef = useRef<any>(null);
  //const { segmentId }: any = useParams();
  /** custom hooks */
	//const { loading, error, images, setImages, hasMore }: any= useImageScrollRedux(`${"process.env.REACT_APP_CENSUS_API_URL"}/segment/${segmentId}/images/list`, page);

  //const { loading, error, images, hasMore } = useImageScroll(`${"process.env.REACT_APP_CENSUS_API_URL"}/segment/${segmentId}/images/list`, page);
  //const dispatch = useDispatch();
  const loading = false;

  useEffect(() => {
    const { scrollX, scrollY } = window;
    imgRef?.current?.scrollIntoView(false);
    console.log("index", imgRef?.current?.getAttribute("key"))
    if (imgRef?.current?.key === images.length - 1) {
      boundary?.current?.scrollIntoView(false);
    }
    window.scrollTo(scrollX, scrollY);
  }, [selectedImageId]);

  //useLazyLoading('.card-img', images);
  //useInfiniteScroll(boundaryRef, , hasMore);
    
  /** refs */
  const observer = useRef<any>();
  const boundary = useRef<any>();


  /** callbacks */
  const boundaryRef = useCallback((node :any) => {
    if (loading) return
    observer.current?.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        console.log("Observer:", page)
        setPage((prevPage: number) => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  /** event handling */
  const handleImageClick = (e: any, imageId: DatasetImage["id"]) => {
    onImageSelect(imageId);
    //dispatch(setSelectedImageId(imageID));
  }

  return (
  <div className={styles.ImagesBand} data-testid="ImagesBand">
    <div className="scrolling-wrapper">
      {images.map((image: DatasetImage, index: number) => {
        const { url_sm } = image;
        return (
          <div 
            key={index} 
            className="card" 
            ref={(selectedImageId === image.id) ? imgRef: null}
          >
            <div 
              className={`card-body ${selectedImageId === image.id ? "card-selected":""}`}
            >
              {/*{image.id}*/}
              <ImageWithLoader
                src={url_sm}
                handleClick={(e: any) => handleImageClick(e, image.id)}
              />
            </div>
          </div>
        )
      })}
      {hasMore && <div className="card" ref={boundaryRef}>
        <div className="card-body" ref={boundary}>
          {/*Boundary {image.id}*/}
          
        </div>
      </div>}
    </div>
  </div>
)}

export default ImagesBand;
