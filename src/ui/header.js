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
     *
     * iconType : 1 | 2  1:为图标  2:文字
     */
    static update(opts){

        //容错处理
        if (!opts) return;
        if(!opts.left) opts.left = [];
        if(!opts.right) opts.right = [];
        if(!opts.title) opts.title = "";

        //api名称
        let api = "ui.header.update";

        //返回按钮
        let backBtn = {
            tagName: 'back',
            value : "icon-back",
            iconType : 1
        };

        let settings = {
            left :[],
            right : [],
            title : ""
        };

        let _billBack = function(btn){
            if(btn.callBack && Util.isFn(btn.callBack)){
                let seed = HybridJS.core.registerCallBack(
                    api,
                    btn.callBack,
                    btn.tagName
                );
                btn.req_fun = seed;
                delete btn.callBack;
            }
        };

        settings.left = settings.left.concat([backBtn],opts.left);
        settings.right = opts.right;
        settings.title = opts.title;

        //生成事件回调函
        settings.left.forEach(_billBack);
        settings.right.forEach(_billBack);

        console.log(settings);
        //let seedFun  = settings.right[0].req_fun;
        //let seedFun2  = settings.right[1].req_fun;
        
        HybridJS.core.invokeNative(api,{config : JSON.stringify(settings)});

        //测试模拟
        //setTimeout(function(){
        //    console.log(HybridJS.core.getCallBacks());
        //    HybridJS.core.invokeWeb(api,JSON.stringify({
        //        rtnCode : "200",
        //        msg : "成功",
        //        res_fun : seedFun,
        //        result  : {
        //            data  : {userId : 10}
        //        }
        //    }));
        //
        //
        //},2000);
    };


    /**
     * 设置标题
     * @param title
     */
    static setTitle(title){
        HybridJS.core.invokeNative("ui.header.setTitle",{
            title : title
        });
    };

    /**
     * 显示header
     */
    static show(){
        HybridJS.core.invokeNative("ui.header.toggle",{
            show : true
        });
    };

    /**
     * 隐藏header
     */
    static hide(){
        HybridJS.core.invokeNative("ui.header.toggle",{
            show : false
        });
    };



}

module.exports = Header;

