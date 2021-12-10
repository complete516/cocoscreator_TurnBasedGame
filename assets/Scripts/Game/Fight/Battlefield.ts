import { Component, instantiate, JsonAsset, Label, log, Prefab, randomRangeInt, resources, TERRAIN_HEIGHT_BASE, v3, Vec3, _decorator } from "cc";
import { BattleConfig, EnemyConfig, HeroConfig } from "../../ResData/ConfigData";
import { ConfigType } from "../../ResData/ConfigType";
import { ResMgr } from "../../Mgr/ResMgr";
import { GameData } from "../GameData"
import { Actor } from "./Actor";
import { Enemy } from "./Enemy";
import { AnimType, FontContent } from "../../Define/GameDefine";

/**战场 */
const { ccclass, property } = _decorator;

@ccclass('Battlefield')
/**战场 */
export class Battlefield extends Component {

    private heroList: Actor[] = [];
    private enemyList: Actor[] = [];
    /**回合数 */
    private roundNumber: number = 0;

    @property(Prefab)
    public enemyPfb: Prefab = null!;

    @property(Prefab)
    public heroPfb: Prefab = null!;

    private attackOrderList: Actor[] = []

    private actionInterval: number = 2;
    private currActionInterval: number = 0;
    private currTime: number = 0;
    private isAction = false;
    @property(Label)
    private roundText: Label = null!;

    @property(Label)
    private resultText: Label = null!;

    onLoad() {
        this.roundText.string = "";
        this.resultText.string = "";
        this.Enter();
    }

    public Enter() {
        ResMgr.Instance.Skills = ["4000001", "4000002"];
        ResMgr.Instance.LoadConfig();
        GameData.Instance.Corps;
        ResMgr.Instance.OnCompleteCallback = this.OnComplete.bind(this);
    }


    OnComplete() {
        this.addEnemy("2000001", 1);
        this.addEnemy("2000001", 2);
        this.addEnemy("2000001", 3);
        this.addHero("1000001", 1)
        this.scheduleOnce(() => {
            this.NextRound();
        }, 2)
    }


    private addEnemy(Id: string, index: number) {
        let obj = instantiate(this.enemyPfb);
        obj.parent = this.node;
        let actor = obj.getComponent(Actor)!;
        actor?.Init(Id, index);
        this.enemyList.push(actor);
    }

    private addHero(Id: string, index: number) {
        let obj = instantiate(this.heroPfb);
        obj.parent = this.node;
        let actor = obj.getComponent(Actor)!;
        actor?.Init(Id, index);
        this.heroList.push(actor)
    }

    update(dt: number) {
        if (this.isAction) {
            this.currTime += dt;
            let interval = this.currActionInterval != 0 ? this.currActionInterval : this.actionInterval;
            if (this.currTime >= interval) {
                this.currActionInterval = 0;
                this.currTime = 0;
                this.Fight();
            }
        }
    }


    private NextRound() {
        this.currTime = 0;
        this.isAction = false;
        if (this.CheckGameResult()) {
            return;
        }

        this.isAction = true;
        this.roundNumber++;
        this.roundText.string = `第${this.roundNumber}回合`
        this.attackOrderList = this.attackOrderList.concat(this.enemyList, this.heroList);
        this.attackOrderList.sort((a, b) => a.Order - b.Order);
        this.Fight();
    }

    private Fight() {
        if (this.attackOrderList.length == 0) {
            this.NextRound();
            return;
        }

        if (this.CheckGameResult()) {
            this.isAction = false;
            return;
        }

        if (this.attackOrderList[0].IsDie()) {
            this.attackOrderList.splice(0, 1);
            this.Fight();
            return;
        }

        let actor = this.attackOrderList[0];
        let target: Actor | null = null;
        let actorList: Actor[] | null = null;
        if (actor.IsEnemy()) {
            actorList = this.heroList;
        } else {
            actorList = this.enemyList;
        }


        actorList = actorList.filter((a) => !a.IsDie());
        target = actorList[randomRangeInt(0, actorList.length)];

        actor.ReadyAttack(target);
        actor.node.setSiblingIndex(actor.node.children.length);
        this.currActionInterval = actor.actionTime;
        this.attackOrderList.splice(0, 1);
    }

    private CheckGameResult() {
        let isDefeated = this.heroList.filter(a => a.IsDie()).length == this.heroList.length;
        let isVictory = this.enemyList.filter(a => a.IsDie()).length == this.enemyList.length;
        if (isDefeated) {
            this.Defeated();
            return isDefeated;
        }

        if (isVictory) {
            this.Victory();
            return isVictory;
        }
        return false;
    }
    /**胜利 */
    private Victory() {
        this.isAction = false;
        this.Celebrate(this.heroList);
        this.resultText.string = FontContent.FightVictory;
    }

    /**失败 */
    private Defeated() {
        this.isAction = false;
        this.Celebrate(this.enemyList);
        this.resultText.string = FontContent.FightDefeated;
    }

    /**庆祝 */
    private Celebrate(actorList: Actor[]) {
        actorList.forEach((actor) => {
            if (!actor.IsDie()) {
                actor.PlayAnimation(AnimType.Celebrate);
            }
        })
    }


    private Exit() {
        ResMgr.Instance.RemoveBattlefieldAsset();
    }

}