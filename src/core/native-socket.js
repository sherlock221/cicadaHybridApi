/**
 * js与原生通讯方案
 * sherlock221b
 * 核心部分参考 https://github.com/chemdemo/hybrid-js/blob/master/lib/core.js
 */


import {SCHEMA,API_ROOT,UA,OS_NAME,DE_BUG,SOURCE} from "../config";
import Util from "../util/util";
import EventModel from "./event-model";

var HybridJS = {};
const REQUEST_FUN_BACK = 'req_fun';
const RESPONSE_FUN_BACK = 'res_fun';
const WEB_CB_SN_PREFIX = '__ca_';
const SLICE = Array.prototype.slice;

const CALLBACKS = {};

class NativeSocket {

    constructor() {
        HybridJS = Util.getRoot();
        let m = UA.match(new RegExp(OS_NAME + '\\/([^\\/]+)\\/(\\d+)'));
        console.log(m);

        //事件模型暴露
        HybridJS.event = EventModel;
    }


    /**
     * js调用原生api
     * @param api
     * @param params
     * @param callBack
     * @returns {boolean}
     */
    invokeNative(api, params, callBack) {
        if (!api) throw Error("api 未填写...");

        //api名称
        let names = api.split(/\.|\//);
        let method = names.pop();
        let ns;
        let fn;

        if (!names.length || !method) throw Error('api ' + api + ' has not assigned');
        ns = names.join('/');

        //检测回调函数
        if(callBack && Util.isFn(callBack)){
            //注册一个回调函数
            fn = this._callbackSign(
                api,
                callBack,
                params.context || HybridJS,
                params.nextTick !== undefined ? params.nextTick : true
            );

            delete params.callback;
            delete params.context;
            delete params.nextTick;
        }

        Util.log("当前回调函数栈: ",CALLBACKS);

        //组装url
        let url = `${SCHEMA}://${SOURCE}/${ns}/${method}`;

        //回调函数
        if(fn)  params[REQUEST_FUN_BACK] = fn;


        //参数进行封装
        if(params){
            url += this._encodeParam(params);
        }

        if(fn) delete params[REQUEST_FUN_BACK];

        Util.log("编译前的: ",decodeURIComponent(url));
        Util.log("编译后的: ",url);

        //执行
        this._invokeByUrlSchema(url);

        //如果有回调函数则返回标识
        return fn;
    };



    /**
     * 1.native回调web
     * 2.调用web方法
     * @param api
     * @param str
     */
    invokeWeb(api,str) {
        if (typeof api !== 'string' || (str && typeof str !== 'string')) throw Error('参数不合法，必须是字符串');

        let params;

        //解码
        str = decodeURIComponent(str);

        try {
            params = JSON.parse(str);
        } catch (e) {
            if (/{/.test(str)) throw e;
            params = null;
        }

        Util.log("app发送的参数: ",JSON.stringify(params));

        let responseFun = params ? params[RESPONSE_FUN_BACK] : null;

        //调用回调函数
        if(responseFun){
            let callback = this._findCallback(api, responseFun);
            delete params[RESPONSE_FUN_BACK];

            if(Util.isFn(callback)){
                callback(params.data);
            }
            return;
        }
        //主动通知web
        else{
            Util.log("发送事件");
            if(/^sdk(?:\.|\/)notify/.test(api) && params) {
                let data = params.data || {}
                EventModel.emit(params.event, data);
                return;
            }
        }
    };

    _encodeParam(params) {
        let i = 0;
        let baseUrl = "";
        for(let p in params){
            baseUrl += `${i == 0 ? '?' : "&" }${p}=${params[p]}`;
            i++;
        }
        return encodeURIComponent(baseUrl);
    };


    //注册一个回调函数
    _callbackSign(api, callback, context, nextTick){
        if(Util.isFn(callback)) {
            api = api.replace(/\./g, '/');

            let sn = WEB_CB_SN_PREFIX + Date.now();
            let map = CALLBACKS[api] || (CALLBACKS[api] = {});
            // let map = createNamespace(CALLBACKS, api.split(/\./));
            // 注意，箭头函数没有arguments！！
            map[sn] = function(value) {
                let args = SLICE.call(arguments);

                if(!nextTick) {
                    callback.apply(context, args);
                } else {
                    setTimeout(() => {
                        callback.apply(context, args);
                    }, 0);
                }
                delete map[sn];
            };

            return sn;
        }
        return '';
    };


    _invokeByUrlSchema(url){
        window.location.href = url;
    };

    _findCallback(api, sn) {
        api = api.replace(/\./g, '/')
        return (CALLBACKS[api] || {})[sn];
    }

}

var ns = new NativeSocket();

HybridJS.core = ns;

module.exports = ns;

