const finalCorrectAnswers = JSON.parse(localStorage.getItem('finalCorrectAnswers'));
const formDatas = JSON.parse(localStorage.getItem('formDatas'))

const scoreNum = Object.keys(finalCorrectAnswers).length;

const scoreEl = document.querySelector('.score')
const pTag = document.querySelector('.main-container h1');

renderScore();

function renderScore(){
   if(scoreNum < Math.floor(formDatas.amount / 2)){
      pTag.textContent = 'Oh no!';
      document.title = 'Oh no!';
      
   }
   else{
      pTag.textContent = 'Congrats!';
      document.title = 'Congrats!';
   }
   scoreEl.innerHTML = `${scoreNum} out of ${formDatas.amount}`;
}