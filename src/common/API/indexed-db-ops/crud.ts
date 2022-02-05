import {
  initIdb,
  projectsObjectStoreName,
  tagsObjectStoreName,
  taskObjectStoreName,
  timerstateObjectStoreName,
  todaysTasksObjectStoreName,
} from "./init";

let db = null;

initIdb().then((dbObj) => {
  db = dbObj;
});

export function getTasks() {
  return new Promise((res, rej) => {
    initIdb().then(() => {
      let transaction = db
        .transaction(taskObjectStoreName)
        .objectStore(taskObjectStoreName)
        .getAll();
      transaction.onsuccess = function (event) {
        res(event.target.result);
      };
    });
  });
}

export function createIDBTask(task) {
  return new Promise((resolve, reject) => {
    let taskObjStore = db
      .transaction(taskObjectStoreName, "readwrite")
      .objectStore(taskObjectStoreName);

    taskObjStore.add(task);
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

export function updateIDBTask(task) {
  return new Promise((resolve, reject) => {
    let taskObjStore = db
      .transaction(taskObjectStoreName, "readwrite")
      .objectStore(taskObjectStoreName);

    taskObjStore.put(task);
    taskObjStore.transaction.oncomplete = function (event) {
      resolve({
        success: true,
      });
    };
  });
}

export function deleteIDBTask(task) {
  return new Promise((resolve, reject) => {
    let taskObjStore = db
      .transaction(taskObjectStoreName, "readwrite")
      .objectStore(taskObjectStoreName);

    taskObjStore.delete(task.fid);
    taskObjStore.transaction.oncomplete = function (event) {
      resolve({
        success: true,
      });
    };
  });
}

export function clearTasksInIDB() {
  return new Promise((res, rej) => {
    let transaction = db.transaction(taskObjectStoreName, "readwrite");

    let objectStore = transaction.objectStore(taskObjectStoreName);

    transaction.onerror = function (event) {
      rej(event);
    };

    let objRequest = objectStore.clear();

    objRequest.onsuccess = function (event) {
      res({ success: true, msg: "Cleared Successfully" });
    };
  });
}

export function clearIDB() {
  let transaction = db.transaction([
    taskObjectStoreName,
    timerstateObjectStoreName,
    todaysTasksObjectStoreName,
    tagsObjectStoreName,
    projectsObjectStoreName,
  ]);
}
