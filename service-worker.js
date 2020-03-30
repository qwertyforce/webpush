// Register event listener for the 'push' event.
self.addEventListener("push", function (event) {
  // Retrieve the textual payload from event.data (a PushMessageData object).
  // Other formats are supported (ArrayBuffer, Blob, JSON), check out the documentation
  // on https://developer.mozilla.org/en-US/docs/Web/API/PushMessageData.
  const payload = event.data ? event.data.json() : "no payload";
  console.log(payload);
  // Keep the service worker alive until the notification is created.
  event.waitUntil(
    // Show a notification with title 'ServiceWorker Cookbook' and use the payload
    // as the body.
    self.registration.showNotification(payload.title, {
      body: payload.body,
    })
  );
});

self.addEventListener("pushsubscriptionchange",(event) => {
  console.log("pushsubscriptionchange")
    event.waitUntil(self.registration.pushManager.subscribe({
      userVisibleOnly: true
    }).then((subscription) => {
      console.log(5)
          // localforage.getItem("user_data").then(function (data) {
          //     console.log("FROM LOCAL") 
          //     console.log(data);
          //     console.log("-----------") 
          //     let id;
          //      if(data===null){
          //       id=0
          //      }else{
          //       id=data.id
          //      }
          //     fetch("/register", {
          //       method: "post",
          //       headers: {
          //         "Content-type": "application/json",
          //       },
          //       body: JSON.stringify({
          //         subscription: subscription,
          //         id: id,
          //       }),
          //     }).then((res) => res.json()).then((data) => {
          //         console.log("FROM SERVER") 
          //         console.log(data)
          //         console.log("-----------") 
          //         localforage.setItem("user_data", data).catch(function (err) {
          //         console.log(err);
          //         });
          //       });
          //   }).catch(function (err) {
          //     console.log(err);
          //   });
        }).catch(function (err) {console.log(err)}) 
    );
  },
  false
);
