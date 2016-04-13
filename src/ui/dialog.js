/**
 * Created by jiaaobo on 16/4/10.
 */

import Util from  "../util/util";
let HybridJS = Util.getRoot();


export  default class Dialog {

    static getDialogTypes() {
        return {
            //提示型弹窗
            TIP_ALERT: "1",
            //confirm型
            CONFIRM: "2",
            //Prompt型
            PROMPT: "3"
        };
    }

    /**
     * 消息提示窗
     * @param message
     * @param title
     */
    static alert(message,title,options) {
        var data = {
            message : message
        }

        //第二个参数
        if(title instanceof Object){
            Dialog.show(Dialog.getDialogTypes().TIP_ALERT, message,null,title);
        }
        else{
            Dialog.show(Dialog.getDialogTypes().TIP_ALERT, message,title,options);
        }

    };


    /**
     * 询问提示框
     * @param message
     * @param title
     */
    static confirm(message, title, options) {
        Dialog.show(Dialog.getDialogTypes().CONFIRM, message, title, options);
    };


    static show(dialogType, message, title, options = {}) {
        var DialogData = {
            title: title || "",
            message: message,
            positiveButtonText: options.positiveButtonText || "确定",
            cancelButtonText: options.cancelButtonText || "取消",
            positiveCallBack: options.positiveCallBack || "",
            cancelCallBack: options.cancelCallBack || ""
        }


        let TYPE = Dialog.getDialogTypes();
        switch (dialogType){
            case TYPE.TIP_ALERT :
                HybridJS.core.invokeNative("ui.alert", DialogData);
                break;
            case TYPE.CONFIRM :
                HybridJS.core.invokeNative("ui.confirm", DialogData);
                break;
            case TYPE.PROMPT :
                HybridJS.core.invokeNative("ui.prompt", DialogData);
                break;
        }

    };


}
