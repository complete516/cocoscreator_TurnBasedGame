import { Button, Component, log, _decorator } from "cc";
import BaseUIForm from "../Framework/BaseUIForm";
import { UIManger } from "../Framework/UIManger";
import { UIFormShowMode, UIFormType } from "../Framework/UIType";



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