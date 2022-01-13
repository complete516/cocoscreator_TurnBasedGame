import { Asset, assetManager, AssetManager, AudioClip, Font, log, Prefab, resources, SpriteAtlas, SpriteFrame, warn } from "cc";
import { AssetType, ResData, ResMap } from "./ResConfig";

/**资源加载器 */
export default class ResMgr {
    private resMap: Map<string, Asset> = new Map<string, Asset>();
    private bundleMap: Map<string, AssetManager.Bundle> = new Map<string, AssetManager.Bundle>();
    /**总共需要加载的资源数*/
    private totalResNum: number = 0;
    /**加载完成资源数*/
    private loadCompleteResNum: number = 0;
    /**每帧最大加载资源数*/
    public maxFrameLoadNum: number = 5;
    /**当前帧加载数 */
    private currFrameLoadNum: number = 0;
    private static instance: ResMgr = null;

    public static get Instance() {
        if (ResMgr.instance == null) {
            ResMgr.instance = new ResMgr();
        }
        return ResMgr.instance;
    }

    /**
     * 加载资源
     * @param progressCB 进度回调 0-1
     * @param completeCB 加载完成回调
     */
    public LoadAllRes(progressCB?: (progress: number) => void, completeCB?: () => void) {
        let resList = ResMap.FirstResList;
        this.totalResNum = resList.length;
        for (let i = 0; i < resList.length; i++) {
            this.LoadRes(resList[i], () => {
                this.loadCompleteResNum++;
                if (progressCB) progressCB(this.loadCompleteResNum / this.totalResNum);
                if (this.loadCompleteResNum >= this.totalResNum) {
                    completeCB && completeCB();
                }
            });
        }
    }

    /**每帧加载资源*/
    public FrameLoadRes() {
        if (this.currFrameLoadNum >= ResMap.FrameResList.length) {
            return;
        }

        let frameList = ResMap.FrameResList;
        for (let i = this.currFrameLoadNum; i < this.currFrameLoadNum + this.maxFrameLoadNum; i++) {
            this.LoadRes(frameList[i])
        }
        this.currFrameLoadNum += this.maxFrameLoadNum;
    }

    /**加载资源 */
    private LoadRes(resName: string, callback?: Function) {
        let info = ResMap.ResConfigMap.get(resName);
        let bundleName = info.bundleName;
        if (bundleName == "") {
            this.LoadResourcesRes(info, (res: Asset) => {
                if (callback) callback(res)
            })
        } else {
            if (this.bundleMap.has(bundleName)) {
                this.LoadBundleRes(info, (res: Asset) => {
                    if (callback) callback(res)
                });
            } else {
                assetManager.loadBundle(bundleName, (err, bundle: AssetManager.Bundle) => {
                    if (err) {
                        log(err.message);
                        return;
                    }
                    this.bundleMap.set(bundleName, bundle);
                    this.LoadRes(resName, callback);
                });
            }
        }
    }

    /**加载bundle资源*/
    private LoadBundleRes(info: ResData, callback?: Function) {
        let fullPath = info.path + "/" + info.resName;
        this.bundleMap.get(info.bundleName).load(fullPath, this.GetResType(info.type), (err, res) => {
            if (err) {
                warn(err.message);
                return;
            }
            this.resMap.set(info.resName, res);
            if (callback) callback(res);
        })
    }

    /**加载resources下的资源 */
    private LoadResourcesRes(info: ResData, callback?: Function) {
        resources.load(info.fullPath, this.GetResType(info.type), (err, res) => {
            if (err) {
                log(err.message);
                return;
            }
            this.resMap.set(info.resName, res);
            if (callback) callback(res);
        })
    }

    /**
     * 获取资源
     * @param resName 资源名称
     * @param callback  回调
     * @returns isLoad:是否已加载 res:资源
     */
    public GetRes<T extends Asset>(resName: string, callback?: (res: T) => void): { isLoad: boolean, res: T } {
        if (!this.resMap.has(resName)) {
            this.LoadRes(resName, (res: Asset) => {
                if (callback) callback(res as T);
            })
            return { isLoad: false, res: null };
        } else {
            if (callback) callback(this.resMap.get(resName) as T);
            return { isLoad: true, res: this.resMap.get(resName) as T };
        }
    }

    /**测试方法 */
    /**直接加载资源 */
    public LoadAsset<T extends Asset>(resName: string, rt: typeof Asset & { prototype: T }, c: (res: T) => void) {
        resources.load(resName, rt, (err, T) => { })
    }


    /**删除资源 */
    public Release(resName: string) {
        if (this.resMap.has(resName)) {
            this.resMap.delete(resName);
            let info = ResMap.ResConfigMap.get(resName);
            if (info.resName == resName) {
                if (info.bundleName == "") {
                    resources.release(info.fullPath);
                } else {
                    this.bundleMap.get(info.bundleName).release(info.fullPath);
                }
            }
        }
    }

    /**获取资源类型 */
    private GetResType(resType: number) {
        if (resType == AssetType.Prefab) {
            return Prefab;
        } else if (resType == AssetType.Audio) {
            return AudioClip;
        } else if (resType == AssetType.Font) {
            return Font;
        } else if (resType == AssetType.SpriteFrame) {
            return SpriteFrame
        } else if (resType == AssetType.SpriteAtlas) {
            return SpriteAtlas;
        }
        return Prefab;
    }

}   