import { Button, _decorator } from "cc";
import { UIMgr } from "../Mgr/UIMgr";
import BaseWindow from "./Base/BaseWindow";

const { ccclass, property } = _decorator;
@ccclass('BagView')

export default class BagView extends BaseWindow {
    public Enter() {
        super.Enter();
    }


    public OnClose() {
        this.node.active = false;
    }
}