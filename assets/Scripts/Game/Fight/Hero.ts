import { Animation, Color, color, instantiate, log, math, Prefab, randomRangeInt, resources, sp, Sprite, tween, UITransform, v3, _decorator } from "cc";
import { Actor } from "./Actor";
// import { ResMgr } from "../../Mgr/ResMgr";
// import { ActorData, BattleConfig, EnemyConfig, HeroConfig, SkillConfig } from "../../ResData/ConfigData";
import { ConfigType } from "../../ResData/ConfigType";
import { Property } from "./Property";
import BaseSkill from "../Skill/BaseSkill";



const { ccclass, property } = _decorator;

@ccclass(`Hero`)
export default class Hero extends Actor {

    private skillIds: string[] = [];
    private skillList: BaseSkill[] = [];

    public Init(Id: string, index: number) {
    //     this.property.speed = 100;
    //     this.property.hp = 2000;
    //     this.Id = Id;
    //     let conf = ResMgr.Instance.GetConfig<HeroConfig>(ConfigType.Hero);
    //     this.confData = conf[this.Id];
    //     this.battlefieldId = `${this.confData.battlePrefix}${index}`
    //     let bConf = ResMgr.Instance.GetConfig<BattleConfig>(ConfigType.Battle)[this.battlefieldId];
    //     this.ShowActor(this.confData.path, this.confData.scale);

    //     this.property.attack = this.confData.attack!;
    //     this.property.defense = this.confData.defense!;
        
    //     this.skillIds.push("4000001");
    //     this.skillIds.push("4000002");
    //     this.AddSkill();
    }

    public ReadyAttack(target: Actor) {

        let rand = randomRangeInt(0, 100);
        if (rand <= 40) {
            let index = randomRangeInt(0, this.skillList.length);
            let skill = this.skillList[index];
            skill.node.parent = target.node;
            skill.node.setScale(v3(0.6, 1, 1));
            skill.node.position = v3(10, 50, 1);
            skill.Play();
            skill.SkillHarm(this, target);
            target.Injured(60);
            this.PlayAnimation("skill", false);
            // this.actionTime = this.confData?.skillTime?.actiondelay!
        } else {
            let pos = v3(target.node.position);
            let w = target.sp.node.getComponent(UITransform)?.width!;
            pos.x += this.direction * w / 1.2 * target.sp.node.scale.x;
            this.Move(pos, () => {
                this.PhysicsAttack(target);
            });
            // this.actionTime = this.confData?.attackTime?.actiondelay! + 1;
        }
    }

    public PhysicsAttack(target: Actor) {
        this.PlayAnimation("attack", false);
        target.Injured(50);
    }

    private AddSkill() {
        // let skillConf = ResMgr.Instance.GetConfig<SkillConfig>(ConfigType.Skill);
        // for (let i = 0; i < this.skillIds.length; i++) {
        //     let skillData = skillConf[this.skillIds[i]];
        //     let pfb = ResMgr.Instance.Prefabs.get(skillData.Id)!;
        //     let obj = instantiate(pfb);
        //     this.skillList.push(obj.getComponent(BaseSkill)!);
        // }
    }

    protected InjuredToStand() {
        if (this.IsDie()) {
            this.PlayAnimation("death", false);
        } else {
            this.PlayAnimation("stand");
        }
    }

    protected AttackToStand() {
        this.PlayAnimation("stand");
        this.Move(this.originPos);
    }

    protected SkillToStand() {
        this.PlayAnimation("stand");
    }

    public IsEnemy() {
        return false;
    }
}
