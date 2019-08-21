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
            var fullData = { "reactions": {}, "comments": {}, "shares": {}, "views": {} };
            viewsCount = videoPage.match(/<div class="_1vx9"><span(.*?)<\/span><\/div><\/div>/)[1].replace(/[a-zA-Z]|,/g, '');
            fullData["views"]["count"] = viewsCount.match(/(\d+)(?!.*\d)/g)[0];

            commentsCount = videoPage.match(/comment_count:{total_count:(.*?)},/)[1];
            fullData["comments"]["count"] = commentsCount;

            sharesCount = videoPage.match(/share_count:{count:(.*?)},/)[1];
            fullData["shares"]["count"] = sharesCount;

            totalReactionsCount = videoPage.match(/reaction_count:{count:(.*?)},/)[1];
            fullData["reactions"]["count"] = totalReactionsCount;

            topReacttions = videoPage.match(/top_reactions:(.*?),associated_video/)[1].replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2": ');
            topReactionsJson = JSON.parse(topReacttions);

            topReactionsJson["edges"].forEach((reaction) => {
                fullData["reactions"][reaction.node.reaction_type] = reaction.reaction_count;
            });
            res.send(fullData)
        })
        .catch((err) => {
            console.log(err);
        });
})