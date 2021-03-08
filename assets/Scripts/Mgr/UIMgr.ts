
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;


@ccclass('UIMgr')
export class UIMgr extends Component {

    private static instance: UIMgr | null = null;




    public static get Instance() {
        if (UIMgr.instance == null) {
            UIMgr.instance = new UIMgr();
        }
        return UIMgr.instance;
    }

    public Open() {

    }

    public Close() {

    }
}


