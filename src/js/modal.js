"use strict";
document.addEventListener("DOMContentLoaded", function () {
  const fabButton = document.querySelector("#fab");

  fabButton.addEventListener("click", (event) => {
    event.preventDefault();
    const modal = document.querySelector('#addScreenModal');  // assuming you have only 1
    const html = document.querySelector('html');
    modal.classList.add('is-active');
    html.classList.add('is-clipped');
  
    modal.querySelector('.modal-background').addEventListener('click', function(e) {
      e.preventDefault();
      modal.classList.remove('is-active');
      html.classList.remove('is-clipped');
    });
  });


});
