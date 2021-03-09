import { _decorator } from "cc";
import { UIType } from "../../Define/UIType";
import BaseUI from "./BaseUI";

const { ccclass, property } = _decorator

@ccclass("BasePopup")
export default class BasePopup extends BaseUI {
    public Enter() {
        super.Enter();
        this.uiType = UIType.Popup;
    }
}