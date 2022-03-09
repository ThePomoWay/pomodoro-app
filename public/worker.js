
let timer = 0;
onmessage = (e) => {
    if(e.data.type === 'startInterval' && !timer) {
        timer = setInterval(() => {
            postMessage({msg: 'tick'});
        }, 1000)
    }
    if(e.data.type === 'clearInterval' && timer) {
        clearInterval(timer);
        timer = 0;
    }
}
