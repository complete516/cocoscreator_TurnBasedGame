
class EventData {
    constructor(target: object, callback: Function) {
        this.target = target;
        this.callback = callback;
    }

    target: object = null;
    callback: Function = null;
}

/**游戏事件 */
export class GameEventMgr {
    private eventList: Map<string, EventData[]> = new Map<string, EventData[]>();
    private static instance: GameEventMgr = null;

    public static get Instance() {
        if (GameEventMgr.instance == null) {
            GameEventMgr.instance = new GameEventMgr();
        }
        return GameEventMgr.instance;
    }

    /**
     * 添加事件
     * @param evenType 事件类型
     * @param callBack 事件回调
     * @param target target
     */
    public AddEvent(evenType: string, callBack: Function, target: object) {
        if (!this.eventList.has(evenType)) {
            this.eventList.set(evenType, []);
        }

        let arr = this.eventList.get(evenType);
        for (let obj of arr) {
            if (obj.target == target) {
                console.log("重复注册事件")
                return
            }
        }

        arr.push(new EventData(target, callBack));
    }

    /**
     * 发送事件
     * @param evenType 事件类型 
     * @param data 事件数据
     */
    public EmitEvent(evenType: string, ...data: any[]) {
        if (!this.eventList.has(evenType)) {
            console.log("没有注册这个事件");
            return;
        }

        let arr = this.eventList.get(evenType);
        for (let obj of arr) {
            obj.callback && obj.callback(data);
        }
    }

    /**
     * 删除事件
     * @param evenType 事件类型
     * @param target 目标
     */
    public RemoveEvent(evenType: string, target: object) {
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