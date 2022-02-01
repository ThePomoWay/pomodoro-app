import { initIdb, tagsObjectStoreName } from "./init";

let db=null;

initIdb().then(dbObj => {
    db = dbObj;
});

export function getAllTagsFromIDB() {
    return new Promise((res, rej) => {
        initIdb().then(() => {
            let transaction = db.transaction(tagsObjectStoreName).objectStore(tagsObjectStoreName).getAll()
            transaction.onsuccess = function(event) {
                res(event.target.result);
            }
        })
        
    })
}

export function createIDBTag(tag) {
    return new Promise((resolve, reject) => {
        let tagsObjectStore = db.transaction(tagsObjectStoreName, "readwrite").objectStore(tagsObjectStoreName);

        tagsObjectStore.add(tag);
        tagsObjectStore.transaction.oncomplete = function(event) {
            resolve({
                success: true
            });
        }
        tagsObjectStore.transaction.onerror = function(event) {
            console.log(event);
        }
    })
}

export function updateIDBTag(tag) {
    return new Promise((resolve, reject) => {
        let tagObjStore = db.transaction(tagsObjectStoreName, "readwrite").objectStore(tagsObjectStoreName);

        tagObjStore.put(tagsObjectStoreName);
        tagObjStore.transaction.oncomplete = function(event) {
            resolve({
                success: true
            });
        }
    })
}

export function deleteIDBTag(tag) {
    return new Promise((resolve, reject) => {
        let tagsObjectStore = db.transaction(tagsObjectStoreName, "readwrite").objectStore(tagsObjectStoreName);

        tagsObjectStore.delete(tag.fid);
        tagsObjectStore.transaction.oncomplete = function(event) {
            resolve({
                success: true
            });
        }
    })
}

export function clearTagsFromIDB() {
    return new Promise((resolve, reject) => {
        let transaction = db.transaction(tagsObjectStoreName, "readwrite");

        transaction.onerror = function(err) {
            reject(err);
        }

        let objectStore = transaction.objectStore(tagsObjectStoreName);

        let objRequest = objectStore.clear();
        objRequest.onsuccess = function(result) {
            resolve({success: true, msg: "Cleared Successfully"});
        }
    })
}

