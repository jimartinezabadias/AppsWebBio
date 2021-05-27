import { Figure2d, IFigure2d } from "./Figure2d";

interface ICircle extends IFigure2d {
    radius: number,
    isPointInside(thePoint: { x: number, y: number}): boolean
}

export class Circle extends Figure2d implements ICircle {

    constructor(private _radius: number, theX: number, theY: number, theFill){
        super(theX,theY,theFill);
    }

    get radius(){
        return this._radius;
    }

    set radius(theRadius: number){
        if (theRadius > 0){
            this._radius = theRadius;
        }
    }

    draw(theContext: CanvasRenderingContext2D){

        super.draw(theContext);

        theContext.beginPath();
        theContext.arc(this.posX,this.posY,this.radius, 0, 2 * Math.PI);
        theContext.fill();

        theContext.closePath();

        theContext.restore();

    }

    isPointInside(thePoint: { x: number, y: number}): boolean{

        let distance =  (thePoint.x - this.posX) * (thePoint.x - this.posX) +
        (thePoint.y - this.posY) * (thePoint.y - this.posY);
        
        if (distance < (this.radius) * (this.radius)) {
            return true;
        }
        return false;

    }



}