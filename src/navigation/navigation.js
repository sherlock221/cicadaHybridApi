/**
 * Created by jiaaobo on 16/4/10.
 */

import Util from  "../util/util";
let HybridJS = Util.getRoot();


const NavigationType = {
    WEBVIEW: "webview",
    NATIVE: "native",
    PAGE: "page"
};

class Navigation {

    constructor() {
    };

    /**
     * 跳转至原生界面
     * @param topage
     * @param params
     */
    forwardNative(topage, params, callBack) {
        this.forward(NavigationType.NATIVE, topage, params, callBack);
    };

    /**
     * 跳转到新开webview页面
     * @param topage
     * @param params
     */
    forwardView(topage, params) {
        this.forward(NavigationType.WEBVIEW, topage, params);
    };

    /**
     * 当前容器内跳转
     * @param urlPage
     * @param params
     */
    forwardPage(urlPage, params) {
        window.location.href = urlPage;
    };


    forward(type, topage, params, callBack) {

        let api = "ui.nav.forward";

        var data = {
            type: type,
            topage: topage
        };

        if (params)
            data = Object.assign(data, params);

        if (callBack) {
            data.req_fn = HybridJS.core.registerCallBack(api, callBack);
        }
        HybridJS.core.invokeNative(api, data);
    };

}

const nav = new Navigation();
HybridJS.navigation = nav;
module.exports = nav;
