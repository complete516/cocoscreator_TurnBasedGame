import { Component, error, log, Prefab, resources, _decorator } from "cc";
import { ResMgr } from "../Mgr/ResMgr";
import BaseUIForms from "./BaseUIForms";

const { ccclass, property } = _decorator;

@ccclass('UIManger')

export class UIManger extends Component {
    private static instance: UIManger | null = null;
    /**窗口堆栈，可以一个一个的关闭*/
    private formsStack: Array<BaseUIForms> = new Array<BaseUIForms>();
    /**当前打开的窗口 */
    private currOpenForms: BaseUIForms | null = null;
    /**窗口缓存*/
    private dictAllUIForms: Map<string, BaseUIForms> = new Map<string, BaseUIForms>();
    /**ui根节点 */
    private uiRoot: Node | null = null;

    public static get Instance(): UIManger {
        if (UIManger.instance == null) {
            UIManger.instance = new UIManger();
        }
        return UIManger.instance;
    }

    public ShowUIForms(uiFormName: string) {
        if(!this.dictAllUIForms.has(uiFormName)){
            // ResMgr.Instance.LoadPrefab(uiFormName,);
        }
    }





}