import { generateUniqueId } from "../../utils/common";
import {
  DEFAULT_BREAK_TIME,
  DEFAULT_LONG_BREAK_TIME,
  DEFAULT_WORK_TIME,
} from "../../utils/constants";
import AuthService from "../network/AuthService";

export const dbName = "pomo-app";
export const taskObjectStoreName = "tasks";
export const timerstateObjectStoreName = "timerState";
export const todaysTasksObjectStoreName = "todaysTasks";
export const tagsObjectStoreName = "tags";
export const projectsObjectStoreName = "projects";

export const userPreferencesObjectStoreName = "userPref";
export const userPreferencesObjectKey = "key";

let promise = null;
export function initIdb() {
  if (!promise) {
    promise = new Promise((resolve, reject) => {
      var request = indexedDB.open(dbName, 1);

      request.onupgradeneeded = function (event: any) {
        let db = event.target.result;

        // Create another object store called "names" with the autoIncrement flag set as true.
        let taskObjStore = db.createObjectStore(taskObjectStoreName, {
          keyPath: "fid",
        });
        let timerStateObjStore = db.createObjectStore(
          timerstateObjectStoreName,
          { keyPath: "date" }
        );
        let todaysTasksObjStore = db.createObjectStore(
          todaysTasksObjectStoreName,
          { keyPath: "key" }
        );
        let tagsObjectStore = db.createObjectStore(tagsObjectStoreName, {
          keyPath: "fid",
        });
        let projectsObjectStore = db.createObjectStore(
          projectsObjectStoreName,
          { keyPath: "_id" }
        );

        let userPreferencesObjectStore = db.createObjectStore(
          userPreferencesObjectStoreName,
          { keyPath: userPreferencesObjectKey }
        );

        taskObjStore.createIndex("fid", "fid", { unique: true });
        timerStateObjStore.createIndex("date", "date", { unique: true });

        projectsObjectStore.add({
          _id: AuthService.getInboxProjectId(),
          title: "Inbox",
          sections: {},
          so: [],
          to: [],
          isArchived: false,
        });

        todaysTasksObjStore.add({
          key: "_TodaysTasks",
          value: [],
        });

        userPreferencesObjectStore.add({
          key: userPreferencesObjectKey,

          defaultWorkTime: DEFAULT_WORK_TIME,
          defaultBreakTime: DEFAULT_BREAK_TIME,
          defaultLongBreakTime: DEFAULT_LONG_BREAK_TIME,
          autoplayPomo: false,
          autoplayBreak: false,
        });
      };

      request.onsuccess = function (event: any) {
        let db = event.target.result;

        db.onerror = function (event) {
          console.error(event);
        };

        resolve(event.target.result);
      };
    });

    return promise;
  }

  return promise;
}
