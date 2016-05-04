/**
 * Created by jiaaobo on 16/4/10.
 */

import Util from  "../util/util";
let HybridJS = Util.getRoot();

/**
 * 支付模块
 */
export  default class Pay {

    /**
     * 付款支付
     * @param message
     * @param itemId
     */
    static payment(itemId) {
        if(!itemId) throw new Error("ItemId为空!");
        return new Promise((resolve,reject)=>{
            HybridJS.core.invokeNative("ui.pay.payment", {itemId : itemId},function(res){
                resolve(res);
            });
        });

    };

}


