const datas = JSON.parse(localStorage.getItem('quizData'));
console.log(datas)
const formDatas = JSON.parse(localStorage.getItem('formDatas'));
console.log(formDatas);
const categoryArr = ['Any Category', 'General Knowledge', 'Entertainment: Books', 'Entertainment: Film', 'Entertainment: Music', 'Entertainment: Musicals & Theaters', 'Entertainment: Television', 'Entertainment: Video Games', 'Entertainment: Board Games', 'Science & Nature', 'Science: Computers', 'Science: Mathematics', 'Mythology', 'Sports', 'Geography', 'History', 'Politics', 'Art', 'Celebrities', 'Animals', 'Vehicles', 'Entertainment: Comics', 'Science: Gadgets', 'Entertainment: Japanese Anime & Manga', 'Entertainment: Cartoon Animations'];

const answers = new Object;
const correctAnswers = new Object;
let maxSecs = 15;
let intervalId;
let currentQuestionIndex = 0;

const mainContainer = document.querySelector('.main-container');
const timerEl = document.querySelector('.timer')
const categoryEl = document.querySelector('.category');
const difficultyEl = document.querySelector('.difficulty');
const typeEl = document.querySelector('.type');
const questionNum = document.querySelector('.questionNum');

const { category, difficulty, type } = formDatas;
const categoryIndex = category ? parseInt(category) - 8 : 0;

categoryEl.textContent = categoryArr[categoryIndex];

difficultyEl.textContent = `${difficulty ? difficulty[0].toUpperCase() + difficulty.slice(1) : 'Any Difficulty'}`

typeEl.textContent = `${type ? type[0].toUpperCase() + type.slice(1) : 'Any Type'}`;

renderQuestion(currentQuestionIndex);
startTimer();

function startTimer(){
   clearInterval(intervalId);
   maxSecs = 15;
   timerEl.style.color = '';
   timerEl.textContent = maxSecs + 's';

   intervalId = setInterval(() => {
      maxSecs--;
      if (maxSecs <= 5 && maxSecs >= 0) {
         timerEl.style.color = 'red';
      }
      if (maxSecs === 0) {
         clearInterval(intervalId);
         handleTimeout();
      }
      timerEl.textContent = maxSecs + 's';
   }, 1000);
}

function decodeHTML(html) {
   const txt = document.createElement('textarea');
   txt.innerHTML = html;
   return txt.value;
}

function handleTimeout(){
   if (currentQuestionIndex < datas.results.length) {
      answers[`Question${currentQuestionIndex}`] = 'Unanswered';
      renderQuestion(currentQuestionIndex);
      startTimer();
   } else {
      compareAnswers();
   }
}

function renderQuestion(index){
   currentQuestionIndex++;
   const data = datas.results[index];
   mainContainer.innerHTML = '';
   let choices = [];
   if(data.type === 'multiple'){
      const correctAnswerIndex = Math.floor(Math.random() * 4);
      choices = [...data.incorrect_answers.slice(0, correctAnswerIndex), data.correct_answer, ...data.incorrect_answers.slice(correctAnswerIndex)];
   }
   correctAnswers[`Question${currentQuestionIndex}`] = decodeHTML(data.correct_answer);
   questionNum.style.display = 'inline-block'
   questionNum.innerText = index+1;
   const formDiv = document.createElement('form');

   formDiv.innerHTML = 
      `
      <div class="question-container">
         <p>
         ${data.question}
         </p>
      </div>

      ${data.type === 'multiple' ? renderMultipleChoicesQuestion(choices) : renderBooleanQuestion()}

      <button class="submit-answer">Submit Answer <i class="fa-solid fa-right-long"></i></button>
      `;
   mainContainer.appendChild(formDiv);

   const submitBtn = document.querySelector('.submit-answer');
   submitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const answerPicked = formDiv.querySelector('input[name="choice"]:checked');
      if(answerPicked){
         answers[`Question${currentQuestionIndex}`] = answerPicked.value;
      }
      else{
         answers[`Question${currentQuestionIndex}`] = 'Unanswered';
      }
      if (currentQuestionIndex < datas.results.length) {
         renderQuestion(currentQuestionIndex);
         startTimer(); 
      } else {
         compareAnswers();
         window.location.href = '../loadingFinal/loadingFinal.html';
      }
   })
}


function renderMultipleChoicesQuestion(choices){
   return `
   <div class="choices-container">
      <div class="choice-one-container">
         <input type="radio" name="choice" id="${choices[0]}" value="${choices[0]}">
         <label for="choice1">${choices[0]}</label>
      </div>
      
      <div class="choice-two-container">
         <input type="radio" name="choice" id="${choices[1]}" value="${choices[1]}">
         <label for="choice2">${choices[1]}</label>
      </div>

      <div class="choice-three-container">
         <input type="radio" name="choice" id="${choices[2]}" value="${choices[2]}">
         <label for="choice3">${choices[2]}</label>
      </div>

      <div class="choice-four-container">
         <input type="radio" name="choice" id="${choices[3]}" value="${choices[3]}">
         <label for="choice4">${choices[3]}</label>
      </div>
   </div>
   `;
}

function renderBooleanQuestion(){
   return `
   <div class="choices-container">
      <div class="choice-one-container">
         <input type="radio" name="choice" id="true" value="True">
         <label for="true">True</label>
      </div>
      
      <div class="choice-two-container">
         <input type="radio" name="choice" id="false" value="False">
         <label for="false">False</label>
      </div>
   </div>
   `;
}

function compareAnswers(){
      const sameValues = Object.keys(correctAnswers).reduce((acc, key) => {
   if (answers.hasOwnProperty(key) && correctAnswers[key] === answers[key]) {
      acc[key] = correctAnswers[key];
   }
   return acc;
   }, {});

   const truthyValues = Object.fromEntries(
      Object.entries(sameValues).filter(([key, value]) => Boolean(value))
   );
   localStorage.setItem('finalCorrectAnswers', JSON.stringify(truthyValues));
}
