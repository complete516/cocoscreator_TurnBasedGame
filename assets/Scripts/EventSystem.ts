import BaseUIForm from "./UIFrame/BaseUIForm";

export class EventSystem {
    private eventList: Map<string, BaseUIForm[]> = new Map<string, BaseUIForm[]>();

    public AddEvent(eventName: string, pb: object) {
        if (!this.eventList.has(eventName)) {
            this.eventList.set(eventName, []);
        }
        this.eventList.get(eventName)?.push()
    }


    public dispatch(eventName: string,){
        
    }
}