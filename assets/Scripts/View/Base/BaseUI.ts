import { Component, Overflow, _decorator } from "cc";
import { UIType } from "../../Define/UIType";

const { ccclass, property } = _decorator;


@ccclass('BaseUI')
export default class BaseUI extends Component {
    /**UI类型 */
    protected uiType: UIType = UIType.None;
    public Enter() {

    }

    public Execute() {

    }
    public Exit() { }

    public get CurrentUIType() {
        return this.uiType;
    }

}

