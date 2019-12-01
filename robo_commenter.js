// refactoring tasks: 
// 1. deal with the callback hell
// 2. organize code into functions and remove comments


// please run `npm init` then `npm install --save request cheerio fs` to install the below 3rd party packages 
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');



// variable values you need to provide:
// 你需要提供一下参数：
const postID = 159477518;
const postID1 = 159477841;
const postID3 = 159477771;
const postID4 = 159477419;
const postID5 = 159395373;
const postID6 = 159395165;
const postID7 = 159394834;




const cookie = "ll=\"108231\"; _vwo_uuid_v2=D84145AC5F193433F3FB5FF8121727630|8c6005939ddc23a1dc13c7de7aa5a4f1; douban-fav-remind=1; viewed=\"26877306\"; gr_user_id=2ebd1367-697c-46f9-8e6d-6657b6d95b44; __yadk_uid=kFtUgNza7BuvJ0qq85qtAUvDUYuxpZp5; douban-profile-remind=1; push_doumail_num=0; bid=NsZaqMCm-bk; __gads=ID=67cc6528323d1ad4:T=1570989972:S=ALNI_MYe4P618IyZMu6JFQMNYHF6MNfU9Q; UM_distinctid=16e27e0776e86-0375dd21de1c87-34564a75-384000-16e27e0776f178; CNZZDATA1272964020=189106281-1572622552-%7C1572767784; ct=y; __utmv=30149280.19743; __utmc=30149280; dbcl2=\"197433910:fUUf/gltupY\"; ck=rRQa; push_noty_num=0; _pk_ref.100001.8cb4=%5B%22%22%2C%22%22%2C1575115900%2C%22https%3A%2F%2Fwww.baidu.com%2Flink%3Furl%3D0Oz09B5QnW2dJUYdmCoIrvPlTfFVv7u7sDXl6SJLjh_%26wd%3D%26eqid%3Ddae41987000814fe000000025de25c78%22%5D; _pk_ses.100001.8cb4=*; ap_v=0,6.0; __utma=30149280.1483065895.1537631971.1575106665.1575115901.129; __utmz=30149280.1575115901.129.106.utmcsr=baidu|utmccn=(organic)|utmcmd=organic; _pk_id.100001.8cb4=da56e2ec02dc3049.1537632231.101.1575118839.1575109921.; __utmb=30149280.134.5.1575118839692";
const ck = "rRQa";
const interval = 60 * 1000;  // interval in ms. (2 * 60 * 1000) represents a 2 minutes interval

const chaojiyingUserID = "colinging";
const chaojiyingPassword = "rtq4816388589";
const chaojiyingSoftID = "902528";
const chaojiyingCodeType = "9e8fba4d24e6903087761bda5fc325c1";

const commentCaptcha = "房子很好的哦";
const commentNoCaptcha = "房子是租来的，但生活不是";




const doubanOptions = {
  url: `https://www.douban.com/group/topic/${postID}/add_comment`,
  headers: {
    "Host": "www.douban.com",
    "Referer": `https://www.douban.com/group/topic/${postID}/`,
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36",
    "Cookie": cookie
  }
};

const fetchImgOptions = {
  url: null,
  headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36" }
};

const captchaRecogOptions = {
  url: 'http://upload.chaojiying.net/Upload/Processing.php',
  headers: {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36",
    'Content-Type' : 'application/x-www-form-urlencoded' 
  },
  formData: {   
    'user': chaojiyingUserID,
    'pass': chaojiyingPassword,
    'softid': chaojiyingSoftID,
    'codetype': chaojiyingCodeType,
    'userfile': null
  }
};



console.log('111111111');

setInterval(() => {
  request(doubanOptions, (err, res, html) => {
    if (err || res.statusCode != 200) { return console.log("Failed to scrape the post page."); }
    const $ = cheerio.load(html);
    const captcha = $(".captcha_image");
    if (captcha.attr()) {
      const captchaImgURL = captcha.attr().src;
      const captchaID = captchaImgURL.slice(captchaImgURL.indexOf("id=")+3, captchaImgURL.indexOf("&size"));
      fetchImgOptions.url = captchaImgURL;
      const lengthOfCaptchaID = 24;
      const imgFilePath = captchaID.slice(0, lengthOfCaptchaID)+".jpeg";
      request.get(fetchImgOptions).pipe(fs.createWriteStream(imgFilePath)).on('close', () => {
        captchaRecogOptions.formData.userfile = fs.createReadStream(imgFilePath);
        request.post(captchaRecogOptions, (err, res, data) => {
          if (err || res.statusCode != 200) { return console.log("Chaojiying OCR failed.. err:", err); }
          doubanOptions.form = {
            "ck": ck,
            "rv_comment": commentCaptcha,
            "captcha-solution": JSON.parse(data).pic_str,
            "captcha-id": captchaID
          };
          request.post(doubanOptions, (err, res, _) => {
            if (err) { return console.log("Needed to solve captcha then post but failed somewhere.. err:", err); }
            console.log("Solved captcha and posted!");
          });
        });
      });
    } else {
      doubanOptions.form = {
        "ck": ck,
        "rv_comment": commentNoCaptcha,
      };
      request.post(doubanOptions, (err, res, _) => {
        if (err) { return console.log("No need to solve captcha then post but failed somewhere.. err:", err); }
        console.log("Posted w/o needing to solve captcha!");
      });
    }
  });
}, interval);