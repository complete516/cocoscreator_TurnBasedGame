export class Grid {
    private _startNode: Node;    //起点
    private _endNode: Node;      //终点
    private _nodes: Array<any>;  //Node数组
    private _numCols: number;    //网格行列
    private _numRows: number;

    // public arr = [];

    public constructor(numCols: number, numRows: number) {
        this._numCols = numCols;
        this._numRows = numRows;
        this._nodes = [];


        for (let i: number = 0; i < numCols; i++) {
            this._nodes[i] = [];
            for (let j: number = 0; j < numRows; j++) {
                this._nodes[i][j] = new Node(i, j);
                // this.arr[i*10 + j] = 0;
            }
        }
    }

    public getNode(x: number, y: number): Node {
        return this._nodes[x][y];
    }

    public setEndNode(x: number, y: number) {
        this._endNode = this._nodes[x][y];
    }

    public setStartNode(x: number, y: number) {
        this._startNode = this._nodes[x][y];
    }

    public setWalkable(x: number, y: number, value: boolean) {
        this._nodes[x][y].walkable = value;
        // this.arr[x*10 + y] = value ? 1 : 0;
    }

    public get endNode() {
        return this._endNode;
    }

    public get numCols() {
        return this._numCols;
    }

    public get numRows() {
        return this._numRows;
    }

    public get startNode() {
        return this._startNode;
    }

    public get Nodes() {
        return this._nodes;
    }
}


export class Node {
    public x: number;    //列
    public y: number;    //行
    public f: number;    //代价 f = g+h
    public g: number;    //起点到当前点代价
    public h: number;    //当前点到终点估计代价
    public walkable: boolean = true; //
    public parent: Node;
    public costMultiplier: number = 1.0;

