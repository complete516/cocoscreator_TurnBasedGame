import { ConfigType } from "./ConfigType"

export let ConfigList: { type: ConfigType, path: string }[] = [
    { type: ConfigType.Hero, path: "GameConfig/Hero" },
    { type: ConfigType.Enemy, path: "GameConfig/Enemy" },
    { type: ConfigType.Battle, path: "GameConfig/BattleConfig" },
    { type: ConfigType.Skill, path: "GameConfig/Skill" }
]

