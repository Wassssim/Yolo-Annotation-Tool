import React, { FC } from 'react';
import styles from './ShapeController.module.scss';
import { useSelector, useDispatch } from 'react-redux';

interface ShapeControllerProps {
  shape: any,
  background: HTMLImageElement,
  labels: string[],
  deleteShapeById: any
}

const ShapeController: FC<ShapeControllerProps> = ({
  shape,
  background,
  labels,
  deleteShapeById
}) => {
  //const loadingCanvasBg = useSelector((state: any) => state.annotationTool.loadingCanvasBg);
  
  const createShapeImage = (shape: any, background: HTMLImageElement) => {
    const shapeWidth = shape.w*background.width;
    const shapeHeight = shape.h*background.height;
    const ratio = 50/Math.max(shapeWidth, shapeHeight);
    const posX = Math.ceil(shape.x*background.width)*ratio;
    const posY = Math.ceil(shape.y*background.height)*ratio;
    const width = Math.ceil(shape.w*background.width)*ratio
    const height = Math.ceil(shape.h*background.height)*ratio
    return (
      <img style={{
          backgroundImage: `url(${background.src})`,
          backgroundPosition: `-${posX}px -${posY}px`,
          //backgroundPosition: ` -${shape.info.x*canvas.current.width}px -${shape.info.y*canvas.current.height}px`, /* Visible coordinates in image */
          height: `${Math.min(height, 50)}px`, /* Visible height */
          width: `${Math.min(width, 50)}px`, /* Visible width */
          backgroundSize: `${background.width*ratio}px ${background.height*ratio}px`,
      }}></img>
  )}

  return (
    <div className={styles.ShapeController} data-testid="ShapeController">
        {/* only display this after loading canvas bg */}
        <div className={styles.ShapeImage}>{createShapeImage(shape, background)}</div>
        <div><p>{labels[shape.classId]}</p></div>
        <div><button onClick={() => deleteShapeById(shape.id)}>Delete</button></div>
    </div>
  );
}

export default ShapeController;