    public constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export class AStar {
    private _open: Array<any>;               //待考察表
    private _closed: Array<any>;             //已考察表
    private _grid: Grid;               //网格
    private _endNode: Node;                  //终点Node
    private _startNode: Node;                //起点Node
    private _path: Array<any>;               //保存路径
    private _heuristic: Function;            //寻路算法
    private _straightCost: number = 1.0;     //上下左右走的代价
    private _diagCost: number = Math.SQRT2;  //斜着走的代价 

    /**缓存路径 */
    private cachePath: Map<string, Node[]> = new Map<string, Node[]>();

    public constructor() {
        //this._heuristic = this.manhattan;  
        //this._heuristic = this.euclidian;
        this._heuristic = this.diagonal;
    }

    /**
     * 
     * @param row 行
     * @param low 列
     * @param arr 检查数组
     */
    public SetMap(row: number, low: number, arr: any[]) {
        let grid = new Grid(low, row);
        this._grid = grid;
        // let arr = this._grid.Nodes;

        for (let i = 0; i < arr.length; i++) {
            let x = i % low;
            let y = Math.floor(i / low)
            this._grid.setWalkable(x, y, arr[i] != 1);
        }
    }

    private SetStarNode(x: number, y: number) {
        this._startNode = this._grid.getNode(x, y);
    }

    private SetEndNode(x: number, y: number) {
        this._endNode = this._grid.getNode(x, y);
    }


    /**
     * 寻路
     * @param startLocation 开始点
     * @param EndLocation  结束点
     * @returns 
     */
    public FindPath(startLocation: { x: number, y: number }, EndLocation: { x: number, y: number }): boolean {
        // this._grid = grid;
        this._open = [];
        this._closed = [];

        // this._startNode = this._grid.startNode;
        // this._endNode = this._grid.endNode;
        this.SetStarNode(startLocation.x, startLocation.y);
        this.SetEndNode(EndLocation.x, EndLocation.y);

        this._startNode.g = 0;
        this._startNode.h = this._heuristic(this._startNode);
        this._startNode.f = this._startNode.g + this._startNode.h;

        return this.search();
    }



    //查找路径
    private search(): boolean {
        var node: Node = this._startNode;
        while (node != this._endNode) {
            var startX = Math.max(0, node.x - 1);
            var endX = Math.min(this._grid.numCols - 1, node.x + 1);
            var startY = Math.max(0, node.y - 1);
            var endY = Math.min(this._grid.numRows - 1, node.y + 1);

            for (var i = startX; i <= endX; i++) {
                for (var j = startY; j <= endY; j++) {
                    //不让斜着走
                    if (i != node.x && j != node.y) {
                        continue;
                    }

                    var test: Node = this._grid.getNode(i, j);
                    if (test == node ||
                        !test.walkable ||
                        !this._grid.getNode(node.x, test.y).walkable ||
                        !this._grid.getNode(test.x, node.y).walkable) {
                        continue;
                    }

                    var cost: number = this._straightCost;
                    if (!((node.x == test.x) || (node.y == test.y))) {
                        cost = this._diagCost;
                    }
                    var g = node.g + cost * test.costMultiplier;
                    var h = this._heuristic(test);
                    var f = g + h;
                    if (this.isOpen(test) || this.isClosed(test)) {
                        if (test.f > f) {
                            test.f = f;
                            test.g = g;
                            test.h = h;
                            test.parent = node;
                        }
                    }
                    else {
                        test.f = f;
                        test.g = g;
                        test.h = h;
                        test.parent = node;
                        this._open.push(test);
                    }
                }
            }
            // for (var o = 0; o < this._open.length; o++) {
            // }
            this._closed.push(node);
            if (this._open.length == 0) {
                console.log("AStar >> no path found", this._grid.endNode, this._startNode);
                return false
            }

            let openLen = this._open.length;
            for (let m = 0; m < openLen; m++) {
                for (let n = m + 1; n < openLen; n++) {
                    if (this._open[m].f > this._open[n].f) {
                        let temp = this._open[m];
                        this._open[m] = this._open[n];
                        this._open[n] = temp;
                    }
                }
            }
            // this._open.sort((a, b) => a.f - b.f);

            node = this._open.shift() as Node;
        }
        this.buildPath();
        return true;
    }

    //获取路径
    private buildPath(): void {
        this._path = new Array();
        var node: Node = this._endNode;
        this._path.push(node);
        while (node != this._startNode) {
            node = node.parent;
            this._path.unshift(node);
        }
    }

    /**获取一个链表形式的路径 最后一个为空*/
    public get Path() {
        // let pathNode: { location: cc.Vec2, next: any } = null;
        // let next = null;
        // for (let i = 0; i < this._path.length; i++) {
        //     let pos = cc.v2(this._path[i].x, this._path[i].y);
        //     if (pathNode == null) {
        //         pathNode = { location: pos, next: null };
        //         next = pathNode;
        //     } else {
        //         next.next = { location: pos, next: null };
        //         next = next.next;
        //     }
        // }
        return this._path;
    }

    //是否待检查
    private isOpen(node: Node): boolean {
        for (var i = 0; i < this._open.length; i++) {
            if (this._open[i] == node) {
                return true;
            }
        }
        return false;
    }

    //是否已检查
    private isClosed(node: Node): boolean {
        for (var i = 0; i < this._closed.length; i++) {
            if (this._closed[i] == node) {
                return true;
            }
        }
        return false;
    }

    //曼哈顿算法
    private manhattan(node: Node) {
        return Math.abs(node.x - this._endNode.x) * this._straightCost + Math.abs(node.y + this._endNode.y) * this._straightCost;
    }


    private euclidian(node: Node) {
        var dx = node.x - this._endNode.x;
        var dy = node.y - this._endNode.y;
        return Math.sqrt(dx * dx + dy * dy) * this._straightCost;
    }

    private diagonal(node: Node) {
        var dx = Math.abs(node.x - this._endNode.x);
        var dy = Math.abs(node.y - this._endNode.y);
        var diag = Math.min(dx, dy);
        var straight = dx + dy;
        return this._diagCost * diag + this._straightCost * (straight - 2 * diag);
    }

    public get visited() {
        return this._closed.concat(this._open);
    }
}

