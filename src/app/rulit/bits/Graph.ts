import { Observable, Subject } from 'rxjs';
import { GraphNode } from './GraphNode';

// Coordinates types for a 13 rows x 18 columns grid
type GraphRowNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 ;
type GraphColumnNumber =  1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18;

// Graph nodes fields
// export interface IGraphNode {
//     id: number,
//     isFirstNode: boolean,
//     isLastNode: boolean,
//     edges: Array<number>,
//     row: GraphRowNumber,
//     column: GraphColumnNumber
// }

// Graph
interface IGraph {
    nodes: Array<GraphNode>,
    adjList: Map<GraphNode,Array<number>>,
    activeNode: GraphNode,
    activeNode$: Observable<GraphNode>,
    firstNode: GraphNode,
    addNode(theNode: GraphNode, edges: Array<number>): void | boolean,
    isActiveNodeNextTo(theNode: GraphNode): boolean,
    getNodeById(theNodeId: number): GraphNode | undefined
}


export class Graph implements IGraph {
    
    private _adjList: Map<GraphNode,Array<number>>;
    private _activeNode: GraphNode;
    private _activeNodeChange$ = new Subject<GraphNode>();
    
    constructor(){
        this._adjList = new Map<GraphNode,Array<number>>();

        this._activeNodeChange$.subscribe( (theNode) => { this._activeNode = theNode } );
    }

    addNode(theNode: GraphNode, edges: Array<number>) {
        this._adjList.set(theNode,edges);
    }

    // Returns all nodes in an array
    get nodes(): Array<GraphNode> {
        return Array.from(this._adjList.keys());
    }

    // Returns the comple adjacency list
    get adjList(): Map<GraphNode,Array<number>>{
        return this._adjList;
    }

    // Return the current active node
    get activeNode(): GraphNode {
        return this._activeNode;
    }

    //
    get activeNode$(){
        return this._activeNodeChange$.asObservable();
    }

    // Set the current active node
    set activeNode( theNode: GraphNode ) {
        // Set active flag to false for all nodes
        this.nodes.map( node => node.id == theNode.id ? node.isActive = true : node.isActive = false);
        // Set current node
        this._activeNodeChange$.next(theNode);
    }

    get firstNode(): GraphNode{
        let node: GraphNode;
        this.nodes.forEach( n => {
            if (n.isFirstNode) node = n;
        })
        return node;
    };

    // Searchs for a node using an id as key
    getNodeById(theNodeId: number): GraphNode | undefined {
        return this.nodes.find( node => theNodeId == node.id );
    }

    isActiveNodeNextTo(theNode: GraphNode): boolean {
        return this._adjList.get(this._activeNode).includes(theNode.id);
    }

}
