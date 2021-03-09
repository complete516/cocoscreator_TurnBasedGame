
import { _decorator, Component, Node } from 'cc';
import { GameUI } from './Define/UIType';
import { UIMgr } from './Mgr/UIMgr';
import BagView from './View/BagView';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {

    start() {
        UIMgr.Instance.UIRoot = this.node;
        UIMgr.Instance.Open(GameUI.BagWindow);
    }

}


