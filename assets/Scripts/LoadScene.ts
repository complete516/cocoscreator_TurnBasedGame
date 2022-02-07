
import { _decorator, Component, Node, CCObject, ProgressBarComponent, Label, find, LabelComponent, log, director } from 'cc';
import ResMgr from './Framework/ResMgr';

const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = LoadScene
 * DateTime = Fri Jan 21 2022 14:54:26 GMT+0800 (中国标准时间)
 * Author = _Complete
 * FileBasename = LoadScene.ts
 * FileBasenameNoExtension = LoadScene
 * URL = db://assets/Scripts/LoadScene.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */

@ccclass('LoadScene')
export class LoadScene extends Component {
    /**进度条 */
    private progressBar: ProgressBarComponent = null;
    /**进度label */
    private progressText: Label = null;
    /**当前进度 */
    private currProgress: number = 0;
    /**目标进度 */
    private targetProgress: number = 0;
    /**是否完成 */
    private isComplete: boolean = true;

    onLoad() {
        this.progressBar = find("Canvas/LoadBar").getComponent(ProgressBarComponent);
        this.progressText = find("Canvas/LoadText").getComponent(LabelComponent);
    }

    start() {
        this.RefreshProgress();
        ResMgr.Instance.LoadAllRes(this.OnProgressCallback.bind(this), this.OnLoadComplete.bind(this));
    }

    update(dt: number) {
        if (this.currProgress >= this.targetProgress) {
            return;
        }

        this.currProgress += dt;
        if (this.currProgress >= 1) {
            this.currProgress = 1;
            this.RefreshProgress();
            this.ReplaceScene();
        } else {
            this.RefreshProgress();
        }
    }

    private OnProgressCallback(progress: number) {
        this.targetProgress = progress;
    }

    /**资源加载完成 */
    private OnLoadComplete() {
        this.isComplete = true;
        if (this.currProgress >= 1) {
            this.ReplaceScene();
        }
    }

    /**切换场景 */
    private ReplaceScene() {
        if (this.isComplete) {
            director.loadScene("Main");
        }
    }

    /**刷新进度 */
    private RefreshProgress() {
        this.progressText.string = `${Math.floor(this.currProgress * 100)}%`;
        this.progressBar.progress = this.currProgress;
    }

}

