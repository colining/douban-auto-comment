// refactoring tasks: 
// 1. deal with the callback hell
// 2. organize code into functions and remove comments


// please run `npm init` then `npm install --save request cheerio fs` to install the below 3rd party packages 
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');




// variable values you need to provide:
// 你需要提供一下参数：
const post  = [198002423,198122611,198239278,198239294,198239314,198122611];
// const post = [185054719];
const cookie2 = "bid=TXHFwJ3GQO4; __yadk_uid=VUm7q3uHpEO4JE9S2ogMjfiLc9La59O4; __gads=ID=8600931729575c66-22c8e5112bc400e7:T=1602913860:RT=1602913860:S=ALNI_MayrgOfrurMpJX5kr6NEIAcVRczZA; push_noty_num=0; push_doumail_num=0; ll=\"108288\"; __utmz=30149280.1603026964.5.4.utmcsr=baidu|utmccn=(organic)|utmcmd=organic; _vwo_uuid_v2=DBBB458FEE528F5453A371D4BB767A61B|a2251914f8e9403edf2c5fe084d60455; ap_v=0,6.0; __utmc=30149280; _pk_ref.100001.8cb4=%5B%22%22%2C%22%22%2C1603187067%2C%22https%3A%2F%2Fwww.baidu.com%2Flink%3Furl%3D_sERcBsTCgKElwFi7Hf9FLKQE_0oFXnzzBoTO6cCIgHmz8HFA8XntOiMIzGcygCa%26wd%3D%26eqid%3Dcea59fcb000183f6000000025f8c4007%22%5D; _pk_ses.100001.8cb4=*; __utma=30149280.1736577050.1602913859.1603183245.1603187071.7; dbcl2=\"219595881:oCtW5jpjAJQ\"; ck=s7eS; __utmv=30149280.21959; __utmt=1; _pk_id.100001.8cb4=2e5457c8d4763f84.1602913858.6.1603188582.1603183525.; __utmb=30149280.242.5.1603188582883"
const cookie = "bid=TXHFwJ3GQO4; __yadk_uid=VUm7q3uHpEO4JE9S2ogMjfiLc9La59O4; __gads=ID=8600931729575c66-22c8e5112bc400e7:T=1602913860:RT=1602913860:S=ALNI_MayrgOfrurMpJX5kr6NEIAcVRczZA; push_noty_num=0; push_doumail_num=0; ll=\"108288\"; _vwo_uuid_v2=DBBB458FEE528F5453A371D4BB767A61B|a2251914f8e9403edf2c5fe084d60455; ct=y; __utmz=30149280.1603351422.9.5.utmcsr=baidu|utmccn=(organic)|utmcmd=organic; dbcl2=\"197433910:LWkJuvCrqdg\"; __utmv=30149280.19743; ck=ltGf; ap_v=0,6.0; _pk_ref.100001.8cb4=%5B%22%22%2C%22%22%2C1603427939%2C%22https%3A%2F%2Fwww.baidu.com%2Flink%3Furl%3D3jtU-0RV2Q2evPNnzlpVbzTzjSL0flJJhpTd5kniwFwQdVTsxqSnZkhZ3FBhU3BP%26wd%3D%26eqid%3Dc20dbd9300011e80000000025f91337c%22%5D; _pk_ses.100001.8cb4=*; __utma=30149280.1736577050.1602913859.1603351422.1603427939.10; __utmc=30149280; __utmt=1; _pk_id.100001.8cb4=2e5457c8d4763f84.1602913858.9.1603428211.1603351736.; __utmb=30149280.56.5.1603428211861"
const ck = "ltGf";
const interval = 60 * 60  * 1000;  // interval in ms. (2 * 60 * 1000) represents a 2 minutes interval

const chaojiyingUserID = "colining";
const chaojiyingPassword = "rtq4816388589";
const chaojiyingSoftID = "902528";
const chaojiyingCodeType = "1902";

const commentCaptcha = "房子很好的哦";
const commentNoCaptcha = "房子是租来的，但生活不是";


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


const captchaReportErrorOptions = {
    url: 'http://upload.chaojiying.net/Upload/ReportError.php',
    headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36",
        'Content-Type' : 'application/x-www-form-urlencoded'
    },
    formData: {
        'user': chaojiyingUserID,
        'pass': chaojiyingPassword,
        'softid': chaojiyingSoftID,
        'id': null
    }
};




for (let i = 0; i < post.length; i++) {
    setInterval(() => {
        const doubanOptions = {
            url: `https://www.douban.com/group/topic/${post[i]}/add_comment`,
            headers: {
                "Host": "www.douban.com",
                "Referer": `https://www.douban.com/group/topic/${post[i]}/`,
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36",
                "Cookie": cookie
            }
        };

        const doubanDeleteCommentOptions = {
            url: `https://www.douban.com/j/group/topic/${post[i]}/remove_comment`,
            headers: {
                "Host": "www.douban.com",
                "Referer": `https://www.douban.com/group/topic/${post[i]}/?start=0&post=ok`,
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36",
                "Cookie": cookie2,
                "X-Requested-With": "XMLHttpRequest"
            }
        };

        request(doubanOptions, (err, res, html) => {
            if (err || res.statusCode != 200) { return console.log("Failed to scrape the post page."); }
            const $ = cheerio.load(html);
            const captcha = $(".captcha_image");
            commentId = $(".topic-reply").children().last().prev().attr('id');
            doubanDeleteCommentOptions.form = {
                "ck": ck,
                "cid": commentId
            };
            if (captcha.attr()) {
                const captchaImgURL = captcha.attr().src;
                const captchaID = captchaImgURL.slice(captchaImgURL.indexOf("id=")+3, captchaImgURL.indexOf("&size"));
                fetchImgOptions.url = captchaImgURL;
                const lengthOfCaptchaID = 24;
                const imgFilePath = captchaID.slice(0, lengthOfCaptchaID)+".jpeg";
                request.get(fetchImgOptions).pipe(fs.createWriteStream(imgFilePath)).on('close', () => {
                    captchaRecogOptions.formData.userfile = fs.createReadStream(imgFilePath);
                    request.post(captchaRecogOptions, (err, res, data) => {
                        if (err || res.statusCode != 200) {
                            return console.log("Chaojiying OCR failed.. err:", err);
                        }
                        console.log('data',data)
                        const picID = JSON.parse(data).pic_id;
                        doubanOptions.form = {
                            "ck": ck,
                            "rv_comment": commentCaptcha,
                            "captcha-solution": JSON.parse(data).pic_str,
                            "captcha-id": captchaID
                        };

                        console.log(doubanOptions);
                        request.post(doubanOptions, (err, res, html) => {
                            console.log(err);
                            console.log(res);
                            if (html.length > 2000) {
                                captchaReportErrorOptions.formData.id = picID;
                                request.post(captchaReportErrorOptions, (err_no, err_str) => {
                                    console.log(err_no)
                                    console.log(err_str)
                                });
                                return console.log("Needed to solve captcha then post but failed somewhere.. err:", err);
                            }

                            // request.post(doubanDeleteCommentOptions,(err, res, html) => {
                            //     if (res.statusCode == 200){
                            //         console.log("delete success！")
                            //     }
                            // });
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
                    // request.post(doubanDeleteCommentOptions,(err, res) => {
                    //     if (res.statusCode == 200){
                    //         console.log("delete success！")
                    //     }
                    // });
                });
            }
        });
    }, interval );
}
