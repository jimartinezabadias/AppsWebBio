export interface IDrawable {
    draw(ctx: CanvasRenderingContext2D, image?: HTMLImageElement): void;
}

export interface IFigure2d extends IDrawable {
    posX: number,
    posY: number,
    fill
}

export class Figure2d implements IFigure2d, IDrawable {

    constructor (
        private _posX: number, 
        private _posY: number, 
        private _fill
    ){}

    get posX () {
        return this._posX;
    }

    set posX (theX: number) {
        if (theX >= 0) {
            this._posX = theX;
        }
    }

    get posY () {
        return this._posY;
    }

    set posY (theY: number) {
        if (theY >= 0) {
            this._posY = theY;
        }
    }

    set fill (theFill) {
        this._fill = theFill;
    }
    
    get fill () {
        return this._fill;
    }
    
    draw (theContext: CanvasRenderingContext2D): void {
        theContext.fillStyle = this._fill;
    }

}