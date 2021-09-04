export const dbName = 'pomo-app';
export const taskObjectStoreName = 'tasks';

var request = indexedDB.open(dbName, 3);

request.onupgradeneeded = function (event: any) {

    db = event.target.result;

    // Create another object store called "names" with the autoIncrement flag set as true.
    var objStore = db.createObjectStore("tasks", {keyPath: 'id'});
};

export let db;