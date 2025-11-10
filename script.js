const form = document.querySelector('form');
const submitBtn = document.querySelector('.submitBtn');
let formDataObj = new Object;
let finalQuery = '';


function getFormData(){
   formDataObj = {};
   const formData = new FormData(form);
   for (const [name, value] of formData.entries()) {
      if(!value){
         continue;
      }
      formDataObj[name] = value;
   }
}

submitBtn.addEventListener('click', (e) => {
   e.preventDefault();
   getFormData();
   generatingURL(formDataObj);
   localStorage.setItem('formDatas', JSON.stringify(formDataObj));
});


function generatingURL(formDataObj){
   const formattedArr = [];
   for(let key in formDataObj){
      formattedArr.push(`${key}=${formDataObj[key]}`)
   };
   finalQuery = formattedArr.join('&');
   fetchQuestions(finalQuery);
}

export async function fetchQuestions(finalQuery){
   const url = `https://opentdb.com/api.php?${finalQuery}`;
   try{
      const res = await fetch(url);
      const data = await res.json();
      if(data.response_code !== 0){
         window.location.href = './subPages/pageNotFound.html';
      }
      else{
         localStorage.setItem('quizData', JSON.stringify(data));
         window.location.href = './subPages/loading/loading.html';
      }
   }
   catch(err){
      window.location.href = './subPages/pageNotFound.html';
      console.log(err.message);
   }
}
