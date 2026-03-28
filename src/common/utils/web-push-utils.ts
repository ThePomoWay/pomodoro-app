import { showNotification } from "../../serviceWorker";

export const ACTIONS_ADD_TIME = [
  { action: "add5", title: "Add 5 minutes" },
  { action: "add10", title: "Add 10 minutes" },
];

export function askPermission() {
  if (!("Notification" in window)) {
    return Promise.resolve();
  }
  return new Promise(function (resolve, reject) {
    if (Notification.permission !== "denied") {
      const permissionResult = Notification.requestPermission(function (
        result
      ) {
        resolve(result);
      });

      if (permissionResult) {
        permissionResult.then(resolve, reject);
      }
    }
  }).then(function (permissionResult) {
    if (permissionResult !== "granted") {
      throw new Error("We weren't granted permission.");
    }
  });
}

export function sendWebNotification(title, desc, actions?) {
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }

  // Let's check whether notification permissions have already been granted
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    // var notification = new Notification(msg);
    //Sending notification via service worker instead.
    showNotification(title, desc, actions);
  }

  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        // var notification = new Notification(msg);

        showNotification(title, desc, actions);
      }
    });
  }

  // At last, if the user has denied notifications, and you
  // want to be respectful there is no need to bother them any more.
}
