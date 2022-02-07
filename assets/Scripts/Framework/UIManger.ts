/**
 * author wenying
 * 2021 03 /11
 * 参考 https://www.shuzhiduo.com/A/B0zqnj6KJv/
 */

import { Component, instantiate, log, Prefab, resources, Node, _decorator, v3, Vec3, CCObject } from "cc";
// import { ResMgr } from "../Mgr/ResMgr";
import ResMgr from "./ResMgr";
import BaseUIForm from "./BaseUIForm";
import { UIFormShowMode, UIFormType } from "./UIType";


const { ccclass, property } = _decorator;

@ccclass('UIManger')

export class UIManger extends Component {
    private static instance: UIManger | null = null;
    /**窗口堆栈，可以一个一个的关闭*/
    private formsStack: Array<BaseUIForm> = new Array<BaseUIForm>();
    /**窗口缓存*/
    private allUIForms: Map<string, BaseUIForm> = new Map<string, BaseUIForm>();
    /**ui根节点 */
    private uiRoot: Node | null = null;
    /**普通窗口的父节点 */
    private normalFormsParent: Node | null = null;
    /**固定窗口 */
    private fixedFormsParent: Node | null = null;
    /**弹窗 */
    private popUpFormsParent: Node | null = null;
    /**当前显示的窗口*/
    private currentShowForms: Map<string, BaseUIForm> = new Map<string, BaseUIForm>()

    /**当前显示窗口栈 */
    private showFormStack: Array<BaseUIForm> = new Array<BaseUIForm>();

    private dispatchData: Map<string, any> = new Map<string, any>();

    /**正在加载窗口列表，防止反复加载*/
    private loadingUIForms: Map<string, boolean> = new Map<string, boolean>();

    public static get Instance(): UIManger {
        return UIManger.instance;
    }

    onLoad() {
        UIManger.instance = this;
        this.Init();
    }

    public Init() {
        this.uiRoot = this.node;
        this.normalFormsParent = this.uiRoot.getChildByName("normalForms");
        this.fixedFormsParent = this.uiRoot.getChildByName("fixedForms");
        this.popUpFormsParent = this.uiRoot.getChildByName("popUpForms");
    }

    /**显示窗口
     * @param uiFormName 窗口名称
     */
    public ShowUIForms(uiFormName: string) {
        if (!this.allUIForms.has(uiFormName)) {
            this.LoadUIForms(uiFormName);
        } else {
            this.FormClassify(uiFormName);
        }
    }

    /**关闭窗口 */
    public CloseUIForms(uiFormName: string) {
        let uiForm = this.allUIForms.get(uiFormName);
        if (!uiForm) {
            log(`缓存中不存在:${uiFormName} CloseUIForms`)
            return;
        }

        switch (uiForm.FormShowMode) {
            case UIFormShowMode.Normal:
                this.ExitNormalForms(uiFormName);
                break;
            case UIFormShowMode.ReverseChange:
                this.PopUIForms();
                break;
            case UIFormShowMode.HideOther:
                this.ExitHideOtherForms(uiFormName);
                break;
        }

    }

    /**加载UI*/
    private LoadUIForms(uiFormName: string) {
        if (this.loadingUIForms.get(uiFormName)) {
            log(`${uiFormName}窗口正在加载...`)
            return;
        }

        ResMgr.Instance.LoadAsset(uiFormName, Prefab, (res) => {
            let node = instantiate(res);
            let uiForm = node.getComponent(BaseUIForm);
            if (uiForm != null) {
                if (this.dispatchData.has(uiFormName)) {
                    uiForm.data = this.dispatchData.get(uiFormName);
                    this.dispatchData.delete(uiFormName);
                }
                switch (uiForm.FormType) {
                    case UIFormType.Normal:
                        uiForm.node.setParent(this.normalFormsParent, false);
                        break;
                    case UIFormType.Fixed:
                        uiForm.node.setParent(this.fixedFormsParent, false);
                        break;
                    case UIFormType.PopUp:
                        uiForm.node.setParent(this.popUpFormsParent, false);
                        break;
                }
                uiForm.node.position = Vec3.ZERO;
                uiForm.node.active = false;
                this.allUIForms.set(uiFormName, uiForm);
                this.FormClassify(uiFormName);
            }
            this.loadingUIForms.set(uiFormName, true);
        });
    }

