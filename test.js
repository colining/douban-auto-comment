
var rest 	 = require('restler'),
    fs   	 = require('fs'),
    filename = 'captcha.jpg';

rest.post('http://upload.chaojiying.net/Upload/Processing.php', {
    multipart: true,
    data: {
        'user': 'colining',
        'pass': 'rtq4816388589',
        'softid':'902528',  //软件ID 可在用户中心生成
        'codetype': '1104',  //验证码类型 http://www.chaojiying.com/price.html 选择
        'userfile': rest.file(filename, null, fs.statSync(filename).size, null, 'image/gif') // filename: 抓取回来的码证码文件
    },
    headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0',
        'Content-Type' : 'application/x-www-form-urlencoded'
    }
}).on('complete', function(data) {
    var captcha = JSON.parse(data);
    console.log('Captcha Encoded.');
    console.log(captcha);
});