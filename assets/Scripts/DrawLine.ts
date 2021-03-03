
import { _decorator, Component, Node, Graphics, color, Color, log, Sprite, Texture2D, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DrawLine')
export class DrawLine extends Component {

    private mGraphics: Graphics | null = null

    start() {
        // this.mGraphics = this.node?.getComponent(Graphics)!;

        // this.mGraphics.lineWidth = 3;
        // this.mGraphics.strokeColor = Color.RED;

        // let offsy = -100;


        // for (let i = 0; i < 5; i++) {
        //     this.mGraphics.moveTo(0, i * 50 + offsy)
        //     this.mGraphics.lineTo(200, i * 50 + offsy);
        // }

        // this.mGraphics.stroke();

        // this.mGraphics.strokeColor = Color.GREEN;
        // this.mGraphics.moveTo(0, offsy);
        // this.mGraphics.lineTo(0, 230 + offsy);
        // this.mGraphics.stroke();


        // this.mGraphics.strokeColor = Color.BLACK;
        // let arr = [12, 0, 100, 150, 90, 180, 30, 200];
        // for (let i = 1; i < arr.length; i++) {
        //     this.mGraphics.moveTo((i - 1) * 20, arr[i - 1] + offsy);
        //     this.mGraphics.lineTo(i * 20, arr[i] + offsy)
        // }
        // this.mGraphics.stroke();
        // this.mGraphics.close();

        this.node.on(Node.EventType.TOUCH_START, (event: any) => {
            log(event.getLocation());

        }, this);

        this.node.on(Node.EventType.TOUCH_MOVE, (event: TouchEvent) => {
            // log(event);
        }, this);

   

    }
}


