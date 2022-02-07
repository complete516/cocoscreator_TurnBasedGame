
import { _decorator, Component, Node, SpriteFrame, log } from 'cc';
import { ResName } from './Config/ResConf';
import { HeroConfig } from './Data/ConfigData';
import ResMgr from './Framework/ResMgr';


import { UIManger } from './Framework/UIManger';
const { ccclass, property } = _decorator;

@ccclass('MainScene')
export class MainScene extends Component {

    start() {
        UIManger.Instance.ShowUIForms(ResName.UIBag);

        let conf = ResMgr.Instance.GetConfig(HeroConfig);
        log(conf)
        log(conf["1000001"]);
    }
} 
