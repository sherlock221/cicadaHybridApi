/**
 * 简单格式存储
 */
export  default class MapStorage {

    constructor(){
    };

    /**
     * 读
     * @param title
     */
    static getItem(key){

        return new Promise((resolve,reject)=>{

            if(!key) {
                throw  new Error("key 不能为空");
            }

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

            if(!key || !value) {
                throw  new Error("key,value 不能为空");
            }

            HybridJS.core.invokeNative("storage.mapStorage.setItem",{
                key : key,
                value : JSON.stringify(value)
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
            if(!key) {
                throw  new Error("key 不能为空");
            }

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

module.exports = MapStorage;