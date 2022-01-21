import { CCObject } from "cc";
import { Enemy } from "../Game/Fight/Enemy";

export interface BaseConfig {

}

interface actionTime {
    actiondelay?: number,
    delay?: number
}

export interface ActorData {
    Id?: string;
    Hp?: number;
    Mp?: number;
    /**名字 */
    Name?: string;
    /**攻击 */
    attack?: number;
    /**防御 */
    defense?: number;
    /**速度 */
    speed?: number;
    path: string;
    attackGrow?: number;
    defenseGrow?: number;
    speedGrow?: number;
    scale?: number;
    battlePrefix?: string;
    attackTime?: actionTime;
    injuredTime?: actionTime;
    skillTime?: actionTime;
}

/**敌人配置 */
export class HeroConfig {
    json: Map<string, ActorData>
    // constructor(json: Object) {
    //     for (let k of Object.keys(json)) {
    //         let info = <ActorData>json[k];
    //         this.json.set(k, info);
    //     }
    // }
}


// export interface EnemyConfig extends BaseConfig {
//     [key: string]: ActorData
// }




// export interface HeroConfig extends BaseConfig {
//     [key: string]: ActorData
// }


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