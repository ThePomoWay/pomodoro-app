import { initIdb } from "./init";

let db = null;

initIdb().then((dbObj) => {
  db = dbObj;
});

export function getFromCollection(collectionName, getAll = true, key?) {
  return new Promise((res, rej) => {
    initIdb().then(() => {
      let transaction = db
        .transaction(collectionName)
        .objectStore(collectionName);

      if (getAll) {
        transaction = transaction.getAll();
      } else {
        transaction = transaction.get(key);
      }

      transaction.onsuccess = function (event) {
        res(event.target.result || {});
      };
    });
  });
}

export function updateCollectionIdb(collectionName, obj) {
  return new Promise((resolve, reject) => {
    let taskObjStore = db
      .transaction(collectionName, "readwrite")
      .objectStore(collectionName);

    taskObjStore.put(obj);
    taskObjStore.transaction.oncomplete = function (event) {
      resolve({
        success: true,
      });
    };
    taskObjStore.transaction.onerror = function (event) {
      console.log(event);
    };
  });
}

export function clearCollection(collectionName) {
  return new Promise((res, rej) => {
    initIdb().then(() => {
      let transaction = db.transaction(collectionName, "readwrite");

      let objectStore = transaction.objectStore(collectionName);

      transaction.onerror = function (event) {
        rej(event);
      };

      let objRequest = objectStore.clear();

      objRequest.onsuccess = function (event) {
        res({ success: true, msg: "Cleared Successfully" });
      };
    });
  });
}
