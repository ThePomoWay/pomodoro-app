export function sendMessageToExtension(obj) {
    if(window && window.postMessage) {
        //@ts-ignore
        window.postMessage(obj, '*');
    }
}