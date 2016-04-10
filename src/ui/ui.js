/**
 * Created by jiaaobo on 16/4/10.
 */



import Util  from  "../util/util";
import Toast from "./toast";
import Alert from "./alert";

Util.getRoot().ui = {
    toast : Toast,
    alert : Alert
};