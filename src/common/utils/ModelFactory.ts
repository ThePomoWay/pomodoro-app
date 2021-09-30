export function Model(value) {
    return function(target) {
        console.log('Decorator called', target);
    }
}

export function prop() {
    return function(target, property?, descriptor?){
        console.log('class deco called', target, property, descriptor);
    }
    
}