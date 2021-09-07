import { resolve } from "path/posix";
import { initIdb, taskObjectStoreName } from "./init";

let db=null;

initIdb().then(dbObj => {
    db = dbObj;
});

export function getTasks() {
    return new Promise((res, rej) => {
        initIdb().then(() => {
            let transaction = db.transaction(taskObjectStoreName).objectStore(taskObjectStoreName).getAll()
            transaction.onsuccess = function(event) {
                res(event.target.result);
            }
        })
        
    })
}

export function createIDBTask(task) {
    return new Promise((resolve, reject) => {
        let taskObjStore = db.transaction(taskObjectStoreName, "readwrite").objectStore(taskObjectStoreName);

        taskObjStore.add(task);
        taskObjStore.transaction.oncomplete = function(event) {
            console.log(event);
            resolve({
                success: true
            });
        }
    })
}

export function updateIDBTask(task) {
    return new Promise((resolve, reject) => {
        let taskObjStore = db.transaction(taskObjectStoreName, "readwrite").objectStore(taskObjectStoreName);

        taskObjStore.put(task);
        taskObjStore.transaction.oncomplete = function(event) {
            console.log(event);
            resolve({
                success: true
            });
        }
    })
}

export function deleteIDBTask(task) {
    return new Promise((resolve, reject) => {
        let taskObjStore = db.transaction(taskObjectStoreName, "readwrite").objectStore(taskObjectStoreName);

        taskObjStore.delete(task.id);
        taskObjStore.transaction.oncomplete = function(event) {
            console.log(event);
            resolve({
                success: true
            });
        }
    })
}

