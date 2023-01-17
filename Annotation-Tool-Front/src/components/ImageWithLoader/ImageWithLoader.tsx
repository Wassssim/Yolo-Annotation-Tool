import React, { FC, useState, useEffect } from 'react';
import styles from './ImageWithLoader.module.scss';
import Skeleton from '@mui/material/Skeleton';

interface ImageWithLoaderProps {
  src: string;
  width?: number,
  height?: number,
  onClick: (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => void;
}

const getContainedImageDims = (width: number, height: number, imageWidth: number, imageHeight: number) => {
  const newHeight = 0;
  const newWidth = 0;
  return {height: newHeight, width: newWidth};
}


const ImageWithLoader: FC<ImageWithLoaderProps> = ( { src, onClick, height = 50, width = 50} ) => {
  const [ isLoaded, setIsLoaded ] = useState(false);
  const [ error, setError ] = useState(false);

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
  <div className={styles.ImageWithLoader} style={{height, width}} data-testid="ImageWithLoader">
    {isLoaded && 
      <img 
          src={src}
          className="card-img"
          onClick={onClick}
      />}
    {!isLoaded && !error && <Skeleton animation="wave" height={70} variant="rectangular" sx={{ bgcolor: 'rgb(53, 52, 94)'}}/>}
    {error && <p>Error</p>}
  </div>
)}
//
export default ImageWithLoader;