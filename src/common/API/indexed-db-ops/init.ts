export const dbName = 'pomo-app';
export const taskObjectStoreName = 'tasks';

let promise = null;
export function initIdb() {
    if(!promise){
        promise = new Promise((resolve, reject) => {
            var request = indexedDB.open(dbName, 1);

            request.onupgradeneeded = function (event: any) {

                let db = event.target.result;

                // Create another object store called "names" with the autoIncrement flag set as true.
                var objStore = db.createObjectStore(taskObjectStoreName, {keyPath: 'id'});

                objStore.createIndex("id", "id", {unique: true});
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