import { log } from "cc";
import { ResConfig } from "../Config/ResConf";

/**主资源需要立刻加载的*/
export enum AssetType {
    None = 0,
    /**预制体 */
    Prefab,
    /**字体 */
    Font,
    /**音效 */
    Audio,
    /**精灵 */
    SpriteFrame,
    /**图集 */
    SpriteAtlas,
    /**json*/
    Json,
    /**文本 */
    Text,
    /**顾客动画 */
    Spine,
}

/**资源加载类型 */
export enum ResLoadType {
    /**不加载 自己手动加载的*/
    None,
    /**优先加载 load的时候就加载*/
    First,
    /**分帧加载 这个需要设置一帧加载多少个资源默然一帧加载5个资源*/
    Frame
}

/**资源数据 */
export class ResData {
    /**资源名字 */
    resName: string = "";
    /**路径 */
    path: string = "";
    /**资源名字 */
    fullPath: string = "";
    /**类型 */
    type: AssetType = AssetType.None;
    /**bundle名称,如果是resources路径下为"" */
    bundleName: string = "";
    /**资源加载类型*/
    loadType: ResLoadType = ResLoadType.None;
    /**FGUI包名 */
    // fGUIPackName: string = "";
    // /**FGUI资源名字*/
    // fGUIResName: string = "";
    /**
     * 
     * @param resName 资源名称
     * @param path 资源路径
     * @param type 资源类型
     * @param loadType 加载类型默认不加载
     * @param bundleName  bundle名称默认""在resources目录下
    //  * @param fPackName fgui包名
    //  * @param fResName fgui资源名
     */
    constructor(resName: string, path: string, type: AssetType,
        loadType: ResLoadType = ResLoadType.None, bundleName: string = "") {
        this.type = type;
        this.path = path;
        this.resName = resName;
        this.bundleName = bundleName;
        this.loadType = loadType;
        this.fullPath = this.path + "/" + this.resName;
        // this.fGUIPackName = fPackName;
        // this.fGUIResName = fResName;
    }
}

export class ResMap {
    private static resNameToKeyObj: { [key: string]: number } = {};
    private static firstResList: number[] = [];
    private static frameResList: number[] = [];

    /**添加资源 */
    public static AddRes(resList: ResData[]) {
        // this.resConfigMap = map;
        // this.resConfigMap.forEach((item) => {
        //     if (item.loadType == ResLoadType.First) {
        //         this.firstResList.push(item.resName);
        //     } else if (item.loadType == ResLoadType.Frame) {
        //         this.frameResList.push(item.resName);
        //     }
        // });
        for (let i = 0; i < resList.length; i++) {
            let data = resList[i];
            this.resNameToKeyObj[data.resName] = i;
            if (data.loadType == ResLoadType.First) {
                this.firstResList.push(i);
            } else if (data.loadType = ResLoadType.Frame) {
                this.frameResList.push(i);
            }
        }

    }

    public static GetResIndex(resName: string) {
        return this.resNameToKeyObj[resName]
    }

    public static GetResConfig(resName: string | number) {
        if (typeof (resName) == 'number') {
            return ResConfig[resName];
        }
        log(ResConfig);
        log(this.resNameToKeyObj[resName]);
        return ResConfig[this.resNameToKeyObj[resName]];
    }




    /**优先需要加载的资源 */
    public static get FirstResList() {
        return ResMap.firstResList;
    }

    /**分帧加载的资源 */
    public static get FrameResList() {
        return ResMap.frameResList;
    }


}

