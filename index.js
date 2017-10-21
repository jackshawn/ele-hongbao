var express = require('express');
var request = require('request');
var bodyParser = require('body-parser')
var app = express();
app.use(bodyParser.json())
app.use(express.static('public'));

var optionToGetMax = {}
var getMax = function (cb) {
	request(optionToGetMax, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var result = JSON.parse(body || '{message:""}');
			if (result.message) {
				cb('操作频繁');
			} else {
				cb('第' + result.promotion_records.length + '个,领取成功!');
			}
		} else {
			cb('error');
		}
	});
}
// 查询个数
app.post('/getEleNum', function (req, res) {
	var headers = {
		'Origin': 'https://h5.ele.me',
		'Accept-Encoding': 'gzip, deflate, br',
		'Accept-Language': 'zh-CN,zh;q=0.8',
		'User-Agent': 'Mozilla/5.0 (iPhone 6s; CPU iPhone OS 9_3_3 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/6.0 MQQBrowser/6.9.1 Mobile/13G34 Safari/8536.25 MttCustomUA/2',
		'Content-Type': 'text/plain;charset=UTF-8',
		'Accept': '*/*',
		'Referer': 'https://h5.ele.me/hongbao/',
		'X-Shard': 'eosid=1212571255275276300',
		'Connection': 'keep-alive',
		'Cookie': 'ubt_ssid=t6067h3vzcbxqyt48tesykqcxm4ojnu0_2017-10-18; perf_ssid=a09fc38pjd233ts8fhfq7snific993ns_2017-10-18; _utrace=e801f92c3c5977c0f00562eb4a925537_2017-10-18; snsInfo=%7B%22city%22%3A%22%E6%B7%AE%E5%AE%89%22%2C%22eleme_key%22%3A%226a325a252ce8fa5a33cf5587c11a4086%22%2C%22figureurl%22%3A%22http%3A%2F%2Fqzapp.qlogo.cn%2Fqzapp%2F101204453%2F30FCC8A93CE1B50ABC57B30F65242D65%2F30%22%2C%22figureurl_1%22%3A%22http%3A%2F%2Fqzapp.qlogo.cn%2Fqzapp%2F101204453%2F30FCC8A93CE1B50ABC57B30F65242D65%2F50%22%2C%22figureurl_2%22%3A%22http%3A%2F%2Fqzapp.qlogo.cn%2Fqzapp%2F101204453%2F30FCC8A93CE1B50ABC57B30F65242D65%2F100%22%2C%22figureurl_qq_1%22%3A%22http%3A%2F%2Fq.qlogo.cn%2Fqqapp%2F101204453%2F30FCC8A93CE1B50ABC57B30F65242D65%2F40%22%2C%22figureurl_qq_2%22%3A%22http%3A%2F%2Fq.qlogo.cn%2Fqqapp%2F101204453%2F30FCC8A93CE1B50ABC57B30F65242D65%2F100%22%2C%22gender%22%3A%22%E7%94%B7%22%2C%22is_lost%22%3A0%2C%22is_yellow_vip%22%3A%220%22%2C%22is_yellow_year_vip%22%3A%220%22%2C%22level%22%3A%220%22%2C%22msg%22%3A%22%22%2C%22nickname%22%3A%22%E3%80%80%20%22%2C%22openid%22%3A%2230FCC8A93CE1B50ABC57B30F65242D65%22%2C%22province%22%3A%22%E6%B1%9F%E8%8B%8F%22%2C%22ret%22%3A0%2C%22vip%22%3A%220%22%2C%22year%22%3A%221991%22%2C%22yellow_vip_level%22%3A%220%22%2C%22name%22%3A%22%E3%80%80%20%22%2C%22avatar%22%3A%22http%3A%2F%2Fq.qlogo.cn%2Fqqapp%2F101204453%2F30FCC8A93CE1B50ABC57B30F65242D65%2F40%22%7D'
	};

	var dataString = '{"method":"phone","group_sn":"' + req.body.str + '","sign":"6a325a252ce8fa5a33cf5587c11a4086","phone":"","device_id":"","hardware_id":"","platform":0,"track_id":"undefined","weixin_avatar":"http://q.qlogo.cn/qqapp/101204453/30FCC8A93CE1B50ABC57B30F65242D65/40","weixin_username":"\u3000 ","unionid":"fuck"}';
	optionToGetMax.body = optionToGetMax.body.split('group_sn')[0] + 'group_sn":"' + req.body.str + '","sign' + optionToGetMax.body.split('sign')[1]
	var options = {
		url: 'https://restapi.ele.me/marketing/promotion/weixin/30FCC8A93CE1B50ABC57B30F65242D65',
		method: 'POST',
		headers: headers,
		body: dataString,
		gzip: true
	};

	request(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var result = JSON.parse(body || '{message:""}');
			if (result.message) {
				res.send('操作频繁');
			} else {
				console.log(result.promotion_records.length)
				res.send(result.promotion_records.length + '');
			}
		} else {
			res.send('error');
		}
	});
});

// 配置领取的请求信息
app.post('/curl', function (req, res) {
	var str = req.body.str
	var getStr = function (str, from, to) {
		var f = str.indexOf(from) + 6;
		var t = str.indexOf(to);
		return str.slice(f, t)
	}
	var urlStr = getStr(str, 'eixin/', '\' -H \'Origin');
	var shardStr = getStr(str, 'eosid=', '\' -H \'Cookie')
	var cookieStr = getStr(str, 'ookie:', '\' -H \'Connection');
	var dataStr = getStr(str, 'ary $\'', '\' --compressed')
	optionToGetMax = {
		url: 'https://restapi.ele.me/marketing/promotion/weixin/' + urlStr,
		method: 'POST',
		headers: {
			'Origin': 'https://h5.ele.me',
			'Accept-Encoding': 'gzip, deflate, br',
			'Accept-Language': 'zh-CN,zh;q=0.8',
			'User-Agent': 'Mozilla/5.0 (iPhone 6s; CPU iPhone OS 9_3_3 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/6.0 MQQBrowser/6.9.1 Mobile/13G34 Safari/8536.25 MttCustomUA/2',
			'Content-Type': 'text/plain;charset=UTF-8',
			'Accept': '*/*',
			'Referer': 'https://h5.ele.me/hongbao/',
			'X-Shard': 'eosid=' + shardStr,
			'Connection': 'keep-alive',
			'Cookie': cookieStr
		},
		body: dataStr,
		gzip: true
	};
	res.send('设置成功');
});

// 开始领取
app.post('/start', function (req, res) {
	getMax(function (d) {
		res.send(d);
	})
});
var server = app.listen(8080, function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log('Example app listening at http://%s:%s', host, port);
});
