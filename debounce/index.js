function debounce(callback, delay) { // this : window
    let timer = null;
    return function() { // if we use arrow function here, this will be bounded with window when it is created, and not be able to be changed to other 
        clearTimeout(timer); 
        timer = setTimeout(() => { 
            callback.apply(this, arguments) // this here is a button, since it is called by a button when click event is catched
        }, delay)
    }
}

function f() {console.log('clicked', arguments); console.log(this)}

const button = document.getElementById('btn')
button.addEventListener('click', debounce(f, 1000)) // debounce is set directly, nothing applyed with it
