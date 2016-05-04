/**
 * Created by jiaaobo on 16/4/10.
 */

import Util from  "../util/util";
let HybridJS = Util.getRoot();

/**
 * 网络模块
 */
export  default class Network {

    /**
     * 获取当前网络类型
     * @param itemId
     */
    static getConnectionType() {
        return  new Promise((resolve, reject)=>{
            HybridJS.core.invokeNative('api.network.getConnectionType',{},function(res){
                resolve(res);
            });
        });
    };

}


