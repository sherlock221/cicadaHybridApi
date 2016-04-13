/**
 * Created by jiaaobo on 16/4/10.
 */

import Util from  "../util/util";
let HybridJS = Util.getRoot();


export  default class Toast {

    /**
     * 显示toast
     * @param message
     * @param duration 毫秒 如果duration = 0; 则一直显示
     */
    static show(message, duration) {

        duration = duration || 2000;
        HybridJS.core.invokeNative("ui.toast", {message: message, show: true, duration: duration});
    };

    /**
     * 隐藏toast
     */
    static hide() {
        HybridJS.core.invokeNative("ui.toast", {show: false});
    };


}

