import { Button, Component, log, _decorator } from "cc";
import BaseUIForm from "../UIFrame/BaseUIForm";
import { UIManger } from "../UIFrame/UIManger";
import { UIFormShowMode, UIFormType } from "../UIFrame/UIType";



const { ccclass, property } = _decorator;
@ccclass('BagView')

export default class BagView extends BaseUIForm {

    public FormType: UIFormType = UIFormType.Fixed;
    public FormShowMode: UIFormShowMode = UIFormShowMode.Normal;

    protected InitUI() {
        this.RigisterBtnEvent("CloseBtn", () => {
            this.Close();
        })
    }
}