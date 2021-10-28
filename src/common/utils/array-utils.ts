export function findIndex(arr, value) {
    for(let ind in arr) {
        if(arr[ind] === value){
            return ind;
        }
    }
    return -1;
}