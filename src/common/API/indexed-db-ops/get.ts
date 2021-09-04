import { db, taskObjectStoreName } from "./init";

export function getTasks() {
    return new Promise((res, rej) => {
        db.transaction(taskObjectStoreName).objectStore(taskObjectStoreName).getAll().onSuccess = function(event) {
            res(event.target.result);
        }
    })
    
}