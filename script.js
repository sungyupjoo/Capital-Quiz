'use strict';

// Data 받아오기
let pool = [];

async function fetchData() {
  const response = await fetch('./pool.json');
  const json = await response.json();
  pool = json;
}

// querySelector 모음
const labelTimer = document.querySelector('.timer');
const funFact = document.querySelector('.funfact');
const flag = document.querySelector('.flag');
const map = document.querySelector('.map');
const questionNumber = document.querySelector('.questionnumber');
const endingMent = document.querySelector('.endingment');
const endingMentDetail = document.querySelector('.endingmentdetail');
const endingImage = document.querySelector('.endingimage');
const wrong = document.querySelector('.wrong');
const wrongQuestions = document.querySelector('.wrongquestions');
const btnSelection = document.querySelectorAll('.btn-selection');
const btn1 = document.querySelector('.btn1');
const btn2 = document.querySelector('.btn2');
const btn3 = document.querySelector('.btn3');
const btn4 = document.querySelector('.btn4');
const questionCountry = document.querySelector('.country');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.close-modal');
const btnOpenModal = document.querySelector('.booboo');

let totalquestionnumber = document.querySelector('.totalquestionnumber');
let score = document.querySelector('.score');
let currentScore = 0;
let currentQuestionNumber = 1;
let wrongAnswers = [];
let questionPool = Array.from(Array(20).keys());
shuffle(questionPool);

// Shuffle function
function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
}

// 문제 수 가져오기
const numberofquestions = Number(
  window.localStorage.getItem('numberofquestions')
);
totalquestionnumber.textContent = numberofquestions;

// 출제 범위 가져오기
const continent = window.localStorage.getItem('continent');

// Random number generator
const randomArrayFour = function () {
  let arrayResult = Array.from({ length: 4 }, () =>
    Math.floor(Math.random() * 4)
  );
  if (arrayResult.length !== new Set(arrayResult).size) {
    return randomArrayFour();
  } else return arrayResult;
};

// 문제 생성

const generateQuiz = function () {
  let questionCountry;
  // 문제에 나라 이름이 두번 나오고, 위에서 querySelectorAll로 지정해버리면
  // 다른 곳에서 Array로 작업해줘야하는 문제가 있었음
  for (const e of document.querySelectorAll('.country')) {
    e.textContent = pool[questionPool[currentQuestionNumber - 1]].country;
    questionCountry = e.textContent;
  }
  // array에 정답 index 및 randomArrayCapital에서 나온 숫자 3개 푸시하기
  //정답의 index 구하기
  const index = pool.findIndex(e => e.country === questionCountry);
  //정답 index 포함한 4자리 중복없는 index로 구성된 array 만들기
  const randomArrayCapital = function () {
    let arrayResult = Array.from({ length: 3 }, () =>
      Math.floor(Math.random() * 20)
    );
    arrayResult.push(index);
    if (arrayResult.length !== new Set(arrayResult).size) {
      return randomArrayCapital();
    } else return arrayResult;
  };
  const arrayFinal = randomArrayCapital();
  const arrayFour = randomArrayFour();

  // 버튼 정답 랜덤 위치에 생성
  // 기술 부채: 코드 극혐인데 좀 고칩시다 ㅠㅠ
  btn1.textContent = pool[arrayFinal[arrayFour[0]]].capital;
  btn2.textContent = pool[arrayFinal[arrayFour[1]]].capital;
  btn3.textContent = pool[arrayFinal[arrayFour[2]]].capital;
  btn4.textContent = pool[arrayFinal[arrayFour[3]]].capital;
  // funFact 바꾸기
  funFact.textContent = pool[index].funFact;
  // 국기 바꾸기
  flag.src = pool[index].flag;
  // 지도 바꾸기
  map.src = pool[index].map;
};

// boobooMode 가져오기
let boobooMode = window.localStorage.getItem('boobooMode');
boobooMode = boobooMode === 'true' ? true : false;

