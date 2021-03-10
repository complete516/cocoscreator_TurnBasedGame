import { Component, Label, log, ProgressBar, resources, sp, tween, UITransform, v3, Vec3, _decorator } from "cc";
import { ActorData, BattleConfig } from "../../ResData/ConfigData";
import { ConfigType } from "../../ResData/ConfigType";
import { ResMgr } from "../../Mgr/ResMgr";
import { Property } from "./Property";


export class Actor extends Component {
    /**位置*/
    protected targetPos: Vec3 = Vec3.ZERO;
    /**站位 */
    protected battlefieldId: string = "";
    protected originPos: Vec3 = Vec3.ZERO;
    protected Id: string = "";
    public sp: sp.Skeleton = null!;
    /**受击 */
    public injuerdHp: number = 0;
    protected hpBar: ProgressBar = null!;
    public property: Property = null!;
    public direction: number = 1;

    public confData: ActorData | null = null;
    
    public actionTime: number = 0;

    onLoad() {
        this.sp = this.node.getChildByName("Spine")?.getComponent(sp.Skeleton)!;
        this.hpBar = this.node.getChildByName("Hp")?.getComponent(ProgressBar)!;
        this.property = new Property();

        this.sp.setCompleteListener((trackEntry) => {
            let name = trackEntry.animation ? trackEntry.animation.name : "";
            if (name == "attack") {
                this.AttackToStand();
            } else if (name == "injured") {
                this.InjuredToStand();
            } else if (name == "skill") {
                this.SkillToStand();
            }
        });
    }

    Init(Id: string, index: number) { }

    public ShowActor(path: string, scale: number) {
        this.LoadSpine(path);
        let bConf = ResMgr.Instance.GetConfig<BattleConfig>(ConfigType.Battle)[this.battlefieldId];
        this.direction = bConf.direction;
        let dir = v3(this.sp.node.scale);
        dir.x *= bConf.direction;
        this.sp.node.scale = v3(dir).multiplyScalar(scale);
        this.node.position = v3(bConf.x, bConf.y);
        this.originPos = v3(this.node.position);
    }

    public ReadyAttack(target: Actor) {

    }


    /**移动 */
    public Move(pos: Vec3, callback?: Function) {
        this.targetPos = pos;
        tween(this.node).to(0.5, { position: pos }).call(() => {
            callback && callback();
        }).start();
    }


    public Injured(injuredHp: number) {
        this.injuerdHp += injuredHp;
        let injuredTime = this.confData?.injuredTime;
        tween(this.node).delay(injuredTime?.delay!).call(() => {
            this.PlayAnimation("injured", false);
            this.UpdateHP();
        }).start();
    }

    private UpdateHP() {
        let hp = this.property.hp - this.injuerdHp;
        hp = hp < 0 ? 0 : hp;
        this.hpBar.progress = (hp) / this.property.hp
    }

    public IsDie() {
        return this.injuerdHp - this.property.hp >= 0
    }

    public get Order() {
        return 1;
    }

    //行动
    public IsCanAction() {

    }

    /**播放动画 */
    public PlayAnimation(aniName: string, isLoop: boolean = true) {
        this.sp.loop = isLoop;
        this.sp.animation = aniName;
    }


    /**清除状态 */
    public ClearStatus() {

    }

    /**清除所有状态 */
    public ClearAllStatus() {

    }

    public IsEnemy() {
        return false;
    }

    protected LoadSpine(path: string) {
        resources.load(path, sp.SkeletonData, (err, res: sp.SkeletonData) => {
            if (err) {
                log(err.message);
                return;
            }
            this.sp.skeletonData = res;
            this.PlayAnimation("stand");
        })
    }


    protected AttackToStand() {

    }

    protected InjuredToStand() {

    }

    protected SkillToStand() {

    }
}