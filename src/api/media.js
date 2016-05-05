/**
 * Created by jiaaobo on 16/4/10.
 */

import Util from  "../util/util";
let HybridJS = Util.getRoot();

/**
 * 支付模块
 */
export  default class Media {

    /**
     * 播放远程视频文件
     * @param url
     */
    static playVideoByRemoteUrl(url,setting) {
        if(!url) throw new Error("url为空!");

        var obj = Object.assign({url : url},setting);
        HybridJS.core.invokeNative("ui.media.playVideoByRemoteUrl",obj);
    };

    /**
     * 播放远程音频文件
     * @param url
     */
    static playAudioByRemoteUrl(url,setting) {
        if(!url) throw new Error("url为空!");
        var obj = Object.assign({url : url},setting);
        HybridJS.core.invokeNative("ui.media.playAudioByRemoteUrl",obj)
    };


}


