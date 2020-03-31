const webPush = require("web-push");
const express = require("express");
const bodyParser = require("body-parser");
const crypto = require('crypto');
const port = 80;
const app = express();
app.use(bodyParser.json());
app.listen(port, () => console.log(`Express app listening on port ${port}!`));


const Db = [];

async function find_by_id(id){
for (var i = 0; i < Db.length; i++) {
   if(Db[i].id===id){
    return true
   }
}
return false
}

async function change_subscription_by_id(id,subscription){
for (var i = 0; i < Db.length; i++) {
   if(Db[i].id===id){
   Db[i].subscription=subscription
   return Db[i]
   }
}
}

async function generate_id() {
    const id = new Promise((resolve, reject) => {
        crypto.randomBytes(16, async function(ex, buffer) {
            if (ex) {
                reject("error");
            }
            let id = buffer.toString("base64").replace(/\/|=|[+]/g, '')
            let result = await find_by_id(id) //check if id exists
            if (!result) {
                resolve(id);
            } else {
                let id_1 = await generate_id()
                resolve(id_1)
            }
        });
    });
    return id;
}



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
app.post("/register", async function (req, res) {
  console.log(req.body.subscription);
  console.log(req.body.id);
  var found= await find_by_id(req.body.id)
  var user;
  if(found){
   user=await change_subscription_by_id(req.body.id,req.body.subscription)
  }else{
   let id=await generate_id()
   user={subscription:req.body.subscription,id:id}
   Db.push(user);
  }
  res.json(user);
});

setInterval(function () {
  console.log("interval");
  for (var i = 0; i < Db.length; i++) {
    if(Db[i].subscription){
    const subscription = Db[i].subscription;
    const payload = JSON.stringify({
      title: "BREAKING NEWS",
      body: "IT WORKS 😎",
    });
    const options = {
      TTL: 5,
    };
    console.log("sent");
    var m=i
    webPush.sendNotification(subscription, payload, options).catch(function (error) {
        console.log(error)
        Db[m].subscription=null
      });
    }
  }
}, 6 * 1000);
