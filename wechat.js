var $w={
	init:function(){
		var wechatlink='<script type="text/javascript" src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js">'
		var headtxt=document.getElementsByTagName("head")[0].innerHTML;
		document.getElementsByTagName("head")[0].innerHTML=headtxt+wechatlink;
	},
	getSign:function(signurl,til,des,sharelink,imgurl,sucfn,jsontype,fun){
		$w.init();
		//鉴权地址，分享标题，描述，分享链接，分享图片，分享成功函数，是否jsonp,回调函数
		var url = window.location.href;
		jsontype?jsonTye='json':jsonTye='jsonp'
		  $.ajax({
                type: 'post',
                async: true,
                dataType: jsonTye,
                url: signurl,
                data: {signUrl: url},
                success: function (data) {
                    wx.config({
                        debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: data.appId, // 必填，公众号的唯一标识
                        timestamp: data.timestamp, // 必填，生成签名的时间戳
                        nonceStr: data.nonceStr, // 必填，生成签名的随机串
                        signature: data.signature,// 必填，签名，见附录1
                        jsApiList: data.jsApiList // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                    });
                    console.log(fun)
                    if(fun){
                    	fun();
                    }
                }
            });
            wx.ready(function () {
            wx.onMenuShareTimeline({
                title: til, // 分享标题
                desc: des, // 分享描述
                link: sharelink, // 分享链接
                imgUrl: imgurl, // 分享图标
                success: function () {
	            	sucfn
	            }
            });
            wx.onMenuShareAppMessage({
                title: til, // 分享标题
                desc: des, // 分享描述
                link: sharelink, // 分享链接
                imgUrl: imgurl, // 分享图标
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {
	            	sucfn
	            }
            });

        })
	},
	pay:function(data,payurl,scufn,canfn,jsontype){
		//数据，支付地址，支付成功，取消支付，是否jsonp
		$w.init();
		url = window.location.href;
		jsontype?jsonTye='json':jsonTye='jsonp'
			$.ajax({
				type: "GET",
				url: payurl+"&random="+Math.random(),
				data:data,
				dataType: jsonTye,
				success: function(response) {
					if(response.errorCode){
						alert(response.message)
					}else{
						wx.chooseWXPay({
							timestamp: response.timeStamp,
							nonceStr: response.nonceStr,
							package: response.package,
							signType: response.signType,
							paySign: response.paySign,
							success: function (res) {
								scufn()
							},
							cancel: function (res) {
								canfn()
							},
							fail: function (res) {
								canfn()
							}
						});
					}
					
				
				}
				
			});
	},
	//在flexible插件下计算屏幕真是高，宽
	getScrenSize:function(obj){
		var size;
		var dpr=window.devicePixelRatio
		var UA = navigator.userAgent
		if(obj=="width"){
			size=document.body.clientWidth;
		}else{
			size=document.body.clientHeight;
		}
		isIos = /iphone|ipod|ipad/gi.test(UA);// 据说某些国产机的UA会同时包含 android iphone 字符
		if(isIos){
			size=size/dpr;
		}
		return size;
	},
	loading:function(loadingarr,targetDom,objloading,objdis){
		var imgnum=0;
		//var disarr=["正在整理餐盘…","正在布置会场…","正在烧水…","正在宰杀肉鸡…","通知服务员入场…"]
        for(var i=0;i<loadingarr.length;i++){
            var imgObj=document.createElement("img");
            imgObj.src='images/'+loadingarr[i];
            imgObj.onload=function(){
                imgnum++;
                parcentWidth=parseInt((imgnum/loadingarr.length)*100)+"%";
                targetDom.html(parcentWidth)
                //targetDom.html(disarr[imgnum])
                if(imgnum==loadingarr.length){
                    objdis.style.display="none";
                    objloading.style.display="block";
                }
            }
        }
	}
}