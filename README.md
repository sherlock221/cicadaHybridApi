### 客户端ua需要有标识
cicada

### 客户端与h5双向通信

js-naive
android目前是 javascriptinterface
ios url拦截  

native - js

 

### hybird的架构图
https://www.processon.com/view/link/570a12c6e4b04878f86b9c53

参考
https://github.com/chemdemo/chemdemo.github.io/issues/12


离线包方案
阿里去啊
https://www.douban.com/note/505354059/


与rn 类似的方案
https://github.com/gavinkwoe/BeeFramework

### UI
##### Toast


目前遗留的问题
1. 一个ui.state  对应有个回调函数  如果多次点击就会出现  如果原生没有及时响应 一个state 绑定多个回调函数问题.

解决思路 : 1.如果state 已经存在 回调函数还未执行 则等待 阻止掉接下来的 调用
          2.设置超时 超时delete的回调
          
          
         
          
鉴于app中的 嵌入的html5 页面越来越多  ，需要进行一次小小改造

1. h5与原生交互 频繁 需要一个稳定的双向通信方案 并且可维护
2. 保证基础ui/体验 一致 原生提供部分组件供h5去调用
3. header动态化 可通过js自定义
4. 提供多种 页面跳转 方式   webview to webview  web view to native   等
5. 部分功能API化  支付 分享等 可在多页面去复用


未来部分
6.  离线包解决 html5 离线不可访问

方案
http://www.cnblogs.com/yexiaochai/p/4921635.html
Hybrid中Native与前端各自的工作是什么

② Hybrid的交互接口如何设计

③ Hybrid的Header如何设计

④ Hybrid的如何设计目录结构以及增量机制如何实现

⑤ 资源缓存策略，白屏问题......



### header组件设计
1.它主流容器都是这么做的，比如微信、手机百度、携程
2.没有header一旦网络出错出现白屏，APP将陷入假死状态，这是不可接受的，而一般的解决方案都太业务了
3.header左侧与右侧可配置，显示为文字或者图标（这里要求header实现主流图标，并且也可由业务控制图标），并需要控制其点击回调
4.header可以设置title

//客户端会提供一个icon的映射表

{   
    left : [
        tagname : 'back',
        value   : '回退',
        //提供一种映射
        lefticon : "back",
        callback : function(){}
             
    ],
    right : [
        {
            tagname : "share",
            value   : "xxx",
            callback : function(){
                
            }
        }
    ],
    title : {
        value : "xxx",
        //点击标题的回调函数
        callback: function () { }
    }
}

