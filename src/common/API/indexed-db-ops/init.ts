export const dbName = 'pomo-app';
export const taskObjectStoreName = 'tasks';
export const timerstateObjectStoreName = 'timerState';
export const todaysTasksObjectStoreName = 'todaysTasks';

let promise = null;
export function initIdb() {
    if(!promise){
        promise = new Promise((resolve, reject) => {
            var request = indexedDB.open(dbName, 1);

            request.onupgradeneeded = function (event: any) {

                let db = event.target.result;

                // Create another object store called "names" with the autoIncrement flag set as true.
                let taskObjStore = db.createObjectStore(taskObjectStoreName, {keyPath: 'fid'});
                let timerStateObjStore = db.createObjectStore(timerstateObjectStoreName, {keyPath: 'date'});
                let todaysTasksObjStore = db.createObjectStore(todaysTasksObjectStoreName, {keyPath: 'key'});

                taskObjStore.createIndex("fid", "fid", {unique: true});
                timerStateObjStore.createIndex("date", "date", {unique: true});
            };

            request.onsuccess = function(event: any) {
                let db = event.target.result;

                db.onerror = function(event) {
                    console.error(event);
                }

                resolve(event.target.result);
            }
        });

        return promise;
    }

    return promise;
}