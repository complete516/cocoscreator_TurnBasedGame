import { PlayerData } from "./PlayerData";

export class GameData {
    private static instance: GameData = null!;
    private teamLevel: number = 0;
    private necessity: number = 0;
    private corps: Map<number, number> = new Map<number, number>();
    private heros: Map<number, PlayerData> = new Map<number, PlayerData>();

    public static get Instance() {
        if (GameData.instance == null) {
            GameData.instance = new GameData();
        }
        return GameData.instance;
    }

    public AddHero(id: number) {
        if (!this.heros.has(id)) {
            this.heros.set(id, new PlayerData());
        }
    }

    /**军团 */
    public get Corps() {
        return this.corps;
    }

    public get TeamLevel() {
        return this.teamLevel;
    }

    /**保存数据 */
    public get SavaData() {
        let data = {
            teamLevel: this.teamLevel,
            tems: this.corps,
            necessity: this.necessity,
        }
        return JSON.stringify(data);
    }

}