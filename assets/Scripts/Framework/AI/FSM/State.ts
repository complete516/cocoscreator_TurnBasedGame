export default abstract class State<entityType>{
    /**进入 */
    public abstract Enter(owner: entityType): void;
    /**执行 */
    public abstract Execute(owner: entityType): void;
    /**退出 */
    public abstract Exit(owner: entityType): void;
}