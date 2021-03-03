
import { _decorator, Component, Node, EventTouch, log, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MapMove')
export class MapMove extends Component {

    private isTouch: boolean = false;
    private originPosX: Vec3 = Vec3.ZERO;
    // private moveStep: number = 50;

    start() {
        this.originPosX = this.node.position;
        this.node.on(Node.EventType.TOUCH_START, () => {
            this.isTouch = true;
        }, this)

        this.node.on(Node.EventType.TOUCH_MOVE, (event: EventTouch) => {
                let x = event.getLocationX() - event.getPreviousLocation().x;
                let pos = this.node.position;
                if (Math.abs(pos.x + x) >= 710) {
                    this.node.position = new Vec3((x > 0 ? 1 : -1) * 710, pos.y, pos.z);
                } else {
                    this.node.position = new Vec3(pos.x + x, pos.y, pos.z)
                }
        }, this)
    }


    OnTouchMove(event: EventTouch) {

    }


    OnTouchStart(even: EventTouch) {

    }


}


