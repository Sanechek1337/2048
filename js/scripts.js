const gameField = document.querySelector('#game-field');

const gameCells = Array.from(document.querySelectorAll('.cells span'));
let freeCells = Array.from(gameCells);

const scoreCounter = document.querySelector('.score-counter');
const bestScoreCounter = document.querySelector('.best-score');
let score = 0;
let bestScore = localStorage.getItem("bestScore") || 0;
bestScoreCounter.textContent = bestScore;


const timeCounter = document.querySelector('.game-time');
const bestTimeCounter = document.querySelector('.best-time');

let gameOver = false;


function startGameTimer() {

	function timeFormatted(time) {
		let minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
		let seconds = Math.floor((time % (1000 * 60)) / 1000);

		// Дополнить минуты и секунды нулями, если они меньше 10
		minutes = minutes < 10 ? "0" + minutes : minutes;
		seconds = seconds < 10 ? "0" + seconds : seconds;

		return `${minutes}:${seconds}`
	}

	let startTime = new Date().getTime();
	let bestTime = localStorage.getItem("bestTime") || Infinity;
	if (bestTime !== Infinity) {
		bestTimeCounter.textContent = timeFormatted(Number(localStorage.getItem("bestTime")));
	}

	function updateTimer() {
		let currentTime = new Date().getTime();
		let timeDiff = currentTime - startTime;

		timeCounter.textContent = timeFormatted(timeDiff)

		if (gameOver) {
			// Остановить таймер
			clearInterval(timerInterval);

			// Обновить лучшее время, если текущее время лучше
			if (timeDiff < bestTime) {
				bestTime = timeDiff;
				bestTimeCounter.textContent = timeFormatted(bestTime)
				localStorage.setItem("bestTime", bestTime); // Сохранить лучшее время в localStorage
			}
		}
	}

	let timerInterval = setInterval(updateTimer, 1000);
}

function gameIsWon() {
	let isGameOver = gameCells.filter(cell => cell.textContent == '4').length;
	if (isGameOver) {
		gameOver = true;
	}
}


function setScore(mergedCell) {
	score += Number(mergedCell);

	if (score > bestScore) {
		bestScore = score;
		bestScoreCounter.textContent = bestScore;
		localStorage.setItem("bestScore", bestScore);
	}
	scoreCounter.textContent = score;
}


function toFillCell() {
	const randomCellNumber = Math.floor(Math.random() * freeCells.length); // Выбор рандомного индекса из массива freeCells
	// freeCells[randomCellNumber].textContent = Math.round(Math.random()) ? '2' : '4'; // Заполняем выбранный элемент цифрой
	freeCells[randomCellNumber].textContent = (Math.random() < 0.9) ? '2' : '4'; // Заполняем выбранный элемент цифрой
	freeCells.splice(randomCellNumber, 1); // Удаляем заполненный элемент из массива свободных клеток
}


function addClassesToCell() {
	gameCells.map((cell) => {
		const cellInnerNumber = Number(cell.textContent);
		if (cellInnerNumber > 0) {
			cell.className = `cell${cellInnerNumber}`;
		} else {
			cell.className = '';
		}
	})
}

toFillCell();
toFillCell();
addClassesToCell();
startGameTimer();


let mergedBlocks = {}; // Объект нужен для определения складывался ли блок за текущий ход

document.addEventListener('keydown', handleKeyDown);

