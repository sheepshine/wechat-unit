# wechat-unit
微信签名，支付，鉴权的封装
##引入
```html
 <script type="text/javascript" src="js/wechat.js"></script>
 ```
##使用
```javascript
  $w.getSign(signurl,til,des,sharelink,imgurl,sucfn,jsontype)
```
  //鉴权地址，分享标题，描述，分享链接，分享图片，分享成功函数，是否jsonp
```javascript
  $w.pay(data,payurl,scufn,canfn,jsontype)
```
  //数据，支付地址，支付成功，取消支付，是否jsonp
