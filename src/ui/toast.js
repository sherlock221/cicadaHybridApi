/**
 * Created by jiaaobo on 16/4/10.
 */

import Util from  "../util/util";
let HybridJS = Util.getRoot();

export  default class Toast {

    static show(message, duration) {
        duration = duration || 2000;
        HybridJS.core.invokeNative("ui.toast", {message: message, display: true, duration: duration});
    };

    static hide() {
        HybridJS.core.invokeNative("ui.toast", {display: false});
    }
}

