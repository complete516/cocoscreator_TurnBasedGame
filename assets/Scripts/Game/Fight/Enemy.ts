import { Button, log, resources, sp, tween, UITransform, v3, _decorator } from "cc";
import { ActorData, BattleConfig, EnemyConfig } from "../../ResData/ConfigData";
import { ConfigType } from "../../ResData/ConfigType";
import { ResMgr } from "../../Mgr/ResMgr";
import { Actor } from "./Actor";


const { ccclass, property } = _decorator;
@ccclass('Enemy')
export class Enemy extends Actor {


    Init(Id: string, index: number) {
        this.property.hp = 100;
        this.Id = Id;
        let conf = ResMgr.Instance.GetConfig<EnemyConfig>(ConfigType.Enemy);
        this.confData = conf[this.Id];
        this.battlefieldId = `${this.confData.battlePrefix}${index}`
        let bConf = ResMgr.Instance.GetConfig<BattleConfig>(ConfigType.Battle)[this.battlefieldId];
        this.ShowActor(this.confData.path, this.confData.scale!);
        this.property.attack = this.confData.attack!;
    }

    public ReadyAttack(target: Actor) {
        let pos = v3(target.node.position);
        let w = target.sp.node.getComponent(UITransform)?.width!;
        pos.x -= this.direction * w / 1.2 * target.sp.node.scale.x;

        this.Move(pos, () => {
            this.PhysicsAttack(target)
        });
        this.actionTime = this.confData?.attackTime?.actiondelay! + 1;
    }

    public PhysicsAttack(target: Actor) {
        this.PlayAnimation("attack", false);
        target.Injured(10);
    }

    protected AttackToStand() {
        this.PlayAnimation("stand");
        this.Move(this.originPos);
    }

    protected InjuredToStand() {
        if (this.IsDie()) {
            this.PlayAnimation("death", false);
        }else{
            this.PlayAnimation("stand");
        }
    }

    public IsEnemy() {
        return true;
    }
}