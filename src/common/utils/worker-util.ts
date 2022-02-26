import { tickAsync } from "../state/slices/TimerSlice";
import { store } from "../state/store";

export const worker = new Worker("worker.js");
export const START_INTERVAL = "startInterval";
export const CLEAR_INTERVAL = "clearInterval";

export function registerWorkerEvent() {
  worker.onmessage = ({ data }) => {
    if (data.msg === "tick") {
      store.dispatch(tickAsync());
    }
  };
}

export function sendWorkerMsg(type) {
  worker.postMessage({ type });
}
