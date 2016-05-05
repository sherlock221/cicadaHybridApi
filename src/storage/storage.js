/**
 * header组件 自定义
 * Created by jiaaobo on 16/4/10.
 */

import Util from  "../util/util";
let HybridJS = Util.getRoot();


export  default class MapStorage {

    constructor(){

    };



    /**
     * 读
     * @param title
     */
    static getItem(key){
        return new Promise((resolve,reject)=>{
            HybridJS.core.invokeNative("storage.mapStorage.getItem",{
                key : key
            },function(res){
                resolve(res);
            });
        });
    };

    /**
     * 写
     * @param key
     * @returns {Promise}
     */
    static setItem(key,value){
        return new Promise((resolve,reject)=>{
            HybridJS.core.invokeNative("storage.mapStorage.setItem",{
                key : key,
                value : value
            },function(res){
                resolve(res);
            });
        });
    };


    /**
     * 删除
     * @param key
     * @returns {Promise}
     */
    static removeItem(key){
        return new Promise((resolve,reject)=>{
            HybridJS.core.invokeNative("storage.mapStorage.removeItem",{
                key : key
            },function(res){
                resolve(res);
            });
        });
    };

    /**
     * 清空
     * @returns {Promise}
     */
    static clear(){
        return new Promise((resolve,reject)=>{
            HybridJS.core.invokeNative("storage.mapStorage.clear",{
            },function(res){
                resolve(res);
            });
        });
    };




}

module.exports = Header;

