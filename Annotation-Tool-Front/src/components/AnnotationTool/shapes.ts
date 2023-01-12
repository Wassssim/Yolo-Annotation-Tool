import { convertPtsToRectangleInfo } from "./canvasUtils";
const OFFSET = 0.005;
const CORNER_DIM = 0.01;

export class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
    }
}

export abstract class Shape {
    id: number;
    visible: boolean;

    constructor(id: number) {
        this.id = id;
        this.visible = true;

    }
    abstract draw(ctx: any, params: any, style: any): void;
    abstract isMouseOver(mouseX: number, mouseY: number, params:any): any;
    canDraw(): boolean {
        return this.visible;
    }

    // converts class instance to plain object
    toJSON(proto?: any) {
        let jsoned: any = {};
        let toConvert: any = proto || this;
        Object.getOwnPropertyNames(toConvert).forEach((prop) => {
            const val = toConvert[prop];
            // don't include those
            if (prop === 'toJSON' || prop === 'constructor') {
                return;
            }
            if (typeof val === 'function') {
                jsoned[prop] = val.bind(jsoned);
                return;
            }
            if (val && typeof val === 'object') {
                jsoned[prop] = val.toJSON();
                return;
            }
            jsoned[prop] = val;
        });

        const inherited = Object.getPrototypeOf(toConvert);
        if (inherited !== null) {
            Object.keys(this.toJSON(inherited)).forEach(key => {
                if (!!jsoned[key] || key === 'constructor' || key === 'toJSON')
                    return;
                if (typeof inherited[key] === 'function') {
                    jsoned[key] = inherited[key].bind(jsoned);
                    return;
                }
                jsoned[key] = inherited[key];
            });
        }
        return jsoned;
    }
}

export class Rectangle extends Shape {
    x: number;
    y: number;
    w: number;
    h: number;

    constructor(id: number, x: number, y: number, w: number, h: number) {
        super(id);
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    draw(ctx: any, style: any = {}, params: any = {}): void {
        const {width, height} = params;
        const {x, y, w, h} = this.getScaledCoordinates(this, width, height);
        if (params.fill === true) {
            const { backgroundColor = 'black' } = style;
            ctx.beginPath();
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(x, y, w, h);
        }
        else {
            const { color = 'black', lineWidth = "3" } = style;
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
            ctx.rect(x, y, w, h);
            ctx.stroke();
        }
    }

    getScaledCoordinates(rect: Rectangle, width: number, height: number) {
        return {
            x: rect.x*width,
            y: rect.y*height,
            w: rect.w*width,
            h: rect.h*height,
        }
    }

    isMouseOver(mouseX: number, mouseY: number, params: any) {
        const {width, height} = params;
        const {x, y, w, h} = this.getScaledCoordinates(this, width, height);
        if (mouseX >= x && mouseX <= x + w && mouseY >= y && mouseY <= y + h) {
            return true;
        }
    }

    resize(width: number, height: number) {
        this.w = width;
        this.h = height;
    }

    moveTo(x1: number, y1: number) {
        this.x = x1;
        this.y = y1;
    }
}


export class Square extends Rectangle {
    side: number;
    scalingOffset: number;

    constructor(id: number, x: number, y: number, side: number, scalingOffset: number) {
        super(id, x, y, side, side);
        this.side = side;
        this.scalingOffset = scalingOffset;
    }

    getScaledCoordinates(square: Square, width: number, height: number) {
        return {
            x: square.x*width - square.scalingOffset*width,
            y: square.y*height - square.scalingOffset*width,
            w: square.side*width,
            h: square.side*width,
        }
    }
}


export class BBox extends Shape {
    x: number;
    y: number;
    w: number;
    h: number;
    classId: number;
    topLeftCorner: Rectangle;
    topRightCorner: Rectangle;
    bottomRightCorner: Rectangle;
    bottomLeftCorner: Rectangle;
    mainRectangle: Rectangle;

