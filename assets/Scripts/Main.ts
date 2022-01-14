
import { _decorator, Component, Node, SpriteFrame } from 'cc';
import { UIFormsDefine } from './Define/UIFormsDefine';


import { UIManger } from './UIFrame/UIManger';
import Utility from './Utility/Utility';
import BagView from './View/BagView';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {

    start() {
        UIManger.Instance.SetRoot(this.node);
        UIManger.Instance.ShowUIForms(UIFormsDefine.bag);

        Utility.LoadUrlTexture("", SpriteFrame, (res) => { })
    }
} 
