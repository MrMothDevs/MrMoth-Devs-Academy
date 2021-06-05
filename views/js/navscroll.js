const myNav = document.querySelector('.navbar')

window.onscroll = function(){
    var top = window.scrollY;
    console.log(top);
    if (top >= 50) {
        myNav.classList.add('active')
    } else {
        myNav.classList.add('active');
    }
}