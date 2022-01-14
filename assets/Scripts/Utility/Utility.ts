import { randomRangeInt, utils, Node, assert, assetManager, CCObject, Asset } from "cc";

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

    /**
     * 随机一个整数 [min,max]
     * @param min 最小值
     * @param max 最大值
     * @returns 随机的整数
     */
    public static RandomRangeInt(min: number, max: number) {
        return Math.floor(Math.random() * (max + 1 - min) + min);
    }

    /**数组随机，打乱数组 */
    public static ArrayRandValue(arr: any[]) {
        for (let i = 1; i < arr.length; i++) {
            const random = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[random]] = [arr[random], arr[i]];
        }
        return arr;
    }

    /**日期格式化 */
    public static TimeFormat(timstamp: number) {
        let date = new Date(timstamp);
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        return date;
    }

    /**获取时间戳 */
    public static TimeStamp() {
        return (new Date()).valueOf();
    }

    /**格式化数字补零 */
    public static FormatZeroPad(nr: number, base: number = 10) {
        var len = (String(base).length - String(nr).length) + 1;
        return len > 0 ? new Array(len).join('0') + nr : nr;
    }

    /**
 * 查找子节点
 * @param node 父节点
 * @param path 要查找的路径  ex:'node/fff'
 * @returns 找到的节点
 */
    public static FindChildByPath(node: Node, path: string) {
        let names = path.split("/");
        // cc.log(names, "FindChildByPath", path)
        let target: Node = node;
        if (names.length > 0) {
            for (let i = 0; i < names.length; i++) {
                if (target) {
                    target = target.getChildByName(names[i])
                }
            }
        } else {
            target = node.getChildByName(path);
        }
        return target;
    }

    /**判断是否到第二天了
     * @param 时间
     * @return true 第二天 false 不是
    */
    public static IsTomorrow(oldTime: number) {
        let currTime = Utility.TimeStamp();
        let lts = Utility.TimeFormat(oldTime).valueOf();
        let cts = Utility.TimeFormat(currTime).valueOf();
        let day = (cts - lts) / (1000 * 3600 * 24);
        return day >= 1;
    }

    /**今天是否签到*/
    public static IsTodaySigIn(signInTime: number) {
        if (signInTime == 0) {
            return false;
        }
        return !Utility.IsTomorrow(signInTime);
    }

    /**
     * 
     * @param calssName 类名  org/cocos2dx/javascript/AppActivity
     * @param funName 函数名称  TestPrint
     * @param param 参数jni  (Ljava/lang/String;)V
     * @param argv 参数列表
     */
    public static CallAndroid(calssName: string, funName: string, param: string, argv: string[]) {
        jsb.reflection.callStaticMethod(calssName, funName, param, argv);
    }


    public static LoadUrlTexture<T extends Asset>(url: string, type: typeof Asset & { prototype: T }, callback: (res: T) => void) {
        assetManager.loadRemote(url, type, (err, res) => {
            callback && callback(res as T);
        });
    }
}
