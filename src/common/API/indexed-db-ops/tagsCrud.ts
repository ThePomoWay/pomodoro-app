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

