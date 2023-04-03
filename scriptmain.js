'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.close-modal');
const btnOpenModal = document.querySelector('.booboo');
const booboo = document.getElementById('checkbox');

btnOpenModal.addEventListener('click', function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
});

// Modal 닫기 함수
const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

// 클릭시 닫기
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

// esc 버튼 누를 시 닫기
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// init
const init = function () {
  // 문제 수 export
  let numberofquestions = 20;
  window.localStorage.setItem('numberofquestions', numberofquestions);

  for (const i of document.getElementsByName('numberofquestions')) {
    i.addEventListener('click', function () {
      numberofquestions = document.querySelector(
        `label[for="${i.id}"]`
      ).textContent;
      window.localStorage.setItem('numberofquestions', numberofquestions);
    });
  }

  // 출제범위 export
  let continent = 'africa';
  window.localStorage.setItem('continent', continent);

  for (const i of document.getElementsByName('continents')) {
    i.addEventListener('click', function () {
      continent = i.id;
      window.localStorage.setItem('continent', continent);
    });
  }

  // boobooMode 상태 export
  let boobooMode = false;
  window.localStorage.setItem('boobooMode', boobooMode);

  booboo.addEventListener('click', function () {
    boobooMode = !boobooMode;
    // boobooMode === false ? (boobooMode = true) : (boobooMode = false);
    window.localStorage.setItem('boobooMode', boobooMode);
  });
};

init();
