import { GameUI } from "../Define/UIType"
import { ConfigType } from "./ConfigType"

export let ConfigList: { type: ConfigType, path: string }[] = [
    { type: ConfigType.Hero, path: "GameConfig/Hero" },
    { type: ConfigType.Enemy, path: "GameConfig/Enemy" },
    { type: ConfigType.Battle, path: "GameConfig/BattleConfig" },
    { type: ConfigType.Skill, path: "GameConfig/Skill" }
]


export let UIConfig:Map<GameUI,string> = new Map<GameUI,string>([
    [GameUI.BagWindow,"Prefabs/UI/Window/BagView"],
])


