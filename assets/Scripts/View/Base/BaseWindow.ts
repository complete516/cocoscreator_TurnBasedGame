import { Button, _decorator } from "cc";
import { UIType } from "../../Define/UIType";
import BaseUI from "./BaseUI";

const { ccclass, property } = _decorator
@ccclass("BaseWindow")
export default class BaseWindow extends BaseUI {
    public Enter() {
        this.uiType = UIType.Normal;
        let closeBtn = this.node.getChildByName("CloseBtn")?.getComponent(Button)!;
        if (closeBtn) {
            closeBtn.node.on("click",this.OnClose.bind(this));
        }
    }

    public OnClose() {

    }

}