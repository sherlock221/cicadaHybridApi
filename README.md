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
          



