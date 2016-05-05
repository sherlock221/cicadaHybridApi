/**
 * Created by jiaaobo on 16/4/10.
 */

import Util from  "../util/util";
let HybridJS = Util.getRoot();


export  default class WebView {

    /**
     * 退出关闭webview
     * @param
     */
    static exit() {
        HybridJS.core.invokeNative("ui.webview.exit", {});
    };

    /**
     * 打开一个webview
     */
    static open(url) {
        HybridJS.core.invokeNative("ui.webview.open", {url : url, targetType : "single"});
    };


}