    /**窗口分类 */
    private FormClassify(uiFormName: string) {
        let uiForm = this.allUIForms.get(uiFormName);
        if (!uiForm) {
            log(`缓存中不存在:${uiFormName} FormClassify`)
            return;
        }

        switch (uiForm.FormShowMode) {
            case UIFormShowMode.Normal:
                this.EnterNormalForms(uiFormName);
                break;
            case UIFormShowMode.ReverseChange:
                this.PushUIForms(uiFormName);
                break;
            case UIFormShowMode.HideOther:
                this.EnterHideOtherForms(uiFormName)
                break;
        }
    }

    private PushUIForms(uiFormName: string) {

        if (this.formsStack.length > 0) {
            let uiForm = this.formsStack[0];
            uiForm.Freeze();
        }

        let uiForm = this.allUIForms.get(uiFormName);
        if (!uiForm) {
            log(`缓存中不存在:${uiFormName} PushUIForms`)
            return;
        }

        uiForm.Display();
        this.formsStack.push(uiForm);
    }

    /**弹出窗口 */
    private PopUIForms() {
        if (this.formsStack.length > 1) {
            let topForm = this.formsStack.pop();
            topForm?.Hiding();
            let nextForm = this.formsStack[this.formsStack.length - 1];
            nextForm.Redisplay();
        } else if (this.formsStack.length == 1) {
            let uiForm = this.formsStack.pop();
            uiForm?.Hiding();
        }
    }

    /**隐藏其他窗口 */
    private EnterHideOtherForms(uiFormName: string) {
        let uiForm = this.allUIForms.get(uiFormName);
        if (!uiForm) {
            log(`缓存中不存在:${uiFormName} EnterHideOtherForms`)
            return;
        }

        this.currentShowForms.forEach((val, key) => val.Hiding());
        this.showFormStack.forEach((val, key) => val.Hiding);

        this.currentShowForms.set(uiFormName, uiForm);
        uiForm.Display();
    }


    /**显示普通示窗口 */
    private EnterNormalForms(uiFormName: string) {
        let uiForm = this.allUIForms.get(uiFormName);
        if (!uiForm) {
            log(`缓存中不存在:${uiFormName} EnterNormalForms`)
            return;
        }
        this.currentShowForms.set(uiFormName, uiForm);
        uiForm.Display();
    }

    /**退出普通窗口 */
    private ExitNormalForms(uiFormName: string) {
        let uiForm = this.currentShowForms.get(uiFormName);
        if (!uiForm) {
            log(`缓存中不存在:${uiFormName} ExitNormalForms`);
            return;
        }
        uiForm.Hiding();
        this.currentShowForms.delete(uiFormName);
    }

    /**退出隐藏窗口 */
    private ExitHideOtherForms(uiFormName: string) {
        let uiForm = this.currentShowForms.get(uiFormName);
        if (!uiForm) {
            log(`缓存中不存在:${uiFormName} ExitHideOtherForms`);
            return;
        }

        uiForm.Hiding();
        this.currentShowForms.delete(uiFormName);
        this.currentShowForms.forEach((val, key) => val.Redisplay());
        this.showFormStack.forEach((val, key) => val.Redisplay());
    }

    public SetFormsData(uiFormName: string, data: any) {
        //在缓存中就可以直接执行这个消息
        if (this.allUIForms.has(uiFormName)) {
            let uiForm = this.allUIForms.get(uiFormName);
            uiForm && (uiForm.data = data);
            return
        }
        this.dispatchData.set(uiFormName, data);
    }
}