var $w={
	init:function(){
		var wechatlink='<script type="text/javascript" src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js">'
		var headtxt=document.getElementsByTagName("head")[0].innerHTML;
		document.getElementsByTagName("head")[0].innerHTML=headtxt+wechatlink;
	},
	getSign:function(signurl,til,des,sharelink,imgurl,sucfn,jsontype){
		$w.init();
		//鉴权地址，分享标题，描述，分享链接，分享图片，分享成功函数，是否jsonp
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
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: data.appId, // 必填，公众号的唯一标识
                        timestamp: data.timestamp, // 必填，生成签名的时间戳
                        nonceStr: data.nonceStr, // 必填，生成签名的随机串
                        signature: data.signature,// 必填，签名，见附录1
                        jsApiList: data.jsApiList // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                    });
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
				data:{data},
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
								scufn
							},
							cancel: function (res) {
								canfn
							},
							fail: function (res) {
								canfn
							}
						});
					}
					
				
				}
				
			});
	},
	//倒计时
	timecount:function(BEGIN_TIME,bgain,nobgain,target){
		timer=setInterval(function(){
		time_to()
		},1000);
		time_to();
		function time_to(){
			var timestamp = Date.parse(new Date())/1000;
			var time_to=BEGIN_TIME-timestamp;
			if(time_to<=0){
				bgain.style.display="block";
				nobgain.style.display="none";
				clearInterval(timer);
			}else{
				nobgain.style.display="block";
				bgain.style.display="none";
			}
			var hour_to=parseInt(time_to/3600);
			var min_to=parseInt((time_to-hour_to*3600)/60);
			var sec_to=parseInt((time_to-hour_to*3600-min_to*60));
			target.oHour.innerHTML=add_zero(hour_to);
			target.oMin.innerHTML=add_zero(min_to);
			target.oSec.innerHTML=add_zero(sec_to);
		}
		function add_zero(obj){
			if(obj<10&&obj>=0){
				obj='0'+obj;
			}
			return obj;
		}
	},
	getScrenSize:function(obj){
		var size;
		if(obj=="width"){
			size=document.body.clientHeight;
		}else{
			size=document.body.clientWidth;
		}
		isIos = /iphone|ipod|ipad/gi.test(UA);// 据说某些国产机的UA会同时包含 android iphone 字符
		if(isIos){
			size=size*dpr;
		}
		return size;
	}
}