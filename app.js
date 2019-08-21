var express = require("express");
var request = require("request-promise");
var app = express();
app.set("view engine", "ejs");
app.listen(3000, () => {
    console.log("starting on 3000");
});

app.get("/", (req, res) => {
    res.render("home")
});

app.get("/videoViews", (req, res) => {
    var id = req.query.videoID;
    var options = {
        uri: "https://www.facebook.com/watch/",
        headers: {
            Host: "ar-ar.facebook.com",
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:68.0) Gecko/20100101 Firefox/68.0",
            "Accept-Language": "en-US,en;q=0.5"
        },
        qs: {
            v: id,
        },
        json: true
    }
    return request(options)
        .then((videoPage) => {
            console.log(id);
            viewsCount = videoPage.match(/<div class="_1vx9"><span>(.*?)<\/span>/)[1].replace(/[a-zA-Z]/g, '');
            commentsCount = videoPage.match(/comment_count:{total_count:(.*?)},/)[1];
            sharesCount = videoPage.match(/share_count:{count:(.*?)},/)[1];
            totalReactionsCount = videoPage.match(/reaction_count:{count:(.*?)},/)[1];
            //reactionsInJSON = JSON.parse(reactionsString);
            res.send(
                `views :${viewsCount}
                comments: ${commentsCount}
                shares: ${sharesCount}
                total reactions : ${totalReactionsCount}`
            );
            console.log(likesCount);
            //res.send("video views:  " + viewsCount);

        })
        .catch((err) => {
            console.log(err);
        });
})