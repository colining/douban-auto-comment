// refactoring tasks: 
// 1. deal with the callback hell
// 2. organize code into functions and remove comments


// please run `npm init` then `npm install --save request cheerio fs` to install the below 3rd party packages 
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');



// variable values you need to provide:

const post  = [185054895,185054846,185054780,185054719,185054649,185054546,185053902,185053634];

const cookie = "_vwo_uuid_v2=D84145AC5F193433F3FB5FF8121727630|8c6005939ddc23a1dc13c7de7aa5a4f1; douban-fav-remind=1; gr_user_id=2ebd1367-697c-46f9-8e6d-6657b6d95b44; douban-profile-remind=1; bid=NsZaqMCm-bk; __gads=ID=67cc6528323d1ad4:T=1570989972:S=ALNI_MYe4P618IyZMu6JFQMNYHF6MNfU9Q; viewed=\"26210632_26877306\"; ll=\"108169\"; push_doumail_num=0; ct=y; __utmz=30149280.1594880918.253.192.utmcsr=baidu|utmccn=(organic)|utmcmd=organic; _pk_ref.100001.8cb4=%5B%22%22%2C%22%22%2C1595125205%2C%22https%3A%2F%2Fwww.baidu.com%2Fs%3Fie%3Dutf8%26oe%3Dutf8%26wd%3D%25E8%25B1%2586%25E7%2593%25A3%26tn%3D98010089_dg%26ch%3D2%22%5D; _pk_ses.100001.8cb4=*; __utma=30149280.1483065895.1537631971.1595078989.1595125208.267; __utmc=30149280; ap_v=0,6.0; push_noty_num=0; dbcl2=\"197433910:7DaSQEggcYA\"; ck=CgNd; __utmv=30149280.19743; _pk_id.100001.8cb4=da56e2ec02dc3049.1537632231.213.1595128908.1595079655.; __utmt=1; __utmb=30149280.436.0.1595128591452"
const ck = "CgNd";
const interval = 1 * 1000;  // interval in ms. (2 * 60 * 1000) represents a 2 minutes interval

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

        request(doubanOptions, (err, res, html) => {
            if (err || res.statusCode !== 200) {
                return console.log("Failed to scrape the post page.");
            }
            const $ = cheerio.load(html);
            commentsId = $(".topic-reply").children().toArray().map(element => $(element).attr("id"));

            for (let i = 0; i < commentsId.length-2;i++){

            }
        });
    },interval);
}
