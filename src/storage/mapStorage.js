/**
 * Created by jiaaobo on 16/4/10.
 */

import Util from  "../util/util";
let HybridJS = Util.getRoot();

/**
 * 用户模块
 */
export  default class User {

    /**
     * 获得用户信息
     * @param url
     */
    static getUserInfo() {
        return new Promise((resolve,reject)=>{
            HybridJS.core.invokeNative("localData.user.getUserInfo",{},function(res){
                resolve(res);

            });
        });

    };

}


