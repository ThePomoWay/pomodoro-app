import { initIdb, todaysTasksObjectStoreName } from "./init";

let db=null;

let key = "_TodaysTasks"

initIdb().then(dbObj => {
    db = dbObj;

    let transaction = db.transaction(todaysTasksObjectStoreName).objectStore(todaysTasksObjectStoreName).get(key);
    transaction.onsuccess = function(event) {
        
        if(!event.target.result) {
            db.transaction(todaysTasksObjectStoreName, 'readwrite').objectStore(todaysTasksObjectStoreName).add({
                key,
                value: []
            })
        }
    }
});

export function getTodaysTasksFromIdb() {
    return new Promise((res, rej) => {
        initIdb().then(() => {
            let transaction = db.transaction(todaysTasksObjectStoreName).objectStore(todaysTasksObjectStoreName).get(key);

            transaction.onsuccess = function(event) {
                res(event.target.result.value);
            }
        })
    })
}

export function updateTodaysTasksInIdb(obj) {
    return new Promise((resolve, reject) => {
        let taskObjStore = db.transaction(todaysTasksObjectStoreName, "readwrite").objectStore(todaysTasksObjectStoreName);

        taskObjStore.put({
            key,
            value: obj
        });
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