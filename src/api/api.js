/**
 * 服务相关api
 * Created by jiaaobo on 16/4/10.
 */


import Util  from  "../util/util";
import Pay from "./pay";
import SharePlatform from "./sharePlatform";
import Media from "./media";
import Network from "./network";

Util.getRoot().api = {
    pay : Pay,
    sharePlatform : SharePlatform,
    media : Media,
    network : Network
};

