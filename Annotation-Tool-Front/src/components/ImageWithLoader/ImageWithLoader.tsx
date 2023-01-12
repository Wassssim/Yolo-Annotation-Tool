import React, { FC, useState, useEffect, useRef } from 'react';
import styles from './ImageWithLoader.module.scss';
import Skeleton from '@mui/material/Skeleton';

interface ImageWithLoaderProps {
  src: string;
  handleClick: any;
}

const ImageWithLoader: FC<ImageWithLoaderProps> = ( { src, handleClick} ) => {
  const [ isLoaded, setIsLoaded ] = useState(false);
  const [ error, setError ] = useState(false);
  const imgRef = useRef<any>(null);

  useEffect(() => {
    const image = new Image();
    image.onload = () => setIsLoaded(true);
    image.onerror= (e: any) => {
      e.currentTarget.onerror = null; // prevents looping
      console.log("Image error")
      setError(true);
    }
    image.src = src;
  }, [])
  
  return (
  <div className={styles.ImageWithLoader} data-testid="ImageWithLoader">
    {isLoaded && 
      <img 
          className="card-img" src={src} 
          onClick={handleClick}
      />}
    {!isLoaded && !error && <Skeleton animation="wave" height={70} variant="rectangular" sx={{ bgcolor: 'rgb(53, 52, 94)'}}/>}
    {error && <p>Error</p>}
  </div>
)}
//
export default ImageWithLoader;