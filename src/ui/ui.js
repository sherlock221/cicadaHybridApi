/**
 * Created by jiaaobo on 16/4/10.
 */



import Util  from  "../util/util";
import Toast from "./toast";
import Dialog from "./dialog";
import Header from "./header";

Util.getRoot().ui = {
    toast : Toast,
    dialog : Dialog,
    header : Header
};