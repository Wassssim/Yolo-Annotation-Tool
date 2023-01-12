import { Rectangle, BBox } from "./shapes";  

export const convertPtsToRectangleInfo = (point1: any, point2: any) => {
    const {x, y} = point1;
    const {x: x1, y : y1} = point2;
    const newBoxHeight = Math.abs(y1 - y);
    const newBoxWidth = Math.abs(x1 - x);
    const newBoxInfo: any = {h: newBoxHeight, w: newBoxWidth};
    if (x1 >= x && y1 >= y) {
        newBoxInfo.x = x;
        newBoxInfo.y = y;
    }
    else if (x1 >= x && y1 <= y) {
        newBoxInfo.x = x;
        newBoxInfo.y = y1;
    }
    else if (x1 <= x && y1 >= y) {
        newBoxInfo.x = x1;
        newBoxInfo.y = y;
    }
    else {
        newBoxInfo.x = x1;
        newBoxInfo.y = y1;
    }
    return newBoxInfo;
}

// draw a line
export const drawLine = (ctx: any, info: any, style: any = {}) => {
    const { x, y, x1, y1 } = info;
    //boxes.push({ line_id: 1, x: x - 5, y: y - 5, w: 10, h: 10 });
    //boxes.push({ line_id: 1, x: x1 - 5, y: y1 - 5, w: 10, h: 10 });
    //console.log(info);
    const { color = 'black', width = 1 } = style;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x1, y1);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
}

// draw a rectangle with background
export const drawFillRect = (ctx: any, info: any, style: any = {}) => {
    const { x, y, w, h } = info;
    const { backgroundColor = 'black' } = style;
    
    ctx.beginPath();
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(x, y, w, h);
}

// draw a rectangle with no background
export const drawRect = (ctx: any, info: any, style: any = {}) => {
    const { x, y, w, h } = info;
    const { color = 'black', lineWidth = "3" } = style;
    
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.rect(x, y, w, h);
    ctx.stroke();
}

// draw a text
export const drawText = (ctx: any, info: any, text: string) => {
    const {x, y} = info;
    ctx.font = '32px Segoe UI';
    ctx.fillStyle = "black";
    ctx.fillText(text, x, y);
}

// draw an arrow lol
export const drawArrow = (ctx: any, info: any, arrowWidth: any, color: any) => {
    const {x: fromx, y: fromy, x1: tox, y1: toy} = info;

    //variables to be used when creating the arrow
    var headlen = 20;
    var angle = Math.atan2(toy-fromy,tox-fromx);
 
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = arrowWidth;

    //starting a new path from the head of the arrow to one of the sides of
    //the point
    ctx.beginPath();
    ctx.moveTo(tox, toy);
    ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),
               toy-headlen*Math.sin(angle-Math.PI/7));
 
    //path from the side point of the arrow, to the other side point
    ctx.moveTo(tox-headlen*Math.cos(angle+Math.PI/7),
               toy-headlen*Math.sin(angle+Math.PI/7));
 
    //path from the side point back to the tip of the arrow, and then
    //again to the opposite side point
    ctx.lineTo(tox, toy);
    ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),
               toy-headlen*Math.sin(angle-Math.PI/7));
 
    //draws the paths created above
    ctx.stroke();
    ctx.restore();
}

// draws a pointer
export const drawPointer = (ctx: any, shape: any, style: any = {}, params: any) => {
    const {width, height} = params;
    
    drawLine(ctx, { x: 0, y: shape.info.y, x1: width, y1: shape.info.y }, style);
    drawLine(ctx, { x: shape.info.x, y: 0, x1: shape.info.x, y1: height }, style);
}

const OFFSET = 0.0035;
const CORNER_DIM = 0.007;
// draws a shape
export const drawShape = (ctx: any, shape: any, style: any = {}, params: any = {}) => {
    if (!shape.visible) return;

    if (shape.type === "bbox") {
        const bbox = new BBox(0, shape.info.x, shape.info.y, shape.info.w, shape.info.h, 0);
        bbox.draw(ctx, style={color: style.color}, params);
        return;
        /*const filledRectStyle = {...style, backgroundColor: `rgba(${style.color}, 0.2)`};
        const rectStyle = {...style, color: `rgba(${style.color}, 0.8)`};
        const rectStyle1 = {...style, color: `rgba(0, 0, 0, 0.6)`, lineWidth: "3"};
        drawFillRect(ctx, shape.info, filledRectStyle);
        drawRect(ctx, shape.info, rectStyle)
        drawRect(ctx, shape.info, rectStyle1)
        if (params.corners) {
            const rectStyleCorners = {...style, color: `rgba(0, 0, 0, 0.8)`, lineWidth: "2"};
            const offset = OFFSET*params.width;
            drawRect(ctx, {x: shape.info.x - offset, y: shape.info.y - offset, w: CORNER_DIM*params.width, h: CORNER_DIM*params.width}, rectStyleCorners);
            drawRect(ctx, {x: shape.info.x - offset + shape.info.w, y: shape.info.y - offset, w: CORNER_DIM*params.width, h: CORNER_DIM*params.width}, rectStyleCorners);
            drawRect(ctx, {x: shape.info.x - offset, y: shape.info.y - offset + shape.info.h, w: CORNER_DIM*params.width, h: CORNER_DIM*params.width}, rectStyleCorners);
            drawRect(ctx, {x: shape.info.x - offset + shape.info.w, y: shape.info.y - offset + shape.info.h, w: CORNER_DIM*params.width, h: CORNER_DIM*params.width}, rectStyleCorners);
        
        }*/
    }
    else if (shape.type === "pointer")
        drawPointer(ctx, shape, style, params)
}

export const scaleShapeForRender = (shape: any, width = 1,height = 1) => {
    const scaledShape = JSON.parse(JSON.stringify(shape));

    if (shape.type === "bbox") {
        scaledShape.info.x = shape.info.x * width;
        scaledShape.info.y = shape.info.y * height;
        scaledShape.info.w = shape.info.w * width;
        scaledShape.info.h = shape.info.h * height;
    }
    else if (shape.type === "pointer") {
        scaledShape.info.x = shape.info.x * width;
        scaledShape.info.y = shape.info.y * height;
    }

    return scaledShape;
}