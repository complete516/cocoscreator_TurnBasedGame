import { Animation, Component, _decorator } from "cc";
import { Actor } from "../Fight/Actor";

const { ccclass, property } = _decorator;


@ccclass('BaseSkill')
export default class BaseSkill extends Component {
    protected ani: Animation = null!;

    onLoad() {
        this.ani = this.getComponent(Animation)!
        this.ani.on(Animation.EventType.FINISHED, (type, state) => {
            this.Finished();
            this.node.active = false;
        }, this);
    }

    public Play() {
        this.node.active = true;
        this.ani.play();
    }

    /**技能伤害 */
    public SkillHarm(source: Actor, target: Actor) {

    }
    /**完成回调 */
    public Finished() {

    }
}