    constructor(id: number, x: number, y: number, w: number, h: number, classId: number) {
        super(id);
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.classId = classId;
        this.topLeftCorner = new Square(id, x, y, CORNER_DIM, OFFSET);
        this.topRightCorner = new Square(id, x + w, y, CORNER_DIM, OFFSET);
        this.bottomRightCorner = new Square(id, x + w, y + h, CORNER_DIM, OFFSET);
        this.bottomLeftCorner = new Square(id, x, y + h, CORNER_DIM, OFFSET);
        this.mainRectangle = new Rectangle(id, x, y, w, h);
    }

    draw(ctx: any, style: any = {}, params: any = {}): void {
        if (!this.canDraw()) return
        const mainRectStyle = {...style, backgroundColor: `rgba(${style.color}, 0.2)`};
        const mainRectBorderStyle = {...style, color: `rgba(${style.color}, 0.8)`};
        const mainRectBorderStyleWhite = {...style, color: `rgba(255, 255, 255, 0.3)`, lineWidth: "5"};
        const mainRectBorderStyleBlack = {...style, color: `rgba(0, 0, 0, 0.8)`, lineWidth: "4"};
        const cornerRectStyle = {...style, color: `rgba(0, 0, 0, 0.4)`, lineWidth: "2"};
        const cornerRectStyle1 = {...style, backgroundColor: `rgba(${style.color}, 0.8)`};
        //const cornerRectStyleBlack = {...style, backgroundColor: `rgba(0, 0, 0, 0.1)`};

        /** main body of the rectangle */
        this.mainRectangle.draw(ctx, mainRectStyle, {...params, fill: true});
        //this.mainRectangle.draw(ctx, mainRectBorderStyleWhite, {...params, fill: false});
        this.mainRectangle.draw(ctx, mainRectBorderStyleBlack, {...params, fill: false});
        this.mainRectangle.draw(ctx, mainRectBorderStyle, {...params, fill: false});

        /** corners for the resize operation */
        if (params.corners) {
            this.topLeftCorner.draw(ctx, style=cornerRectStyle, params);
            this.topRightCorner.draw(ctx, style=cornerRectStyle, params);
            this.bottomRightCorner.draw(ctx, style=cornerRectStyle, params);
            this.bottomLeftCorner.draw(ctx, style=cornerRectStyle, params);

            
            this.topLeftCorner.draw(ctx, style=cornerRectStyle1, {...params, fill: true});
            this.topRightCorner.draw(ctx, style=cornerRectStyle1, {...params, fill: true});
            this.bottomRightCorner.draw(ctx, style=cornerRectStyle1, {...params, fill: true});
            this.bottomLeftCorner.draw(ctx, style=cornerRectStyle1, {...params, fill: true});

            //this.topLeftCorner.draw(ctx, style=cornerRectStyleBlack, {...params, fill: true});
        }
    }

    isMouseOver(mouseX: number, mouseY: number, params: any) {
        if (this.topLeftCorner.isMouseOver(mouseX, mouseY, params)) {
            return {isOver: true, corner: this.bottomRightCorner};
        }
        if (this.topRightCorner.isMouseOver(mouseX, mouseY, params)) {
            return {isOver: true, corner: this.bottomLeftCorner};
        }
        if (this.bottomRightCorner.isMouseOver(mouseX, mouseY, params)) {
            return {isOver: true, corner: this.topLeftCorner};
        }
        if (this.bottomLeftCorner.isMouseOver(mouseX, mouseY, params)) {
            return {isOver: true, corner: this.topRightCorner};
        }
        if (this.mainRectangle.isMouseOver(mouseX, mouseY, params)) {
            return {isOver: true, corner: null};
        }

        return {isOver: false, corner: null};
    }

    move(newX: number, newY: number){
        console.log("moving");
        this.topLeftCorner.x += newX;
        this.topRightCorner.x += newX;
        this.bottomRightCorner.x += newX;
        this.bottomLeftCorner.x += newX;
        this.mainRectangle.x += newX;
        this.x = this.topLeftCorner.x;
        
        this.topLeftCorner.y += newY;
        this.topRightCorner.y += newY;
        this.bottomRightCorner.y += newY;
        this.bottomLeftCorner.y += newY;
        this.mainRectangle.y += newY;
        this.y = this.topLeftCorner.y;
    }

