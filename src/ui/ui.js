/**
 * Created by jiaaobo on 16/4/10.
 */



import Util  from  "../util/util";
import Toast from "./toast";
import Dialog from "./dialog";
import Loading from "./loading";
import WebView from "./webview";
import Header from "./header";

Util.getRoot().ui = {
    toast : Toast,
    dialog : Dialog,
    loading : Loading,
    webview : WebView,
    header : Header
};