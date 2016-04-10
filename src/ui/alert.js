/**
 * Created by jiaaobo on 16/4/10.
 */

import Util from  "../util/util";
let HybridJS = Util.getRoot();

export  default class Alert {

    static show(message) {
        HybridJS.core.invokeNative("ui.alert", {message: message, display: true});
    };

    static hide() {
        HybridJS.core.invokeNative("ui.alert", {display: false});
    }
}
