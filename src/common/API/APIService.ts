import { getTasks as getIDBTasks } from "./indexed-db-ops/get";

export class APIService {
    static dataSource = '';
    constructor() {

        // In the following line, you should include the prefixes of implementations you want to test.
        // @ts-ignore
        window['indexedDB'] = window.indexedDB || window['mozIndexedDB'] || window['webkitIndexedDB'] || window['msIndexedDB'];
        // DON'T use "var indexedDB = ..." if you're not in a function.
        // Moreover, you may need references to some window.IDB* objects:
        window.IDBTransaction = window.IDBTransaction || window['webkitIDBTransaction'] || window['msIDBTransaction'] || {READ_WRITE: "readwrite"}; // This line should only be needed if it is needed to support the object's constants for older browsers
        window.IDBKeyRange = window.IDBKeyRange || window['webkitIDBKeyRange'] || window['msIDBKeyRange'];

        if(!window.indexedDB) {
            APIService.dataSource = 'LS';
        }
        else {
            APIService.dataSource = 'IDB';
        }
    }
    
    static getTasks() {
        if(APIService.dataSource === 'IDB') {
            return getIDBTasks();
        }
        else if(APIService.dataSource === 'LS') {
            return new Promise((res, rej) => {
                let data = localStorage.getItem('tasks');
                if(data) {
                    res(data);
                }
                else {
                    rej();
                }
            });
        }
    }
}