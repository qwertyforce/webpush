if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
  alert("Service Worker/Push API is not supported");
} else {
  navigator.serviceWorker.register("service-worker.js");
}

function urlBase64ToUint8Array(base64String) {
  var padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  var base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);
  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function get_permission() {
  navigator.serviceWorker.ready
    .then(function (registration) {
      // Use the PushManager to get the user's subscription to the push service.
      return registration.pushManager
        .getSubscription()
        .then(async function (subscription) {
          // If a subscription was found, return it.
          if (subscription) {
            return subscription;
          }
          // Get the server's public key
          const response = await fetch("./vapidPublicKey");
          const vapidPublicKey = await response.text();
          // Chrome doesn't accept the base64-encoded (string) vapidPublicKey yet
          // urlBase64ToUint8Array() is defined in /tools.js
          const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey); 
          // Otherwise, subscribe the user (userVisibleOnly allows to specify that we don't plan to
          // send notifications that don't have a visible effect for the user).
          return registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidKey,
          });
        });
    })
    .then(function (subscription) {
      localforage.getItem("user_data").then(function (data) {
          console.log("FROM LOCAL") 
          console.log(data);
          console.log("-----------") 
          let id;
          if(data===null){
           id=0
          }else{
          	id=data.id
          }
          fetch("/register", {
            method: "post",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({
              subscription: subscription,
              id: id
            }),
          }).then((res) => res.json()).then((data) => {
          	  console.log("FROM SERVER") 
              console.log(data)
              console.log("-----------") 
              localforage.setItem("user_data", data).catch(function (err) {
              console.log(err);
              });
            });
        })
        .catch(function (err) {
          console.log(err);
        });
    });
}
