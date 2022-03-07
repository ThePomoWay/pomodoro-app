import { getTasks } from "../API/APIService";
import { updateIDBTask } from "../API/indexed-db-ops/crud";
import { updateTodaysTasksInIdb } from "../API/indexed-db-ops/todaysTasks";
import { tasksSlice, updateTask } from "../state/slice/TasksSlice";
import { store } from "../state/store";

// template to save sync data while offline
export function getDefaultSyncState() {
    return {
        isSyncRequired: false,
        tasks: {
            create: [],
            update: [],
            delete: [],
            complete: [],
            incomplete: [],
            todays: []
        },
        pomoSummaries: {
            stats: []
        },
    }
}

export const task_create = "create"
export const task_update = "update"
export const task_delete = "delete"
export const task_complete = "complete"
export const task_incomplete = "incomplete"
export const offlineData = "offlineData"

function getDefaultTaskIDStructure() {
    return {
        fid: "",
        _id: ""
    }
}

function setOfflineDataInLS(syncInfo) {
    localStorage.setItem(offlineData, JSON.stringify(syncInfo))
}

function removeOfflineDataInLS() {
    localStorage.removeItem(offlineData)
}

function getOfflineDataFromLS() {
    let syncData = localStorage.getItem(offlineData);
    if (syncData) {
        syncInfo = JSON.parse(syncData)
    } else {
        syncInfo = getDefaultSyncState()
    }
    return syncInfo
}

function refreshTodaysTaskArr() {
    syncInfo.tasks.todays = [];
    store["tasks"].todaysTasks.forEach(element => {
        var todaysTask = getDefaultTaskIDStructure()
        todaysTask.fid = element
        if (store["tasks"].tasks[element]._id) {
            todaysTask._id = store["tasks"].tasks[element]._id
        }
        syncInfo.tasks.todays.push(todaysTask)
    });
} 

export function isSyncRequired() {
    return syncInfo.isSyncRequired
}

export function updateStoreAndIndexDB(mapFIDtoTID) {
    // get all tasks from index db and update
    async function updateTIDInIndexDB()  {
        let response = await getTasks();
        for (var i = 0; i < response.tasks.length; i++) {
            response.tasks[i]._id = mapFIDtoTID[response.tasks[i].fid] || ""
            await updateIDBTask(response.tasks[i])
        }
    }
    updateTIDInIndexDB();
    

    // get all tasks from store and update
    tasksInStore = store["tasks"]
    for (key in taskInStore) {
        if (!taskInStore[key]._id) {
            taskInStore[key]._id = mapFIDtoTID[key] || "";
            store.dispatch(updateTask(taskInStore[key]));
        }
    }
}


export function getSyncInfo() {
    return syncInfo

}

export function syncSuccessful(mapFIDtoTID) {
    syncInfo = getDefaultSyncState()
    removeOfflineDataInLS()
    updateStoreAndIndexDB(mapFIDtoTID)
}

// TODO: import and update todays task as well
export function saveTaskInOfflineStore(taskInfo = {_id : "", fid: ""}, action = "today_task_rearrange") {
    if (action == task_create) {
        if (taskInfo._id == "") {
            syncInfo.tasks.create.push(taskInfo)
        }
    } else if (action == task_update) {
        if (taskInfo._id != "") {
            syncInfo.tasks.update.push(taskInfo)
        } else {
            for(var i = 0; i < syncInfo.tasks.create.length; i++) {
                if (syncInfo.tasks.create[i].fid == taskInfo.fid) {
                    syncInfo.tasks.create[i] = taskInfo
                }
            }
        }
    } else if (action == task_delete) {
        if (taskInfo._id != "") {
            syncInfo.tasks.delete.push(taskInfo)
        } else {
            for(var i = 0; i < syncInfo.tasks.create.length; i++) {
                if (syncInfo.tasks.create[i].fid == taskInfo.fid) {
                    syncInfo.tasks.create = syncInfo.tasks.create.splice(i, 1)
                }
            }
        }
    } else if (action == task_complete) {
        syncInfo.tasks.complete.push(taskInfo)
    } else if (action == task_incomplete) {
        if (taskInfo._id != "") {
            syncInfo.tasks.incomplete.push(taskInfo)
        } else {
            for(var i = 0; i < syncInfo.tasks.create.length; i++) {
                if (syncInfo.tasks.create[i].fid == taskInfo.fid) {
                    syncInfo.tasks.create = syncInfo.tasks.create.splice(i, 1)
                }
            }
        }
    }  else {
        console.error("incorrect action provided")
    }

    // update todays task positions
    refreshTodaysTaskArr()
    syncInfo.isSyncRequired = true;
    setOfflineDataInLS(syncInfo)
}

export function savePomoSummariesInOfflineStore(statInfo) {
    syncInfo.pomoSummaries.stats.push(statInfo)
    syncInfo.isSyncRequired = true;
    setOfflineDataInLS(syncInfo)
}

var syncInfo = getOfflineDataFromLS()











