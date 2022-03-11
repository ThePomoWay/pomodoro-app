import { generateUniqueId } from "../../utils/common";
import { initIdb, projectsObjectStoreName } from "./init";

let db = null;

initIdb().then((dbObj) => {
  db = dbObj;
});

export function getAllProjectsFromIDB() {
  return new Promise((res, rej) => {
    initIdb().then(() => {
      let transaction = db
        .transaction(projectsObjectStoreName)
        .objectStore(projectsObjectStoreName)
        .getAll();
      transaction.onsuccess = function (event) {
        res(event.target.result);
      };
    });
  });
}

export function createIDBProject(project) {
  return new Promise((resolve, reject) => {
    let projectsObjectStore = db
      .transaction(projectsObjectStoreName, "readwrite")
      .objectStore(projectsObjectStoreName);

    projectsObjectStore.add(project);
    projectsObjectStore.transaction.oncomplete = function (event) {
      resolve({
        success: true,
      });
    };
    projectsObjectStore.transaction.onerror = function (event) {
      console.log(event);
    };
  });
}

export function updateIDBProject(project) {
  return new Promise((resolve, reject) => {
    let projectObjStore = db
      .transaction(projectsObjectStoreName, "readwrite")
      .objectStore(projectsObjectStoreName);

    projectObjStore.put(project);
    projectObjStore.transaction.oncomplete = function (event) {
      resolve({
        success: true,
      });
    };
  });
}

export function deleteIDBproject(project) {
  return new Promise((resolve, reject) => {
    let projectsObjectStore = db
      .transaction(projectsObjectStoreName, "readwrite")
      .objectStore(projectsObjectStoreName);

    projectsObjectStore.delete(project._id);
    projectsObjectStore.transaction.oncomplete = function (event) {
      resolve({
        success: true,
      });
    };
  });
}

export function clearProjectsFromIDB(noInbox = false) {
  return new Promise((resolve, reject) => {
    let transaction = db.transaction(projectsObjectStoreName, "readwrite");

    transaction.onerror = function (err) {
      reject(err);
    };

    let objectStore = transaction.objectStore(projectsObjectStoreName);

    let objRequest = objectStore.clear();
    objRequest.onsuccess = function (result) {
      resolve({ success: true, msg: "Cleared Successfully" });
    };

    if (!noInbox) {
      objectStore.add({
        _id: "inbox",
        title: "Inbox",
        sections: {},
        so: [],
        to: [],
        isArchived: false,
      });
    }
  });
}
