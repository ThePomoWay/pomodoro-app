import {store} from '../state/store';
import { updateTimerState } from "../state/slices/TimerSlice";
import { setExtensionPresent } from '../state/slices/GlobalSlice';

export default function addExtensionListeners() {
    window.addEventListener('message', (event) => {
        if(event.data && event.data.action === 'updateTimerStateContentScript') {
            store.dispatch(updateTimerState(event.data.data));
        }

        if(event.data && event.data.action === 'extensionPresent') {
            store.dispatch(setExtensionPresent(true));
        }
    })
}

