/**动画类型 */
export const AnimType = {
    /**站立 */
    Stand: "stand",
    /**攻击 */
    Attack: "attack",
    /**死亡 */
    Death: "death",
    /**庆祝 */
    Celebrate: "celebrate"
}


export const FontContent = {
    FightDefeated: "战斗失败，再接再厉",
    FightVictory: "恭喜您战斗胜利",
}

/**游戏版本号 */
export const GameVersion = {
    Web: "1.0",
    Oppo: "",
    Vivo: "",
}

/**游戏平台 */
export const Platform = {
    Web: "Web",
    Oppo: "Oppo",
    Vivo: "Vivo",
    Wechat: "Wechat",
    /**抖音*/
    TikTok: "TikTok",
    /**安卓空包*/
    Android: "Android",
    Android_oppo: "Android_oppo",
    Android_vivo: "Android_vivo",
    Android_233: "Android_233",
    Android_google: "Android_google",
}

/**游戏平台 */
export const GamePlatform: string = Platform.Web;