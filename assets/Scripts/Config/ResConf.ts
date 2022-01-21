import { AssetType, ResData, ResLoadType, ResMap } from "../ResLoad/ResMap";

export const ResPath = {
    Prefabs: "Prefabs",
    Enemy: "Prefabs/Enemy",
    UI: "Prefabs/UI",
    Config:"GameConfig",
}

export const ResName = {
    Enemy: "Enemy",
    Hero: "Hero",
    /**背包 */
    UIBag: "UIBagView",
    UIBottom: "UIBottomMenu",
    BattleConfig:"BattleConfig",
    EnemyConfig:"Enemy",
    HeroConfig:"HeroConfig",
    SkillConfig:"Skill",
}

/**资源配置*/
export let ResConfig: ResData[] = [
    new ResData(ResName.Enemy, ResPath.Enemy, AssetType.Prefab, ResLoadType.None),
    new ResData(ResName.Hero, ResPath.Enemy, AssetType.Prefab, ResLoadType.None),
    new ResData(ResName.UIBag, ResPath.UI, AssetType.Prefab, ResLoadType.First),
    new ResData(ResName.UIBottom, ResPath.UI, AssetType.Prefab, ResLoadType.First),

    /**游戏配置表*/
    new ResData(ResName.BattleConfig, ResPath.Config, AssetType.Json, ResLoadType.First),
    new ResData(ResName.EnemyConfig, ResPath.Config, AssetType.Json, ResLoadType.First),
    new ResData(ResName.HeroConfig, ResPath.Config, AssetType.Json, ResLoadType.First),
    new ResData(ResName.SkillConfig, ResPath.Config, AssetType.Json, ResLoadType.First),

];

