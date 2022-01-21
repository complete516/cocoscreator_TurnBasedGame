
import { _decorator, Component, Node, SpriteFrame, log } from 'cc';
import { ResName } from './Config/ResConf';
import { UIFormsDefine } from './Define/UIFormsDefine';
import { HeroConfig } from './ResData/ConfigData';
import ResMgr from './ResLoad/ResMgr';


import { UIManger } from './UIFrame/UIManger';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {

    start() {
        UIManger.Instance.ShowUIForms(ResName.UIBag);

        let conf = ResMgr.Instance.GetConfig(HeroConfig);
        log(conf)
        log(conf["1000001"]);
    }
} 
