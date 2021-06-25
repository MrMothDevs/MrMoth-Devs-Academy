// Funksion i cili shfaqe me teper informacione per kurset dhe shfaqe nje button per te blere kursin

const modalC = document.getElementsByClassName("courseModal")[0];
const btnC = document.getElementsByClassName("courseBtn")[0];
const closeC = modalC.getElementsByClassName("close-modal")[0];

btnC.onclick = function() {
   modalC.style.display = "block";
}

closeC.onclick = function() {
   modalC.style.display = "none";
}

window.onclick = function(event) {
   if (event.target == modalC) {
      modalC.style.display = "none";
   }
}