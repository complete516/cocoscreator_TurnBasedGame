import { _decorator } from 'cc';
import { Actor } from '../Fight/Actor';
import BaseSkill from './BaseSkill';
const { ccclass, property } = _decorator;

@ccclass('WindSkill')
export class WindSkill extends BaseSkill {
    private baseHarm: number = 0;
    private debuff: number[] = [];
    private buff: number[] = [];


    //技能伤害
    public SkillHarm(source: Actor, target: Actor) {
        let harm = source.property.attack - target.property.defense;
        return harm;
    }
}