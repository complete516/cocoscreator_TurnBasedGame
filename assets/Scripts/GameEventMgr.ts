import { GameEventType } from "./Define/GameEventType";

class EventData {
    constructor(target: object, callback: Function) {
        this.target = target;
        this.callback = callback;
    }

    target: object = null;
    callback: Function = null;
}

export class GameEventMgr {
    private eventList: Map<GameEventType, EventData[]> = new Map<GameEventType, EventData[]>();
    private static instance: GameEventMgr = null;

    public static get Instance() {
        if (GameEventMgr.instance == null) {
            GameEventMgr.instance = new GameEventMgr();
        }
        return GameEventMgr.instance;
    }

    public AddEvent(evenType: GameEventType, callBack: Function, target: object) {
        if (!this.eventList.has(evenType)) {
            this.eventList.set(evenType, []);
        }

        let arr = this.eventList.get(evenType);
        for (let obj of arr) {
            if (obj.target == target) {
                return
            }
        }

        arr.push(new EventData(target, callBack));
    }


    public EmitEvent(evenType: GameEventType, ...data: any[]) {
        if (!this.eventList.has(evenType)) {
      
            return;
        }

        let arr = this.eventList.get(evenType);
        for (let obj of arr) {
            obj.callback && obj.callback(data);
        }
    }

    public RemoveEvent(evenType: GameEventType, target: object) {
        if (!this.eventList.has(evenType)) {
            return;
        }

        let arr = this.eventList.get(evenType);
        for (let i = arr.length - 1; i >= 0; i--) {
            let obj = arr[i];
            if (obj.target == target) {
                arr.splice(i, 1);
            }
        }
    }
}