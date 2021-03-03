
import { _decorator, Component, Node, Prefab, ScrollView, instantiate, v3, UITransform, Label, log, math, Size, Vec3, Camera, } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('RankView')
export class RankView extends Component {

    @property(Prefab)
    public rankItem: Prefab | null = null;

    private rankList: ScrollView | null = null;

    private items: Node[] = [];

    private itemH: number = 0
    private itemTotalNum: number = 0;
    private realItemNum: number = 0;
    private itemArr: Node[] = [];
    private data = [];
    private visibleSize: Size = new Size(240, 250);
    private currOffset: Vec3 = Vec3.ZERO;

    private firstIndex: number = 0;
    private lastIndex: number = 0;

    private prevOffset: Vec3 = Vec3.ZERO;

    onLoad() {
        this.rankList = this.getComponent(ScrollView);
    }


    start() {
        this.itemH = 50; //包括间隙
        this.itemTotalNum = 180;
        this.realItemNum = Math.floor(this.visibleSize.height / this.itemH) + 2;
        this.initItem();



    }

    initItem() {

        this.rankList?.node.on(ScrollView.EventType.SCROLLING, this.onScroll.bind(this), this)

        let totalH = this.itemTotalNum * this.itemH;
        let content = this.rankList?.content!;
        content.getComponent(UITransform)?.setContentSize(this.visibleSize.width, totalH);
        this.prevOffset = v3(this.rankList?.getScrollOffset()!);
        this.initObj();
    }

    initObj() {
        for (let i = 0; i < this.realItemNum; i++) {
            let item = instantiate(this.rankItem!);
            let new_y = -this.itemH / 2 - this.itemH * i;
            item.position = v3(item.position.x, new_y);
            item.parent = this.rankList?.content!;
            this.itemArr.push(item);
            this.refreshData(i, item)
        }
        this.lastIndex = this.realItemNum - 1;
    }

    onScroll() {
        this.refresh();
    }

    refresh() {
        this.currOffset = this.rankList?.getScrollOffset()!;

        let start_index = Math.floor(this.currOffset.y / this.itemH);
        // log(this.currOffset, "currOffset1111", start_index, this.prevOffset);

        let isOutMax = this.visibleSize.height + this.currOffset.y > (this.itemTotalNum - 1) * this.itemH
        if (start_index < 0 || isOutMax) {
            return;
        }
        let w = 0;
        if (this.currOffset.y > this.prevOffset.y) {
            w = this.currOffset.y - this.prevOffset.y;
        } else {
            w = this.currOffset.y - (this.prevOffset.y + this.itemH);
        }

        if (Math.abs(w) >= this.itemH) {

            if (w > 0) {
                while (this.currOffset.y + this.visibleSize.height >= (this.lastIndex) * this.itemH) {
                    this.lastIndex++;
                    let item = this.itemArr[0];
                    let new_y = -this.itemH / 2 - this.itemH * (this.lastIndex);
                    item.position = v3(item.position.x, new_y);
                    this.firstIndex++;

                    this.itemArr.splice(0, 1);
                    this.itemArr.push(item)
                    this.refreshData(this.lastIndex, item);
                }
                this.prevOffset = v3(0, this.currOffset.y);
            } else {

                while (this.firstIndex > 0 && this.currOffset.y - this.itemH <= (this.firstIndex - 1) * this.itemH) {
                    this.lastIndex--
                    this.firstIndex--;
                    let item = this.itemArr[this.itemArr.length - 1];
                    let new_y = -this.itemH / 2 - this.itemH * (this.firstIndex);
                    item.position = v3(item.position.x, new_y);
                    this.itemArr.splice(this.itemArr.length - 1, 1);
                    this.itemArr = [item].concat(this.itemArr)
                    this.refreshData(this.firstIndex, item);
                }
                this.prevOffset = v3(0, this.currOffset.y);
            }
        }

        // for (let i = 0; i < this.realItemNum; i++) {
        //     let item = this.itemArr[i];
        //     let new_y = -this.itemH / 2 - this.itemH * (i + start_index);
        //     item.position = v3(item.position.x, new_y);
        //     this.refreshData(i + start_index, item);
        // }

        // this.prevOffset = v3(0, this.currOffset.y);
        // }
    }

    //测试数据
    refreshData(dataIndex: number, item: Node) {
        log("refreshData", dataIndex)
        let lbl = item.getChildByName("Label")?.getComponent(Label)!;
        lbl.string = "aa" + dataIndex.toString();



    }

}



