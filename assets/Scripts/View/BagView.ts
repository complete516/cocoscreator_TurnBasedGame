import { Button, Component, _decorator } from "cc";
import { UIMgr } from "../Mgr/UIMgr";


const { ccclass, property } = _decorator;
@ccclass('BagView')

export default class BagView extends Component {
    public Enter() {
       
    }


    public OnClose() {
        this.node.active = false;
    }
}