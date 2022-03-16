import { BroadcastChannel } from 'broadcast-channel';
import { setMultiTabAlertModal } from '../state/slice/GlobalSlice';
import { store } from '../state/store';
import { deregisterWorkerEvent } from './worker-util';

export var initializeTabsCommunication = function () {
    const tabsComm = new BroadcastChannel('tabsCommunication');
    var uniqueTime = new Date().toISOString()

    tabsComm.onmessage = function (event) {
        if (event && event.action === "close") {
            if (event.unique !== uniqueTime) {
                deregisterWorkerEvent();
                store.dispatch(setMultiTabAlertModal(true));
            }
        }
    }

    tabsComm.postMessage({action : "close", unique: uniqueTime});
}
