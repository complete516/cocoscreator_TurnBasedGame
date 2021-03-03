import { Enemy } from "../../Game/Fight/Enemy";

export interface BaseConfig {

}

interface actionTime {
    actiondelay?:number,
    delay?:number
}

/**敌人配置 */
export interface ActorData {
    Id?: string,
    Hp?: number,
    Mp?: number,
    /**名字 */
    Name?: string,
    attack?: number,
    defense?: number,
    speed?: number,
    path: string,
    attackGrow?: number,
    defenseGrow?: number,
    speedGrow?: number,
    scale?: number,
    battlePrefix?: string,
    attackTime?:actionTime,
    injuredTime?:actionTime,
    skillTime?:actionTime
}


export interface EnemyConfig extends BaseConfig {
    [key: string]: ActorData
}




export interface HeroConfig extends BaseConfig {
    [key: string]: ActorData
}


interface BattleData {
    x: number,
    y: number,
    zOrder: number,
    direction: number
}

export interface BattleConfig extends BaseConfig {
    [key: string]: BattleData;
}


interface SkillData {
    Id: string,
    BaseHarm: number,
    DebuffRate: number,
    BuffRate: number,
    Path: string
}

export interface SkillConfig extends BaseConfig {
    [key: string]: SkillData;
}