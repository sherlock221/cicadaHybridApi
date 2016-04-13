/**
 * header组件 自定义
 * Created by jiaaobo on 16/4/10.
 */

import Util from  "../util/util";
let HybridJS = Util.getRoot();


export  default class Header {

    constructor(){

    };

    /**
     * 更新整个header
     */
    update(opts){
        if (!opts) return;

        //参考继续设计 http://www.cnblogs.com/yexiaochai/p/4921635.html
        let left = [];
        let right = [];
        let title = {};


        HybridJS.core.invokeNative("ui.header.update",{

        });
    };

    /**
     * 设置标题
     * @param title
     */
    setTitle(title){
        HybridJS.core.invokeNative("ui.header.setTitle",{
            title : title
        });
    };

    /**
     * 显示header
     */
    show(){
        HybridJS.core.invokeNative("ui.header.toggle",{
            show : true
        });
    };

    /**
     * 隐藏header
     */
    hide(){
        HybridJS.core.invokeNative("ui.header.toggle",{
            show : false
        });
    };



}

let  header = new Header();
HybridJS.ui.header  = header ;
module.exports = header;

