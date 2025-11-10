const spansEl = document.querySelectorAll('span');

function displayDots(){
   spansEl.forEach(span => {
      span.style.opacity = '0';
      span.style.visibility = 'hidden';
   })
   spansEl.forEach((span, index) => {
      const timeOutId = setTimeout(() => {
         span.style.opacity = '1';
         span.style.visibility = 'visible';
      }, (index + 1) * 400);
   })
}

function redirectToReady(){
   displayDots();
   const intervalId = setInterval(displayDots, 2000);
   setTimeout(() => {
      window.location.href = '../ready/ready.html';
   }, 4000);
}

redirectToReady();