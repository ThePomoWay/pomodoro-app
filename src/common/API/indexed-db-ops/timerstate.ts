import { initIdb, timerstateObjectStoreName } from "./init";

let db=null;

initIdb().then(dbObj => {
    db = dbObj;
});

export function getTimerStateFromIdb(date) {
    return new Promise((res, rej) => {
        initIdb().then(() => {
            let transaction = db.transaction(timerstateObjectStoreName).objectStore(timerstateObjectStoreName).get(date);

            transaction.onsuccess = function(event) {
                res(event.target.result);
            }
        })
    })
}

export function createTimerStateIdb(obj) {
    return new Promise((resolve, reject) => {
        let transaction = db.transaction(timerstateObjectStoreName, "readwrite")
        let taskObjStore = transaction.objectStore(timerstateObjectStoreName);

        taskObjStore.add(obj);
        taskObjStore.transaction.oncomplete = function(event) {
            resolve({
                success: true
            });
        }
        taskObjStore.onerror = function(event) {
            console.log(event);
        }
        transaction.onerror = function(event) {
            console.error(event);
        }
    })
}

export function updateTimerStateIdb(obj) {
    return new Promise((resolve, reject) => {
        let taskObjStore = db.transaction(timerstateObjectStoreName, "readwrite").objectStore(timerstateObjectStoreName);

        taskObjStore.put(obj);
        taskObjStore.transaction.oncomplete = function(event) {
            resolve({
                success: true
            });
        }
        taskObjStore.transaction.onerror = function(event) {
            console.log(event);
        }
    })
}