import { getTasks as getIDBTasks } from "./indexed-db-ops/crud";

let _dataSource = '';

if(!window.indexedDB) {
    _dataSource = 'LS';
}
else {
    _dataSource = 'IDB';
}
    
export function getTasks() {
        if(_dataSource === 'IDB') {
            return getIDBTasks();
        }
        else if(_dataSource === 'LS') {
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