import { Asset, JsonAsset, log, Prefab, resources } from "cc";
import { BaseConfig, EnemyConfig, HeroConfig, SkillConfig } from "../ResData/ConfigData";

import { ConfigList } from "../ResData/ResConfig";
import { ConfigType } from "../ResData/ConfigType";

export class ResMgr {
    private static instance: ResMgr = null!;
    public configDict: Map<ConfigType, BaseConfig> = new Map<ConfigType, BaseConfig>();

    public OnCompleteCallback: () => void = null!
    private cacheAsset: Map<string, Asset> = new Map<string, Asset>();
    private pfefabs: Map<string, Prefab> = new Map<string, Prefab>();
    private totalNum: number = 0;
    private skills: string[] = []

    public static get Instance() {
        if (ResMgr.instance == null) {
            ResMgr.instance = new ResMgr();
        }
        return ResMgr.instance;
    }

    public set Skills(skills: string[]) {
        this.skills = skills;
    }

    public LoadConfig() {
        let total = ConfigList.length;
        let index = 0;
        for (let i = 0; i < ConfigList.length; i++) {
            let data = ConfigList[i];
            let path = data.path;
            resources.load(path, JsonAsset, (error, res) => {
                if (error) {
                    log(error.message);
                    return;
                }
                this.configDict.set(data.type, res.json!);
                index++;
                if (index >= total) {
                    this.LoadSkill();
                }
                this.cacheAsset.set(path, res);
            })
        }
    }

    /**加载技能 */
    private LoadSkill() {
        if (this.skills.length == 0) {
            this.LoadComplete();
        } else {
            let conf = this.configDict.get(ConfigType.Skill) as SkillConfig;
            let total = this.skills.length;
            let index = 0;
            for (let i = 0; i < total; i++) {
                let data = conf[this.skills[i]];
                this.LoadPrefab(data.Path, (res: Prefab) => {
                    index++;
                    this.pfefabs.set(data.Id, res);
                    if (index >= total) {
                        this.LoadComplete();
                    }
                })
            }
        }
    }


    public LoadPrefab(path: string, callback?: (res: Prefab) => void) {
        resources.load(path, Prefab, (err, res) => {
            if (err) {
                log(err.message);
                return;
            }
            this.cacheAsset.set(path, res);
            callback && callback(res)
        })
    }

    /**删除 */
    public RemoveBattlefieldAsset() {

    }

    public LoadBattlefield(progressCallBack?: (progress: number) => void, completeCallback?: Function) {

    }

    public LoadComplete() {
        this.OnCompleteCallback && this.OnCompleteCallback();
    }


    public GetConfig<T extends BaseConfig>(type: ConfigType): T {
        let data = this.configDict.get(type);
        return data as T;
    }


    public ClearRes() {
        this.cacheAsset.forEach((val, path) => resources.release(path))
    }

    public get Prefabs() {
        return this.pfefabs;
    }


}