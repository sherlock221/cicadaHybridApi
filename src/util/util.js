/**
 * Created by jiaaobo on 16/4/10.
 */

import {UA,DE_BUG,API_ROOT} from "../config";


export  default class Util {

    /**
     * 调试
      * @param message
     */
    static log(){
        var message = '';
        if(DE_BUG){
            for(var i =0; i<arguments.length;i++){
                message += arguments[i];
            }
            console.log(message);
        }
    }

    static getRoot(){
        if(!window[API_ROOT])
            window[API_ROOT] = {};

        return window[API_ROOT];
    };

    static isFn(fn) {
        return typeof fn === 'function';
    }

}