    moveTo(x1: number, y1: number) {
        this.x = x1;
        this.y = y1;
        this.mainRectangle.moveTo(x1, y1);
        this.topLeftCorner.moveTo(x1, y1);
        this.topRightCorner.moveTo(x1 + this.w, y1);
        this.bottomRightCorner.moveTo(x1+ this.w, y1 + this.h);
        this.bottomLeftCorner.moveTo(x1, y1 + this.h);
    }

    resize(width: number, height: number) {
        this.w = width;
        this.h = height;
        this.mainRectangle.resize(width, height);
        this.topLeftCorner.moveTo(this.x, this.y);
        this.topRightCorner.moveTo(this.x + this.w, this.y);
        this.bottomRightCorner.moveTo(this.x+ this.w, this.y + this.h);
        this.bottomLeftCorner.moveTo(this.x, this.y + this.h);

        console.log("resizing");
    }

    resizeWithPoints(x1: number, y1: number, x2: number, y2: number) {
        const {x, y, w, h} = convertPtsToRectangleInfo(new Point(x1, y1), new Point(x2, y2));
        this.moveTo(x, y);
        this.resize(w, h);
    }

    getBboxObject(): any {
        return {
            "class_id": this.classId,
            "x_center": this.x + this.w / 2,
            "y_center": this.y + this.h / 2,
            "width": this.w,
            "height": this.h
        }
    }
}

export class Line extends Shape {
    x1: number;
    y1: number;
    x2: number; 
    y2: number;

    constructor(id: number, x1: number, y1: number, x2: number, y2: number) {
        super(id);
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    draw(ctx: any, style: any = {}, params: any = {}) {
        //console.log(info);
        const {width, height} = params;
        const {x1, y1, x2, y2} = this.getScaledCoordinates(this, width, height);
        const { color = 'black', lineWidth = 1 } = style;
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
    }

    getScaledCoordinates(line: Line, width: number, height: number) {
        return {
            x1: line.x1*width,
            y1: line.y1*height,
            x2: line.x2*width,
            y2: line.y2*height,
        }
    }

    isMouseOver(mouseX: number, mouseY: number, params: any) {
        return {isOver: false, corner: null};
    }

    move(newX1: number, newY1: number, newX2: number, newY2: number) {
        this.x1 = newX1;
        this.y1 = newY1;
        this.x2 = newX2;
        this.y2 = newY2;
    }
}

export class Pointer extends Shape {
    x: number;
    y: number;
    line1: Line;
    line2: Line;

    constructor(id: number, x: number, y: number){
        super(id);
        this.x = x;
        this.y = y;
        this.line1 = new Line(id, 0, y, 1, y);
        this.line2 = new Line(id, x, 0, x, 1);
    }

    draw(ctx: any, params: any = {}, style: any = {}) {
        if (!this.canDraw()) return
        this.line1.draw(ctx, params, style);
        this.line2.draw(ctx, params, style);
    }

    move(newX: number, newY: number) {
        this.x = newX;
        this.y = newY;
        this.line1.move(0, newY, 1, newY);
        this.line2.move(newX, 0, newX, 1);
    }

    isMouseOver(mouseX: number, mouseY: number, params: any) {
        return {isOver: false, corner: null};
    }
}

export class LineCross extends Shape {
    label: string;
    LC1: Point;
    LC2: Point;
    LD3: Point;
    crossLine: Line;
    directionLine: Line;
    LCSquare1: Square;
    LCSquare2: Square;
    LCSquare3: Square;
    LDArrow: Arrow;
    labelText: Text;

