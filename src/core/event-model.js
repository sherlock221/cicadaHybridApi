/**
 * 事件模型
 * sherlock221b
 */


import {SCHEMA,API_ROOT,UA,OS_NAME,DE_BUG} from "../config";
import Util from "../util/util";

var HANDLERS = {};

export  default class  EventModel {

    //绑定事件
    static on(event,handler){
        let fns = HANDLERS[event];

        if(!Util.isFn(handler)) return false;

        if(!handler.name) console.warn(`绑定事件 ${event} 请尽量不用匿名函数！`);

        if(fns) {
            if(!Array.isArray(fns)) fns = [fns];
            if(Array.isArray(fns) && ~fns.indexOf(handler)) return false;
            fns.push(handler);
        } else {
            fns = handler;
        }

        HANDLERS[event] = fns;
        return true;
    };


    //取消绑定
    static off(event, handler){
        if(!(event in HANDLERS)) return false;
        if(Util.isFn(handler)) {
            let fns = HANDLERS[event];

            if(Array.isArray(fns)) {
                HANDLERS[event] = fns.filter((fn) => {
                    return fn != handler;
                });

                return HANDLERS[event].length !== fns.length;
            } else {
                return fns == handler ? delete HANDLERS[event] : false;
            }
        } else {
            return delete HANDLERS[event];
        }
    }

    static emit(event,data){

        if(!event) {
            console.warn('Receive empty event');
            return
        }

        let fns = HANDLERS[event];


        if(!(event in HANDLERS)) {
            console.warn('event %s has not emited', event);
            return;
        }

        if(Array.isArray(fns)) fns.forEach((fn) => {fn(data)});
        else if(Util.isFn(fns)) fns(data);


        console.log("emit 绑定事件栈 : ",HANDLERS);
    }
}




module.exports = EventModel;

