
export default class BaseNecessity {

    max: number = 0;

    prodSpeed: number = 0
    /** */
    prodCount: number = 0

    /** */
    isStop: boolean = false;

    /**开始 */
    public Start() {
        if (this.isStop) {
            return;
        }
        this.prodCount += this.prodSpeed;
        if (this.prodCount > this.max) {
            this.prodCount = this.max;
            this.isStop = true;
        }
    }
}