// btn-selection으로 정답 입력
const checkAnswer = function (questionCountry, answerSubmitted, btn) {
  // Finding answer(capital) of a question(country) from pool
  const answer = pool.find(el => el.country === questionCountry).capital;
  btn.style.fontWeight = 'bolder';
  // Check if the submitted answer is correct
  if (answerSubmitted === answer) {
    // add 5 to score if answer is correct
    currentScore += 100 / numberofquestions;
    score.textContent = Math.trunc(currentScore);
    btn.style.border = 'solid green';
    if (boobooMode == true) {
      btn.insertAdjacentHTML(
        'afterEnd',
        '<img src="images/blue_smile.png" height: 70px; position: absolute;>'
      );
    }
  } else {
    // 틀렸을 때
    btn.style.border = 'solid red';
    // 틀린 문제 리스트에 넣기
    wrongAnswers.push(questionCountry);
    for (const e of btn.parentElement.children) {
      if (e.textContent === answer) {
        e.style.cssText = 'font-weight: bolder; border: solid green';
        // 블루 옐로 띄우기
        if (boobooMode == true) {
          e.insertAdjacentHTML(
            'afterEnd',
            '<img src="images/blue_surprised.png" height: 70px; position: absolute;>'
          );
        }
      }
    }
  }
  // 다음 문제 넘어가기, 1.5초 기다리기
  if (currentQuestionNumber < numberofquestions) {
    setTimeout(function () {
      for (const e of btn.parentElement.children) {
        e.style.cssText = 'border: none; font-weight: normal; color: black;';
      }
      // 블루 옐로 지우기
      for (const e of btn.parentElement.children) {
        if (e.textContent == '') e.remove();
      }
      currentQuestionNumber += 1;
      questionNumber.textContent = currentQuestionNumber;
      generateQuiz();
    }, 1500);
  } else {
    const wrongPush = function () {
      wrongAnswers.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item}: ${
          pool.find(e => e.country === item).capital
        }`;
        wrongQuestions.appendChild(li);
      });
    };
    setTimeout(function () {
      if (currentScore < 31) {
        endingMent.textContent = '다 찍었어용...ㅇㅅㅇ?!';
        endingMentDetail.textContent = `점수가... ${currentScore}점 밖에 안되는뎅...`;
        endingImage.src = 'images/blue_frustrated.png';
        wrongPush();
      } else if (currentScore < 71) {
        endingMent.textContent = '고생했다용 ㅇㅅㅇ';
        endingMentDetail.textContent = `총 점수는 ${currentScore}점이다용 ㅎㅎ`;
        endingImage.src = 'images/blue_smile.png';
        wrongPush();
      } else if (currentScore < 100) {
        endingMent.textContent = '대단하다용 ㅇㅅㅇㄷㄷ';
        endingMentDetail.textContent = `무려 ${currentScore}점!!`;
        endingImage.src = 'images/blue_surprised.png';
        wrongPush();
      } else {
        endingMent.textContent = '지리장이로 인정합니다\nㅇㅅㅇㄷㄷ';
        endingMentDetail.textContent = `축하해용 ${currentScore}점!!`;
        endingImage.src = 'images/blue_congratulations.png';
        wrong.remove();
      }
      modal.classList.remove('hidden');
      overlay.classList.remove('hidden');
    }, 2000);
  }
};

// 버튼에 기능 부여
btn1.addEventListener('click', function () {
  checkAnswer(questionCountry.textContent, btn1.textContent, btn1);
});

btn2.addEventListener('click', function () {
  checkAnswer(questionCountry.textContent, btn2.textContent, btn2);
});
btn3.addEventListener('click', function () {
  checkAnswer(questionCountry.textContent, btn3.textContent, btn3);
});
btn4.addEventListener('click', function () {
  checkAnswer(questionCountry.textContent, btn4.textContent, btn4);
});

// Init
const init = function () {
  questionNumber.textContent = 1;
  score.textContent = currentScore;
  generateQuiz();
};

fetchData().then(() => {
  init();
});

// Timer
const startLogOutTime = function () {
  const tick = function () {
    // Call the timer every second
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 seconds, stop timer
    if (time === 0 && modal.classList.contains('hidden')) {
      clearInterval(tick);
      modal.classList.remove('hidden');
      overlay.classList.remove('hidden');
      endingMent.textContent = '시간 초과래용 ㅇㅅㅇ';
      endingMentDetail.textContent = `켜놓고 딴짓했대용 ㅋㅋ`;
      endingImage.src = 'images/blue_nervous.png';
      wrong.remove();
    }
    // Decrease 1s
    time--;
  };

  // Set time to 444
  let time = 60 * 4 + 44;
  // Call the timer every second if game is not ended
  // 기술부채: 이거 모달 hidden 아니어도 시간 가고 있음
  if (modal.classList.contains('hidden')) {
    tick();
    const timer = setInterval(tick, 1000);
    return timer;
  } else clearInterval(tick);
};

// by default:
startLogOutTime();
