import { ElementRef } from "@angular/core";
import { Graph } from "./Graph";
import { GraphNode } from './GraphNode';

export const COLOR_WHITE = "#FFF";
export const COLOR_TRANSPARENT_WHITE = "#F6F6F6";
export const COLOR_GREEN = "#90C14B";
export const COLOR_TRANSPARENT_GREEN = "#BED79A";
export const COLOR_RED = "#E52F2D";
export const COLOR_VIOLET = "#4A4067";
export const COLOR_TRANSPARENT_VIOLET = "#9C97AB";


interface ICanvasGraph {
    draw(): void,
    getNodeAtPosition(clientX: number,clientY: number ): GraphNode | undefined,
    flickerNode(theNode: GraphNode): void,
    highlightNode(theNode: GraphNode): void,
    resetHighlights(): void
}

export class CanvasGraph extends Graph implements ICanvasGraph {

    private _canvas: ElementRef<HTMLCanvasElement>;
    private _context: CanvasRenderingContext2D;
    
    constructor(private _nodeRegularImg: HTMLImageElement,
                private _nodeHoverImg: HTMLImageElement,
                private _nodeStartImg: HTMLImageElement,
                private _nodeEndImg: HTMLImageElement ){
        super();
    }

    set canvas(theCanvas: ElementRef<HTMLCanvasElement>){
        this._canvas = theCanvas;
        this._context = this._canvas.nativeElement.getContext("2d");
    }

    // Draws edges first and then nodes
    draw() {

        // Clear canvas
        let canvasRect = this._canvas.nativeElement.getBoundingClientRect();
        this._context.clearRect(0, 0, canvasRect.width, canvasRect.height);

        // Draw edges of each node
        for (const [theNode, edges] of this.adjList.entries()) {
            edges.forEach( connectedNodeId => {
                let connectedNode = this.getNodeById(connectedNodeId);
                this.drawEdgeBetweenNodes(theNode,connectedNode);
            });
        }

        // Draw nodes
        this.nodes.forEach(node => {
            let image = this._nodeRegularImg;
            if (node.isHighlighted || node.isActive) image = this._nodeHoverImg;
            if (node.isFirstNode) image = this._nodeStartImg;
            if (node.isLastNode) image = this._nodeEndImg;
            node.draw(this._context, image);
        });
    }

    private drawEdgeBetweenNodes(theNode: GraphNode, connectedNode: GraphNode) {
        this._context.beginPath();
        this._context.lineWidth = 3;
        this._context.moveTo(theNode.posX, theNode.posY);
        this._context.lineTo(connectedNode.posX,connectedNode.posY);
        if (theNode.isActive && connectedNode.isHighlighted ||
            theNode.isHighlighted && connectedNode.isActive) {
            this._context.strokeStyle = COLOR_VIOLET;
        } 
        else
        {
            this._context.strokeStyle = COLOR_TRANSPARENT_VIOLET;   
        } 
        this._context.stroke();
        this._context.closePath();
        this._context.restore();
    }

    // Searchs canvas for a node using event absolute coordinates
    getNodeAtPosition( clientX: number, clientY: number ): GraphNode | undefined {
        
        let canvasRect = this._canvas.nativeElement.getBoundingClientRect();

        let thePosition = {
            x: clientX - canvasRect.left,
            y: clientY - canvasRect.top
        }

        let theNode: GraphNode;

        this.nodes.forEach( node => {
            if ( node.circle.isPointInside(thePosition) ) theNode = node;
        });

        return theNode ? theNode : undefined;

    }

    // Node flickers in red when incorrect
    flickerNode(newNode: GraphNode): void {
        
        let frame = 0;
        this.activeNode.circle.fill = COLOR_WHITE;
        
        const i = setInterval( () => {
            (Math.abs(frame % 2) == 1) ? newNode.circle.fill = COLOR_RED : newNode.resetColor();
            this.draw();
            frame++;
            let requestId = requestAnimationFrame(() => this.flickerNode );

            if (frame >= 5) {
                this.activeNode.resetColor();
                newNode.resetColor();
                this.draw();
                cancelAnimationFrame(requestId);
                clearInterval(i);
            }
        } , 100);
        
    }

    highlightNode(theNode: GraphNode): void {
        theNode.isHighlighted = true;
    }

    resetHighlights(): void {
        this.nodes.forEach ( node => { if (node.isHighlighted) node.isHighlighted = false; });
    }

}
