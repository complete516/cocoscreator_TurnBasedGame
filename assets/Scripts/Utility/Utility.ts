import { randomRangeInt, utils } from "cc";

export default class Utility {
    /**金币转换 */
    public static Converter(money: number) {

        let retain = function (num: number, decimal: number) {
            let strNum = num.toString();
            let index = strNum.indexOf('.');
            if (index !== -1) {
                strNum = strNum.substring(0, decimal + index + 1)
            } else {
                strNum = strNum.substring(0)
            }

            let tempNum = parseFloat(strNum);
            if (Number.isInteger(tempNum)) {
                return tempNum.toString();
            }
            return tempNum.toFixed(decimal);
        }
        
        let arr = ["k", "m", "b", "t", "A", "B", "C", "D", "E", "F"];
        let k = 1000;
        let str = retain(money, 2);

        if (money >= k) {
            let temp = money;
            let digits = 0;
            while (temp >= k) {
                temp = Math.floor(temp / k);
                digits++;
            }
            str = retain(money / Math.pow(1000, digits), 2) + arr[digits - 1];
        } else {
            str = Math.floor(money).toString();
        }

        return str;
    }
}
