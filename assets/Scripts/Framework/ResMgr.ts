import { Asset, assetManager, AssetManager, AudioClip, Font, JsonAsset, log, Prefab, resources, sp, SpriteAtlas, SpriteFrame, TextAsset, warn, } from "cc";
import { ResConfig } from "../Config/ResConf";
import { AssetType, ResData, ResMap } from "./ResMap";


/**资源加载器 */
export default class ResMgr {
    private resMap: Map<string, Asset> = new Map<string, Asset>();
    private bundleMap: Map<string, AssetManager.Bundle> = new Map<string, AssetManager.Bundle>();
    private confMap: Map<string, Object> = new Map<string, Object>();
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
     * 加载资源 主要加载的资源是type为ResLoadType.First的资源，其他资源不加载
     * @param progressCB 进度回调 0-1
     * @param completeCB 加载完成回调
     */
    public LoadAllRes(progressCB?: (progress: number) => void, completeCB?: () => void) {
        ResMap.AddRes(ResConfig);
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
    private LoadRes(index: number, callback?: Function) {
        let info = ResMap.GetResConfig(index);
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
                    this.LoadRes(index, callback);
                });
            }
        }
    }

    /**加载bundle资源*/
    private LoadBundleRes(info: ResData, callback?: Function) {

        this.bundleMap.get(info.bundleName).load(info.fullPath, this.GetResType(info.type), (err, res) => {
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
            this.LoadRes(ResMap.GetResIndex(resName), (res: Asset) => {
                if (callback) callback(res as T);
            })
            return { isLoad: false, res: null };
        } else {
            if (callback) callback(this.resMap.get(resName) as T);
            return { isLoad: true, res: this.resMap.get(resName) as T };
        }
    }

    /**直接加载资源 */
    public LoadAsset<T extends Asset>(resName: string, rt: typeof Asset & { prototype: T }, c: (res: T) => void) {
        let info = ResMap.GetResConfig(resName);
        if (info.bundleName == "") {
            this.LoadResourcesRes(info, (res: T) => {
                c && c(res as T);
            });
        } else {
            this.LoadBundleRes(info, (res: T) => {
                c && c(res as T);
            })
        }
    }

    /**
     * 根据路径加载资源
     * @param fullPath  完整路径 path+resName;
     * @param t 类型
     * @param bundleName bundle名字 没有填“” 
     * @param c 回调函数
     */
    public LoadAssetToPath<T extends Asset>(fullPath: string, t: typeof Asset & { prototype: T }, bundleName: string = "", c?: (res: T) => void) {
        if (this.resMap.has(fullPath)) {
            c && c(this.resMap.get(fullPath) as T);
            return;
        }


        if (bundleName == "") {
            resources.load(fullPath, t, (err, res: T) => {
                if (err) {
                    log(err.message);
                    return;
                }
                this.resMap.set(fullPath, res);
                c && c(res as T);
            })
        } else {

            if (this.bundleMap.has(bundleName)) {

            }
            assetManager.loadBundle(bundleName, (err, bundle) => {
                this.bundleMap.set(bundleName, bundle);
                bundle.load(fullPath, t, (err, res: T) => {
                    if (err) {
                        log(err.message);
                        return;
                    }
                    this.resMap.set(fullPath, res);
                    c && c(res as T);
                })
            })
        }
    }


    /**删除资源 */
    public Release(resName: string) {
        if (this.resMap.has(resName)) {
            this.resMap.delete(resName);
            let info = ResMap.GetResConfig(resName);
            if (info.resName == resName) {
                if (info.bundleName == "") {
                    resources.release(info.fullPath);
                } else {
                    this.bundleMap.get(info.bundleName).release(info.fullPath);
                }
            }
        }
    }

    /**释放Bundle*/
    public ReleaseBundle(bundleName: string) {
        if (this.bundleMap.get(bundleName)) {
            this.bundleMap.get(bundleName).releaseAll();
        }
    }

    /**获取配置*/
    public GetConfig<T extends Object>(constructor: { prototype: T }) {
        let json = (this.resMap.get(constructor['name']) as JsonAsset).json;
        return <{ [key: string]: T }>json;
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
        } else if (resType == AssetType.Json) {
            return JsonAsset;
        } else if (resType == AssetType.Text) {
            return TextAsset;
        } else if (resType == AssetType.Spine) {
            return sp.SkeletonData;
        }
        return Prefab;
    }

}   