    constructor(id: number, label: string, LC1: Point, LC2: Point, LD3: Point) {
        super(id);
        this.label = label;
        this.LC1 = new Point(LC1.x, LC1.y);
        this.LC2 = new Point(LC2.x, LC2.y);
        this.LD3 = new Point(LD3.x, LD3.y);
        this.crossLine = new Line(id, this.LC1.x, this.LC1.y, this.LC2.x, this.LC2.y);
        this.directionLine = new Line(id, this.LC2.x, this.LC2.y, LD3.x, LD3.y);
        this.LCSquare1 = new Square(id, this.LC1.x, this.LC1.y, CORNER_DIM, OFFSET);
        this.LCSquare2 = new Square(id, this.LC2.x, this.LC2.y, CORNER_DIM, OFFSET);
        this.LCSquare3 = new Square(id, this.LD3.x, this.LD3.y, CORNER_DIM, OFFSET);
        this.LDArrow = new Arrow(id, this.LC2.x, this.LC2.y, this.LD3.x, this.LD3.y);
        this.labelText = new Text(id, label, LC1.x, LC1.y);
    }

    draw(ctx: any, params: any = {}, style: any = {}): void {
        if (!this.canDraw()) return

        this.crossLine = new Line(this.id, this.LC1.x, this.LC1.y, this.LC2.x, this.LC2.y);
        this.directionLine = new Line(this.id, this.LC2.x, this.LC2.y, this.LD3.x, this.LD3.y);
        this.LCSquare1 = new Square(this.id, this.LC1.x, this.LC1.y, CORNER_DIM, OFFSET);
        this.LCSquare2 = new Square(this.id, this.LC2.x, this.LC2.y, CORNER_DIM, OFFSET);
        this.LCSquare3 = new Square(this.id, this.LD3.x, this.LD3.y, CORNER_DIM, OFFSET);
        this.labelText = new Text(this.id, this.label, this.LC1.x - OFFSET, this.LC1.y - OFFSET);
        this.LDArrow = new Arrow(this.id, this.LC2.x, this.LC2.y, this.LD3.x, this.LD3.y);

        const controlSquaresStyle = {...style, backgroundColor: `rgba(0, 255, 255, 0.7)`};
        const lineStyle = {...style, color: `rgba(0, 0, 0, 0.8)`, lineWidth: "2"};
        const arrowStyle = {...style, color: `rgba(0, 0, 0, 0.8)`, arrowWidth: "2"};

        this.crossLine.draw(ctx, lineStyle, params);
        this.directionLine.draw(ctx, lineStyle, params);
        this.LDArrow.draw(ctx, params, arrowStyle)

        this.LCSquare1.draw(ctx, controlSquaresStyle, {...params, fill: true});
        this.LCSquare2.draw(ctx, controlSquaresStyle, {...params, fill: true});
        this.LCSquare3.draw(ctx, controlSquaresStyle, {...params, fill: true});

        this.labelText.draw(ctx, params);
    }

    isMouseOver(mouseX: number, mouseY: number, params: any) {
        if (this.LCSquare1.isMouseOver(mouseX, mouseY, params)) {
            return {isOver: true, target: {id: this.id, point: 1}};
        }

        if (this.LCSquare2.isMouseOver(mouseX, mouseY, params)) {
            return {isOver: true, target: {id: this.id, point: 2}};
        }

        if (this.LCSquare3.isMouseOver(mouseX, mouseY, params)) {
            return {isOver: true, target: {id: this.id, point: 3}};
        }

        return {isOver: false, corner: null};
    }

    getCoordinates(params: any) {
        const { width: w, height: h } = params;
        return {
            x1c: this.LC1.x*w,
            y1c: this.LC1.y*h, 
            x2c: this.LC2.x*w,
            y2c: this.LC2.y*h,
            x1d: this.LC2.x*w,
            y1d: this.LC2.y*h, 
            x2d: this.LD3.x*w,
            y2d: this.LD3.y*h
        }
    }

    toString(params: any) {
        const { x1c, y1c, x2c, y2c, x1d, y1d, x2d, y2d } = this.getCoordinates(params);
        return `${x1c};${y1c};${x2c};${y2c};${x1d};${y1d};${x2d};${y2d}`;
    }

