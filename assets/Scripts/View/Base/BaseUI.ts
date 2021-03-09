import { Component, Overflow, _decorator } from "cc";
import { UIType } from "../../Define/UIType";

const { ccclass, property } = _decorator;


@ccclass('BaseUI')
export default class BaseUI extends Component {
    private uiType: UIType = UIType.None;
    public Enter() { }
    public Execute() { }
    public Exit() { }

    public get CurrentUIType() {
        return this.uiType;
    }
    
    public set CurrentUIType(uiTpe: UIType) {
        this.uiType = this.uiType;
    }
}

