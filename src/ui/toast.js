/**
 * Created by jiaaobo on 16/4/10.
 */

import Util from  "../util/util";
let HybridJS = Util.getRoot();


export  default class Toast {

    /**
     * 显示toast
     * @param message
     * @param duration 毫秒 duration 为空 默认客户端设置
     * @param duration 毫秒 duration 为-1 则需要点击才能消失(未实现)
     */
    static show(message, duration) {
        duration = duration || "";
        HybridJS.core.invokeNative("ui.toast.toggle", {message: message, show: true, duration: duration});
    };

    /**
     * 隐藏toast
     */
    static hide() {
        HybridJS.core.invokeNative("ui.toast.toggle", {show: false});
    };



}

