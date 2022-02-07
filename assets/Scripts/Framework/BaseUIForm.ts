import { Button, Component, _decorator } from "cc";
import { UIManger } from "./UIManger";
import { UIFormShowMode, UIFormType } from "./UIType";

const { ccclass, property } = _decorator;


/**
 * 需要重写 InitUI UI获取都是在此方法中实现
 * 
*/
@ccclass('BaseUIForm')
export default class BaseUIForm extends Component {
    /**窗口类型 */
    public FormType: UIFormType = UIFormType.None;
    /**显示类型 */
    public FormShowMode: UIFormShowMode = UIFormShowMode.None;

    public data: any = null;

    onLoad() {
        this.InitUI();
    }

    start() {
        this.InitEvent();
    }

    /**显示 */
    public Display() {
        this.node.active = true;
        this.OnShow();
    }

    /**隐藏 */
    public Hiding() {
        this.node.active = false;
        this.OnHide();
    }

    /**重新显示 */
    public Redisplay() {
        this.node.active = true;
        this.OnShow();
    }

    /**冻结 */
    public Freeze() {
        this.node.active = true;
    }

    public SetData() {

    }

    /**
     * 初始化UI
     * 需要重写
     */
    protected InitUI(): void { }
    /**注册事件 在statr中调用 */
    protected InitEvent(): void { }
    /**界面显示的时候调用 */
    protected OnShow() { }
    /**界面隐藏的时候调用*/
    protected OnHide() { }

    public Close() {
        UIManger.Instance.CloseUIForms(this.node.name);
    }

    /**
     * 注册按钮事件
     * @param path 按钮在UI树中的路径 /隔开
     * @param callback 回调函数
     */
    public RigisterBtnEvent(path: string, callback: Function) {
        let btn = this.node.getChildByPath(path)?.getComponent(Button);
        btn?.node.on(Button.EventType.CLICK, callback, this);
    }

}