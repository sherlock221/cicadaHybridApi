/**
 * Created by jiaaobo on 16/4/10.
 */

import Util from  "../util/util";
let HybridJS = Util.getRoot();

/**
 * 第三方分享模块
 */
export  default class SharePlatform {

    /**
     * 分享页面
     * @param itemId
     */
    static sharePage(setting) {

        var api = "api.sharePlatform.sharePage";

        let successSeed = HybridJS.core.registerCallBack(
            api,
            setting.success,
            "share_success"
        );

        let errorSeed = HybridJS.core.registerCallBack(
            api,
            setting.error,
            "share_error"
        );

        let cancelSeed = HybridJS.core.registerCallBack(
            api,
            setting.cancel,
            "share_cancel"
        );

        HybridJS.core.invokeNative(api, {
            url: setting.url,
            title: setting.title,
            content: setting.content,
            img: setting.img || "",
            platform: setting.platform || "all",
            success: successSeed,
            cancel: cancelSeed,
            error: errorSeed
        });

    };


}


