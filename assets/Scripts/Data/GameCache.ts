export default class GameCache {

    private money: number = 0;
    private static instance: GameCache = null;
    public static get Instance() {
        if (GameCache.instance == null) {
            GameCache.instance = new GameCache();
        }
        return GameCache.instance;
    }

    /**钱*/
    public get TotalMoney() {
        return this.money;
    }


    public GetCorps() {

    }

    public GetBattle() {

    }

}