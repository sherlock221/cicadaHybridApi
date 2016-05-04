/**
 * Created by jiaaobo on 16/4/10.
 */

import Util from  "../util/util";
let HybridJS = Util.getRoot();


export  default class Loading {

    /**
     * 显示Loading
     * @param duration
     */
    static show() {
        HybridJS.core.invokeNative("ui.loading.toggle", {show: true});
    };

    /**
     * 隐藏loading
     */
    static hide() {
        HybridJS.core.invokeNative("ui.loading.toggle", {show: false});
    };



}

