import State from "./State";


export default class StateMachine<entityType> {
    owner: entityType = null;
    /**当前状态 */
    currentState: State<entityType> = null;
    /**前一个状态 */
    previousState: State<entityType> = null;
    /**全局状态 */
    globalState: State<entityType> = null;

    constructor(owner: entityType) {
        this.owner = owner;
    }

    /**改变当前状态 */
    public ChangeState(newState: State<entityType>) {
        if (!this.currentState) {
            console.error("current state is null");
            return;
        }

        this.previousState = this.currentState;
        this.currentState.Exit(this.owner);
        this.currentState = newState;
        this.currentState.Enter(this.owner);
    }

    /**当前状态 */
    public set CurrentState(state: State<entityType>) {
        this.currentState = state;
    }

    /**当前状态 */
    public get CurrentState() {
        return this.currentState;
    }

    /**上一个状态 */
    public set PreviousState(state: State<entityType>) {
        this.previousState = state;
    }

    /**上一个状态 */
    public get PreviousState() {
        return this.previousState;
    }

    /**返回上一个状态 */
    public RevertToPreviousState() {
        this.ChangeState(this.previousState);
    }

    public UpdateGame(dt: number) {
        if (this.currentState) this.currentState.Execute(this.owner);
        if (this.globalState) this.globalState.Execute(this.owner);
    }
}