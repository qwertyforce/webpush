const webPush = require("web-push");
const express = require("express");
const bodyParser = require("body-parser");
const port = 80;
const app = express();
app.use(bodyParser.json());
app.listen(port, () => console.log(`Express app listening on port ${port}!`));

const Db = [];

const keys = webPush.generateVAPIDKeys();
webPush.setVapidDetails(
  "mailto:example@yourdomain.org",
  keys.publicKey,
  keys.privateKey
);
app.use(express.static("./"));

app.get("/vapidPublicKey", function (req, res) {
  res.send(keys.publicKey);
});
app.post("/register", function (req, res) {
  console.log(req.body.subscription);
  Db.push(req.body.subscription);
  res.sendStatus(200);
});

setInterval(function () {
  console.log("interval");
  for (var i = 0; i < Db.length; i++) {
    const subscription = Db[i];
    const payload = JSON.stringify({
      title: "BREAKING NEWS",
      body: "IT WORKS 😎",
    });
    const options = {
      TTL: 5,
    };
    console.log("sent");
    webPush
      .sendNotification(subscription, payload, options)
      .catch(function (error) {
        console.log(error);
      });
  }
}, 2 * 1000);
