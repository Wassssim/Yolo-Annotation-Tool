import { FC, useRef, useEffect, useState } from 'react';
import { generateRandomColor } from "~/utils/utils";
import * as shapes from "../shapes";
import { BBox } from "../shapes";
import { CircularProgress } from '@mui/material';
//import { setLoadingCanvasBg, setShapes } from '~/redux/slices/annotationSlice'
import './AnnotationCanvas.css';

interface AnnotationCanvasProps {
  image: any,
  mode: string,
  activeLabelId: number,
  setSaving: any,
  background: HTMLImageElement
}

let ctx: any = null;
let isDown: boolean | null = false;
let dragTarget: any = null;
let startX: any = null;
let startY: any = null;
let newShapeID = -1;
let newShapeInitialPoint: any = null;

// #Orange #Blue #Whitey #Red #Green #Pink 
let colorPalette: any = ["226, 162, 79", "29, 184, 248", "239, 218, 254", "194, 61, 46", "80, 166, 121", "197, 86, 225"];
const pointerr = new shapes.Pointer(0, 0.3, 0.09);

const AnnotationCanvas: FC<AnnotationCanvasProps> = ({ setSaving, image, mode, activeLabelId, background }) => {
  const [width, setWidth] = useState(1280);
  const [height, setHeight] = useState(720);
  const [ loadingImage, setLoadingImage ] = useState(true);
	const [ shapes, setShapes ] = useState<any[]>([]);

  const [resizing, setResizing] = useState(false);
  const [resizeParams, setResizeParams] = useState<any>(null);
  const [creating, setCreating] = useState(false);
  const [pointer, setPointer] = useState<shapes.Pointer>(pointerr);

  /**Redux */
  //const dispatch = useDispatch();
  //const loadingCanvasBg = useSelector((state: any) => state.annotationTool.loadingCanvasBg);
	//const shapes = useSelector((state: any) => state.annotationTool.shapes);

  const loadingCanvasBg: any[] = [];

  const canvas = useRef<any>();
  const drawingArea = useRef<any>();
  const Drawing = useRef<any>();

  background.onload = () => {
    console.log("Loaded IMAGE");
    setLoadingImage(false);
    //dispatch(setLoadingCanvasBg(false));
  }

  const boxToShape = (id: number, box: any) => {
    return new BBox(id, box.x_center - (box.width/2), box.y_center - (box.height/2), box.width, box.height, box.class_id);
  }

  useEffect(() => {
    if (image) {
      //dispatch(setLoadingCanvasBg(true))
      setSaving(false);
      setLoadingImage(true);
      //dispatch(setShapes(image.boxes.map((box: any, index: number) => boxToShape(index, box))));
      console.log(image.url)
      background.src = image.url;
    }
  }, [image]);

  const setCanvasParams = () => {
    const canvasEle = canvas?.current;
    if (!canvasEle) return;

    let ratioW = Drawing.current.clientWidth/1280;
    let ratioH = Drawing.current.clientHeight/720;
    //let ratio = Math.min(ratioW, ratioH);

    // dynamically assign the width and height to canvas
    //TODO: check why the width and height states are actually used
    canvasEle.width = Math.ceil(1280*ratioW);
    canvasEle.height = Math.ceil(720*ratioH);
    
    // dynamically assign the width and height to drawingArea
    const drawingAreaEle = drawingArea.current;
    drawingAreaEle.style.width = canvasEle.width + "px";
    drawingAreaEle.style.height = canvasEle.height + "px";

    // get context of the canvas
    ctx = canvasEle.getContext("2d");
    ctx.lineCap = "round";
    //ctx.scale(ratio, ratio);
  }



  // initialize the canvas context
  useEffect(() => {
    console.log("initial rendering");
    setCanvasParams();
    for (let i=0; i < 6; i++) {
      colorPalette.push(generateRandomColor())
    }
    
  }, []);

  useEffect(() => {
    if (!loadingImage) {
      setCanvasParams();
      draw();
    }
  }, [loadingImage]);
  

  useEffect(() => {
    //console.log(shapes);
    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
      console.log("handling resize");
    };

    setCanvasParams();
    draw();

    window.addEventListener("resize", handleResize);

    return () => {
			window.removeEventListener('resize', handleResize);
		};
  }, [width, height]);

  useEffect(() => {
      draw();
  }, [shapes]);

  useEffect(() => {
    pointer.visible = (mode === "create");
    draw();
  }, [mode])

  // draw shapes
  const draw = () => {
    if (canvas.current && ctx) {
        ctx.clearRect(0, 0, canvas.current.clientWidth, canvas.current.clientHeight);
        ctx.drawImage(background, 0, 0, canvas.current.width, canvas.current.height);
        
        //const scaledShapes = shapes.map(shape => scaleShapeForRender(shape, canvas.current.width, canvas.current.height))
        const params = {width: canvas.current.width, height: canvas.current.height, corners: (mode === "select")};
        pointer.draw(ctx, { color: colorPalette[pointer.id]}, params);
        shapes.map((shape: any) => {
            shape.draw(ctx, { color: colorPalette[shape.classId]}, params); //"rgba(0, 255, 255, 0.5)" shape.class_id
        });
    }
  }
  
  // identify the click event in the rectangle
  const hitBox = (x: any, y: any): boolean | null => {
      let isTarget: boolean | null = null;
      for (let i = 0; i < shapes.length; i++) {
            const shape = shapes[i];
            const params = {width: canvas.current.width, height: canvas.current.height};
            const {isOver, corner} = shape.isMouseOver(x, y, params);
            if (isOver && !corner) {
                dragTarget = shape;
                isTarget = true;
                break;
            } else if (isOver && corner) {
                console.log("Over Corner");
                setResizing(true);
                console.log("Resize Mode On");
                setResizeParams({initialPoint: {x: corner.x, y: corner.y}, shapeId: shape.id});
                isTarget = true;
                break;
            }
      }
    return isTarget;
  }

  const handleMouseDown = (e: any) => {
    startX = e.nativeEvent.offsetX - canvas.current.clientLeft;
    startY = e.nativeEvent.offsetY - canvas.current.clientTop;
    isDown = hitBox(startX, startY);
  }

  const setPointerCoordinates = (e: any) => {
    let newPointerX = (e.nativeEvent.offsetX - canvas.current.clientLeft)/(canvas.current.width);
    let newPointerY = (e.nativeEvent.offsetY - canvas.current.clientTop)/(canvas.current.height);
    //newPointerX  = Math.max(0, Math.min(1.0, dragTarget.info.x));
    //newPointerX  = Math.max(0, Math.min(1.0, dragTarget.info.y));
    pointer.move(newPointerX, newPointerY);
    pointer.x = newPointerX;
    pointer.y = newPointerY;
  }

  // move shapes
  const handleMouseMove = (e: any) => {
      if (mode === "select") {
        if (!isDown) {
            return;
        }
        if (resizing) {
            setPointerCoordinates(e);
            for (let i = 0; i < shapes.length; i++) {
                const shape = shapes[i];
                if (shape.id === resizeParams.shapeId) {
                      shape.resizeWithPoints(resizeParams.initialPoint.x, resizeParams.initialPoint.y, pointer.x, pointer.y)
                      break;
                }
            }
        }
        if (dragTarget instanceof BBox) {
            const mouseX = e.nativeEvent.offsetX - canvas.current.clientLeft;
            const mouseY = e.nativeEvent.offsetY - canvas.current.clientTop;
            let dx = mouseX - startX;
            let dy = mouseY - startY;
            dx = dx/(canvas.current.width);
            dy = dy/(canvas.current.height);
            startX = mouseX;
            startY = mouseY;
            dragTarget.move(dx, dy);
            //dragTarget.x = Math.max(0, Math.min(1.0, dragTarget.info.x));
            //dragTarget.y = Math.max(0, Math.min(1.0, dragTarget.info.y));
        }
        draw();
      }
      else {
          setPointerCoordinates(e);
          if (!resizing && newShapeID !== -1) {
              for (let i = 0; i < shapes.length; i++) {
                  const shape = shapes[i];
                  if (shape.id === newShapeID) {
                    shape.resizeWithPoints(newShapeInitialPoint.x, newShapeInitialPoint.y, pointer.x, pointer.y)
                    break;
                  }
              }
          }

          draw();
      }
  }

  const handleMouseUp = (e: any) => {
    if (dragTarget) {
      dragTarget = null;
      console.log("shapes:", shapes);
      //save
      setSaving(true);
      //dispatch(setShapes([...shapes]));
    }
    isDown = false;
    if (resizing) {
      setResizing(false);
      //save
      setSaving(true);
      //dispatch(setShapes([...shapes]));
    }
  }

  const handleMouseOut = (e: any) => {
    if (mode === "create") {
        pointer.visible = false;
        draw();
    } else if (resizing) {
        setPointerCoordinates(e);
    }
    handleMouseUp(e);
  }

  const handleMouseOver = (e: any) => {
      if (mode === "create") {
          pointer.visible = true;
          setPointerCoordinates(e);
          draw();
      }
      else if (resizing) {
        setPointerCoordinates(e);
      }
  }
  
  const handleOnClick = (e: any) => {
      if (mode === "select") return;
      // create new shape
      if (newShapeID === -1) {
          setCreating(true);
          newShapeInitialPoint = {x: pointer.x, y: pointer.y};
          newShapeID = shapes.length + 1; 
          const newBBox = new BBox(newShapeID, newShapeInitialPoint.x, newShapeInitialPoint.y, 0.0, 0.0, activeLabelId)
          setSaving(false);
          setShapes(prevShapes => [...prevShapes, newBBox]);
          //dispatch(setShapes([...shapes, newBBox]));
      } else {
          setCreating(false);
          newShapeID = -1;
          newShapeInitialPoint = null;
      }
  }

  //console.log(shapes[0].boxes[0]);
  return (
    <div className="AnnotationCanvas" data-testid="AnnotationCanvas" ref={Drawing}>
      <div className="DrawingArea" ref={drawingArea}>
        { (loadingImage)
          ? 
            <CircularProgress color="primary"/>
          :
            <canvas
              width={window.innerWidth}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseOut={handleMouseOut}
              onMouseOver={handleMouseOver}
              onClick={handleOnClick}
              ref={canvas}>  
            </canvas>
        }

      </div>
    </div>)
};

export default AnnotationCanvas;