    move(dx: number, dy: number, point: number){
        if (point === 1) {
            this.LC1.x += dx;
            this.LC1.y += dy;
            this.LC1.x = Math.max(0, Math.min(1, this.LC1.x));
            this.LC1.y = Math.max(0, Math.min(1, this.LC1.y));
        }

        if (point === 2) {
            this.LC2.x += dx;
            this.LC2.y += dy;
            this.LC2.x = Math.max(0, Math.min(1, this.LC2.x));
            this.LC2.y = Math.max(0, Math.min(1, this.LC2.y));
        }

        if (point === 3) {
            this.LD3.x += dx;
            this.LD3.y += dy;
            this.LD3.x = Math.max(0, Math.min(1, this.LD3.x));
            this.LD3.y = Math.max(0, Math.min(1, this.LD3.y));
        }
    }

    /*move(newX: number, newY: number){
        console.log("moving");
        this.x = newX;
        this.topLeftCorner.x += newX;
        this.topRightCorner.x += newX;
        this.bottomRightCorner.x += newX;
        this.bottomLeftCorner.x += newX;
        this.mainRectangle.x += newX;

        this.y = newY;
        this.topLeftCorner.y += newY;
        this.topRightCorner.y += newY;
        this.bottomRightCorner.y += newY;
        this.bottomLeftCorner.y += newY;
        this.mainRectangle.y += newY;
    }

    moveTo(x1: number, y1: number) {
        this.x = x1;
        this.y = y1;
        this.mainRectangle.moveTo(x1, y1);
        this.topLeftCorner.moveTo(x1, y1);
        this.topRightCorner.moveTo(x1 + this.w, y1);
        this.bottomRightCorner.moveTo(x1+ this.w, y1 + this.h);
        this.bottomLeftCorner.moveTo(x1, y1 + this.h);
    }

    resize(width: number, height: number) {
        this.w = width;
        this.h = height;
        this.mainRectangle.resize(width, height);
        this.topLeftCorner.moveTo(this.x, this.y);
        this.topRightCorner.moveTo(this.x + this.w, this.y);
        this.bottomRightCorner.moveTo(this.x+ this.w, this.y + this.h);
        this.bottomLeftCorner.moveTo(this.x, this.y + this.h);

        console.log("resizing");
    }

    resizeWithPoints(x1: number, y1: number, x2: number, y2: number) {
        const {x, y, w, h} = convertPtsToRectangleInfo(new Point(x1, y1), new Point(x2, y2));
        this.moveTo(x, y);
        this.resize(w, h);
    }*/
}

export class Text extends Shape {
    text: string;
    x: number;
    y: number;

    constructor(id: number, text: string, x: number, y: number) {
        super(id)
        this.text = text;
        this.x = x;
        this.y = y;
    }

    draw(ctx:any, params: any = {}, style: any = {}): void {
        const { width, height } = params;
        const { x, y} = this.getScaledCoordinates(width, height);
        ctx.font = '32px Segoe UI';
        ctx.fillStyle = "black";
        ctx.fillText(this.text, x, y);
    }

    getScaledCoordinates(width: number, height: number) {
        return {
            x: this.x*width,
            y: this.y*height,
        }
    }

    isMouseOver(mouseX: number, mouseY: number, params: any) {
        return false;
    }
}

export class Arrow extends Shape {
    x: number;
    y: number;
    x1: number;
    y1: number;

    constructor(id: number, x: number, y: number, x1: number, y1: number) {
        super(id);
        this.x = x;
        this.y = y;
        this.x1 = x1;
        this.y1 = y1;
    }

    draw(ctx: any, params: any = {}, style: any = {}) {
        const { width, height } = params;
        const { color, arrowWidth } = style;
        const {x: fromx, y: fromy, x1: tox, y1: toy} = this.getScaledCoordinates(width, height);
        

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

    getScaledCoordinates(width: number, height: number) {
        return {
            x: this.x*width,
            y: this.y*height,
            x1: this.x1*width,
            y1: this.y1*height,
        }
    }

    isMouseOver(mouseX: number, mouseY: number, params: any) {
        return false;
    }
}