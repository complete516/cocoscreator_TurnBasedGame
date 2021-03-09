
import { _decorator, Component, Node, log, __private, resources, UI, instantiate, v3 } from 'cc';
import { GameUI, UIType } from '../Define/UIType';
import { UIConfig } from '../ResData/ResConfig';
import BagView from '../View/BagView';
import BaseUI from '../View/Base/BaseUI';
import { ResMgr } from './ResMgr';
const { ccclass, property } = _decorator;


@ccclass('UIMgr')
export class UIMgr extends Component {

    private static instance: UIMgr | null = null;
    private uiDict: Map<GameUI, BaseUI> = new Map<GameUI, BaseUI>();
    private uiRoot: Node | null = null;

    /**当前显示的窗口 */
    private currentWindow: BaseUI | null = null;

    public static get Instance() {
        if (UIMgr.instance == null) {
            UIMgr.instance = new UIMgr();
        }
        return UIMgr.instance;
    }

    public Open(ui: GameUI, data?: any) {
        if (!this.uiDict.has(ui)) {
            ResMgr.Instance.LoadPrefab(UIConfig.get(ui)!, (res) => {
                let obj = instantiate(res);
                obj.parent = this.UIRoot;
                obj.position = v3(0, 0, 0);
                
                let gamUI = obj.getComponent(BaseUI);
                gamUI?.Enter();
                if(gamUI?.CurrentUIType == UIType.Popup){
                    if(this.currentWindow){
                        obj.parent = this.currentWindow.node;
                    }else{
                        obj.parent = this.UIRoot;
                    }
                }
                this.uiDict.set(ui, gamUI!);
            })
        } else {
            this.uiDict.get(ui)?.Execute();
        }
    }


    public Close(ui: GameUI) {
        if (!this.uiDict.has(ui)) {
            return;
        }
        this.uiDict.get(ui)?.Exit();
    }


    public get UIRoot(): Node {
        return this.uiRoot!;
    }
    public set UIRoot(root: Node) {
        this.uiRoot = root;
    }
}


