function startGame() {
	const difficultyInputs = document.getElementsByName("difficulty");
	let selectedDifficulty;

	// Присваивание сложности переменной selectedDifficulty, если она выбрана
	for (let i = 0; i < difficultyInputs.length; i++) {
		if (difficultyInputs[i].checked) {
			selectedDifficulty = difficultyInputs[i].value;
			break;
		}
	}

	// Проверка выбрана ли сложность
	if (!selectedDifficulty) {
		alert("Пожалуйста, выберите сложность перед началом игры.");
		return;
	}

	// Отображение игрового поля и скрытия меню
	const menu = document.querySelector(".menu");
	const gameField = document.querySelector("#game-field");
	const header = document.querySelector('.header');
	const autoplay = document.querySelector('.autoplay');

	menu.style.display = "none";
	gameField.style.display = "flex";
	header.style.display = "grid";
	autoplay.style.display = "block";

	game(selectedDifficulty); // Запуск игры
}


function game(difficult) {
	const gameField = document.querySelector('#game-field');
	const scoreCounter = document.querySelector('.score-counter');
	const bestScoreCounter = document.querySelector('.best-score');
	const gameCells = Array.from(document.querySelectorAll('.cells span'));
	const timeCounter = document.querySelector('.game-time');
	const bestTimeCounter = document.querySelector('.best-time');
	const menuButton = document.querySelector('.menu-button');
	const menu = document.querySelector(".menu");
	const header = document.querySelector('.header');
	const gameOverWindow = document.querySelector('.game-over');
	const gameWin = document.querySelector('.game-over-message');
	const retryButton = document.querySelector('.retry-button');
	const autoplayBlock = document.querySelector('.autoplay');
	const autoplay = document.querySelector('.autoplay-checkbox');


	let freeCells = Array.from(gameCells); // Массив свободных клеток
	let score = 0;
	let bestScore = localStorage.getItem("bestScore") || 0;
	bestScoreCounter.textContent = bestScore;
	timeCounter.textContent = "00:00";
	let gameOver = {
		lose: false,
		win: false,
	}; // Переменная для отслеживания конца игры
	let mergedBlocks = {}; // Объект нужен для определения складывался ли блок за текущий ход
	let fillCellMethod; // К данной переменной присвоится коллбек для генерации новых блоков, в зависимости от уровня сложности


	document.addEventListener('keydown', handleKeyDown);
	menuButton.addEventListener('click', showMenu);
	retryButton.addEventListener('click', showMenu);
	autoplay.addEventListener("change", toggleAutoPlay);

	function showMenu() {
		gameField.style.display = "none";
		header.style.display = "none";
		menu.style.display = "flex";
		gameOverWindow.style.display = "none";
		autoplayBlock.style.display = "none";
		autoplay.checked = false;
		gameCells.forEach(cell => cell.textContent = '');
		score = 0;
		scoreCounter.textContent = 0;
		gameOver = {
			lose: true,
			win: false
		};

	}

	switch (difficult) {
		case 'easy':
			// Функция для удаления выбранных клеток с поля по нажатию
			gameField.addEventListener('click', handleClick);
			function handleClick(event) {
				const target = event.target;
				if (target.tagName === 'SPAN' && target.textContent !== '') {
					target.textContent = '';
					freeCells.push(target);
					addClassesToCell();
				}
				// Проверка, если поле пустое, то генерируется 2 блока, т.к. с пустым полем игра ломается
				if (freeCells.length === 16) {
					toFillCell();
					toFillCell();
					addClassesToCell();
				}
			}
			fillCellMethod = () => (Math.random() < 0.9) ? '2' : '4';
			break
		case 'medium':
			fillCellMethod = () => Math.round(Math.random()) ? '2' : '4';
			break
		case 'hard':
			fillCellMethod = () => {
				// Выдает 2 в степени от 1 до 4 (цифры: 2,4,8,16)
				let number = 2 ** Math.round((Math.random() * (4 - 1) + 1));
				return number
			}
			break
	}

	// Создаем на поле 2 клетки, добавляем классы и запускаем таймер
	toFillCell();
	toFillCell();
	addClassesToCell();
	startGameTimer();


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
		// Если в локалстораже нет bestTime, то значение будет Infinity
		let bestTime = localStorage.getItem("bestTime") || Infinity;
		if (bestTime !== Infinity) {
			bestTimeCounter.textContent = timeFormatted(Number(localStorage.getItem("bestTime")));
		}

		function updateTimer() {
			let currentTime = new Date().getTime();
			let timeDiff = currentTime - startTime;

			timeCounter.textContent = timeFormatted(timeDiff)

			if (gameOver.lose || gameOver.win) {
				// Остановить таймер
				clearInterval(timerInterval);

				// Обновить лучшее время, если текущее время лучше
				if (timeDiff < bestTime) {
					bestTime = timeDiff;
					bestTimeCounter.textContent = timeFormatted(bestTime)
					localStorage.setItem("bestTime", bestTime); // Сохранить лучшее время в localStorage
				}

				// Удалить слушатели при достижении блока со значением 2048
				gameField.removeEventListener('click', handleClick);
			}
		}

		let timerInterval = setInterval(updateTimer, 1000);
	}

	function gameIsWon() {
		// Проверка, есть ли на поле клетка со значением 2048
		let isGameOver = gameCells.filter(cell => cell.textContent == '2048').length;
		if (isGameOver) {
			gameOverWindow.style.display = "flex";
			gameWin.textContent = "You WIN!!!";
			gameOver.win = true;
		}

		function isLose() {
			for (let i = 0; i < gameCells.length; i++) {
				// Проверка соседних блоков по горизонтали
				if (i % 4 < 3 && gameCells[i].textContent === gameCells[i + 1].textContent) {
					return false; // Есть возможность объединения, игра не закончена
				}

				// Проверка соседних блоков по вертикали
				if (i < 12 && gameCells[i].textContent === gameCells[i + 4].textContent) {
					return false; // Есть возможность объединения, игра не закончена
				}
			}
			return true; // Нет возможности объединения, игра окончена
		}

		if (isLose() && freeCells.length === 0) {
			gameOver.lose = true;
			gameOverWindow.style.display = "flex";
			gameWin.textContent = "Game over!"
		}

	}

	function setScore(mergedCell) {
		// При слиянии клеток, полученное значение прибавляется к score
		score += Number(mergedCell);
		scoreCounter.textContent = score;

		// Если текущий счет лучше чем лучший счет, то лучший счет обновляется
		if (score > bestScore) {
			bestScore = score;
			bestScoreCounter.textContent = bestScore;
			localStorage.setItem("bestScore", bestScore);
		}
	}


	function toFillCell() {
		// Выбор рандомного индекса из длины массива freeCells
		const randomCellNumber = Math.floor(Math.random() * freeCells.length);
		// Заполняем выбранный элемент цифрой и удаляем заполненный элемент из массива свободных клеток
		freeCells[randomCellNumber].textContent = fillCellMethod();
		freeCells.splice(randomCellNumber, 1);
	}


	function addClassesToCell() {
		// Проходит по всем игровым клеткам и добавляет классы, если это нужно
		gameCells.map((cell) => {
			const cellInnerNumber = Number(cell.textContent);
			if (cellInnerNumber > 0) {
				cell.className = `cell${cellInnerNumber}`;
			} else {
				cell.className = '';
			}
		})
	}

	function toggleAutoPlay() {
		const directionAll = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

		const eventAI = {
			autoplay: true,
			key: () => {
				return directionAll[Math.floor(Math.random() * 4)]
			},
		}

		function bot() {
			if (!autoplay.checked || gameOver.lose || gameOver.win) {
				clearInterval(autoPlayInterval)
				return
			}

			return handleKeyDown(eventAI)
		}

		let autoPlayInterval = setInterval(bot, 500);
	}


	function handleKeyDown(event) {
		let key = event.key;
		const isAutoplay = event.autoplay;
		if (isAutoplay) {
			key = event.key();
		}
		// Для проверки на изменения, чтобы не создавались новые блоки когда существующие уже некуда двигать
		let changed = false;

		if (key === 'w' || key === 'ArrowUp' || key === 'ц') {

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

					if (gameCells[i - 8].textContent !== '' && !mergedBlocks[`${i - 8}`] && !mergedBlocks[`${i - 4}`]) {
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

					if (gameCells[i - 4].textContent !== '' && !mergedBlocks[`${i - 4}`]) {
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
			} else if (isAutoplay) {

			}
		}


		if (key === 's' || key === 'ArrowDown' || key === 'ы') {

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


		if (key === 'a' || key === 'ArrowLeft' || key === 'ф') {

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


		if (key === 'd' || key === 'ArrowRight' || key === 'в') {

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

		// После перестановки всего поля, обновляем классы, и обновляем объект mergedBlocks
		addClassesToCell();
		mergedBlocks = {};
		// После каждого хода вызываем функцию для проверки есть ли блок 2048 на поле
		gameIsWon();
		// Если игрок достиг блока 2048 или нет ходов, удаляем слушатель
		if (gameOver.win || gameOver.lose) document.removeEventListener('keydown', handleKeyDown);
	}
}