function handleKeyDown(event) {
	const key = event.key;
	let changed = false; // для проверки на изменения, чтобы не создавались новые блоки когда существующие уже некуда двигать


	if (key === 'w' || key === 'ArrowUp') {

		for (let j = 0; j < 4; j++) {

			for (let i = 12; i < 16; i++) {

				if (gameCells[i - 12].textContent !== '' && !mergedBlocks[`${i - 12}`] && !mergedBlocks[`${i - 8}`]) {

					if (gameCells[i - 8].textContent === gameCells[i - 12].textContent) {
						gameCells[i - 12].textContent = Number(gameCells[i - 8].textContent) * 2;
						setScore(gameCells[i - 12].textContent);
						gameCells[i - 8].textContent = '';
						mergedBlocks[`${i - 12}`] = true;
						changed = true;
					}
				} else if (gameCells[i - 12].textContent === '' && gameCells[i - 8].textContent !== '') {
					gameCells[i - 12].textContent = gameCells[i - 8].textContent;
					gameCells[i - 8].textContent = '';
					changed = true;
				}

				if (gameCells[i - 8].textContent !== '' && !mergedBlocks[`${i - 8}`] && !!mergedBlocks[`${i - 4}`]) {
					if (gameCells[i - 4].textContent === gameCells[i - 8].textContent) {
						gameCells[i - 8].textContent = Number(gameCells[i - 4].textContent) * 2;
						setScore(gameCells[i - 8].textContent);
						gameCells[i - 4].textContent = '';
						mergedBlocks[`${i - 8}`] = true;
						changed = true;
					}
				} else if (gameCells[i - 8].textContent === '' && gameCells[i - 4].textContent !== '') {
					gameCells[i - 8].textContent = gameCells[i - 4].textContent;
					gameCells[i - 4].textContent = '';
					changed = true;
				}

				if (gameCells[i - 4].textContent !== '' && !!mergedBlocks[`${i - 4}`]) {
					if (gameCells[i].textContent === gameCells[i - 4].textContent) {
						gameCells[i - 4].textContent = Number(gameCells[i].textContent) * 2;
						setScore(gameCells[i - 4].textContent);
						gameCells[i].textContent = '';
						mergedBlocks[`${i - 4}`] = true;
						changed = true;
					}
				} else if (gameCells[i - 4].textContent === '' && gameCells[i].textContent !== '') {
					gameCells[i - 4].textContent = gameCells[i].textContent;
					gameCells[i].textContent = '';
					changed = true;
				}
			}
		}

		if (changed) {
			freeCells = gameCells.filter(cell => cell.textContent === '');
			toFillCell();
		}
	}


	if (key === 's' || key === 'ArrowDown') {

		for (let j = 0; j < 4; j++) {

			for (let i = 0; i < 4; i++) {

				if (gameCells[i + 12].textContent !== '' && !mergedBlocks[`${i + 12}`] && !mergedBlocks[`${i + 8}`]) {
					if (gameCells[i + 8].textContent === gameCells[i + 12].textContent) {
						gameCells[i + 12].textContent = Number(gameCells[i + 8].textContent) * 2;
						setScore(gameCells[i + 12].textContent);
						gameCells[i + 8].textContent = '';
						mergedBlocks[`${i + 12}`] = true;
						changed = true;
					}
				} else if (gameCells[i + 12].textContent === '' && gameCells[i + 8].textContent !== '') {
					gameCells[i + 12].textContent = gameCells[i + 8].textContent;
					gameCells[i + 8].textContent = '';
					changed = true;
				}

				if (gameCells[i + 8].textContent !== '' && !mergedBlocks[`${i + 8}`] && !mergedBlocks[`${i + 4}`]) {
					if (gameCells[i + 4].textContent === gameCells[i + 8].textContent) {
						gameCells[i + 8].textContent = Number(gameCells[i + 4].textContent) * 2;
						setScore(gameCells[i + 8].textContent);
						gameCells[i + 4].textContent = '';
						mergedBlocks[`${i + 8}`] = true;
						changed = true;
					}
				} else if (gameCells[i + 8].textContent === '' && gameCells[i + 4].textContent !== '') {
					gameCells[i + 8].textContent = gameCells[i + 4].textContent;
					gameCells[i + 4].textContent = '';
					changed = true;
				}

				if (gameCells[i + 4].textContent !== '' && !mergedBlocks[`${i + 4}`]) {
					if (gameCells[i].textContent === gameCells[i + 4].textContent) {
						gameCells[i + 4].textContent = Number(gameCells[i].textContent) * 2;
						setScore(gameCells[i + 4].textContent);
						gameCells[i].textContent = '';
						mergedBlocks[`${i + 4}`] = true;
						changed = true;
					}
				} else if (gameCells[i + 4].textContent === '' && gameCells[i].textContent !== '') {
					gameCells[i + 4].textContent = gameCells[i].textContent;
					gameCells[i].textContent = '';
					changed = true;
				}
			}
		}

		if (changed) {
			freeCells = gameCells.filter(cell => cell.textContent === '');
			toFillCell();
		}
	}


	if (key === 'a' || key === 'ArrowLeft') {

		for (let j = 0; j < 4; j++) {

			for (let i = 3; i < 16; i += 4) {

				if (gameCells[i - 3].textContent !== '' && !mergedBlocks[`${i - 3}`] && !mergedBlocks[`${i - 2}`]) {
					if (gameCells[i - 2].textContent === gameCells[i - 3].textContent) {
						gameCells[i - 3].textContent = Number(gameCells[i - 2].textContent) * 2;
						setScore(gameCells[i - 3].textContent);
						gameCells[i - 2].textContent = '';
						mergedBlocks[`${i - 3}`] = true;
						changed = true;
					}
				} else if (gameCells[i - 3].textContent === '' && gameCells[i - 2].textContent !== '') {
					gameCells[i - 3].textContent = gameCells[i - 2].textContent;
					gameCells[i - 2].textContent = '';
					changed = true;
				}

				if (gameCells[i - 2].textContent !== '' && !mergedBlocks[`${i - 2}`] && !mergedBlocks[`${i - 1}`]) {
					if (gameCells[i - 1].textContent === gameCells[i - 2].textContent) {
						gameCells[i - 2].textContent = Number(gameCells[i - 1].textContent) * 2;
						setScore(gameCells[i - 2].textContent);
						gameCells[i - 1].textContent = '';
						mergedBlocks[`${i - 2}`] = true;
						changed = true;
					}
				} else if (gameCells[i - 2].textContent === '' && gameCells[i - 1].textContent !== '') {
					gameCells[i - 2].textContent = gameCells[i - 1].textContent;
					gameCells[i - 1].textContent = '';
					changed = true;
				}

				if (gameCells[i - 1].textContent !== '' && !mergedBlocks[`${i - 1}`]) {
					if (gameCells[i].textContent === gameCells[i - 1].textContent) {
						gameCells[i - 1].textContent = Number(gameCells[i].textContent) * 2;
						setScore(gameCells[i - 1].textContent);
						gameCells[i].textContent = '';
						mergedBlocks[`${i - 1}`] = true;
						changed = true;
					}
				} else if (gameCells[i - 1].textContent === '' && gameCells[i].textContent !== '') {
					gameCells[i - 1].textContent = gameCells[i].textContent;
					gameCells[i].textContent = '';
					changed = true;
				}
			}
		}

		if (changed) {
			freeCells = gameCells.filter(cell => cell.textContent === '');
			toFillCell();
		}
	}


	if (key === 'd' || key === 'ArrowRight') {

		for (let j = 0; j < 4; j++) {

			for (let i = 0; i < 13; i += 4) {

				if (gameCells[i + 3].textContent !== '' && !mergedBlocks[`${i + 3}`] && !mergedBlocks[`${i + 2}`]) {
					if (gameCells[i + 2].textContent === gameCells[i + 3].textContent) {
						gameCells[i + 3].textContent = Number(gameCells[i + 2].textContent) * 2;
						setScore(gameCells[i + 3].textContent);
						gameCells[i + 2].textContent = '';
						mergedBlocks[`${i + 3}`] = true;
						changed = true;
					}
				} else if (gameCells[i + 3].textContent === '' && gameCells[i + 2].textContent !== '') {
					gameCells[i + 3].textContent = gameCells[i + 2].textContent;
					gameCells[i + 2].textContent = '';
					changed = true;
				}

				if (gameCells[i + 2].textContent !== '' && !mergedBlocks[`${i + 2}`] && !mergedBlocks[`${i + 1}`]) {
					if (gameCells[i + 1].textContent === gameCells[i + 2].textContent) {
						gameCells[i + 2].textContent = Number(gameCells[i + 1].textContent) * 2;
						setScore(gameCells[i + 2].textContent);
						gameCells[i + 1].textContent = '';
						mergedBlocks[`${i + 2}`] = true;
						changed = true;
					}
				} else if (gameCells[i + 2].textContent === '' && gameCells[i + 1].textContent !== '') {
					gameCells[i + 2].textContent = gameCells[i + 1].textContent;
					gameCells[i + 1].textContent = '';
					changed = true;
				}

				if (gameCells[i + 1].textContent !== '' && !mergedBlocks[`${i + 1}`]) {
					if (gameCells[i].textContent === gameCells[i + 1].textContent) {
						gameCells[i + 1].textContent = Number(gameCells[i].textContent) * 2;
						setScore(gameCells[i + 1].textContent);
						gameCells[i].textContent = '';
						mergedBlocks[`${i + 1}`] = true;
						changed = true;
					}
				} else if (gameCells[i + 1].textContent === '' && gameCells[i].textContent !== '') {
					gameCells[i + 1].textContent = gameCells[i].textContent;
					gameCells[i].textContent = '';
					changed = true;
				}
			}
		}

		if (changed) {
			freeCells = gameCells.filter(cell => cell.textContent === '');
			toFillCell();
		}
	}

	addClassesToCell();
	mergedBlocks = {};
	gameIsWon();
}


