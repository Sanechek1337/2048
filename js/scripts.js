const gameField = document.querySelector('#game-field');

const gameCells = Array.from(document.querySelectorAll('.cells'));
let freeCells = Array.from(gameCells); // Заполняем массив элементами gameCells

function toFillCell() {
	const randomCellNumber = Math.floor(Math.random() * freeCells.length); // Выбор рандомного индекса из массива freeCells
	freeCells[randomCellNumber].textContent = Math.round(Math.random()) ? '2' : '4'; // Заполняем выбранный элемент цифрой
	freeCells.splice(randomCellNumber, 1) // Удаляем заполненный элемент из массива свободных клеток
}

toFillCell()
toFillCell()

function handleKeyDown(event) {
	// debugger
	const key = event.key;

	if (key === 'w' || key === 'ArrowUp') {
		for (let j = 0; j < 4; j++) {
			for (let i = 12; i < 16; i++) {

				if (gameCells[i - 12].textContent !== '') {
					if (gameCells[i - 8].textContent === gameCells[i - 12].textContent) {
						gameCells[i - 12].textContent = Number(gameCells[i - 8].textContent) * 2;
						gameCells[i - 8].textContent = ''
					}
				} else {
					gameCells[i - 12].textContent = gameCells[i - 8].textContent;
					gameCells[i - 8].textContent = '';
				}

				if (gameCells[i - 8].textContent !== '') {
					if (gameCells[i - 4].textContent === gameCells[i - 8].textContent) {
						gameCells[i - 8].textContent = Number(gameCells[i - 4].textContent) * 2;
						gameCells[i - 4].textContent = ''
					}
				} else {
					gameCells[i - 8].textContent = gameCells[i - 4].textContent;
					gameCells[i - 4].textContent = '';
				}

				if (gameCells[i - 4].textContent !== '') {
					if (gameCells[i].textContent === gameCells[i - 4].textContent) {
						gameCells[i - 4].textContent = Number(gameCells[i].textContent) * 2;
						gameCells[i].textContent = ''
					}
				} else {
					gameCells[i - 4].textContent = gameCells[i].textContent;
					gameCells[i].textContent = '';
				}

			}
		}

		freeCells = gameCells.filter(cell => cell.textContent === '')
		toFillCell()
	}
	if (key === 's' || key === 'ArrowDown') {

		for (let j = 0; j < 4; j++) {
			for (let i = 0; i < 4; i++) {

				if (gameCells[i + 12].textContent !== '') {
					if (gameCells[i + 8].textContent === gameCells[i + 12].textContent) {
						gameCells[i + 12].textContent = Number(gameCells[i + 8].textContent) * 2;
						gameCells[i + 8].textContent = ''
					}
				} else {
					gameCells[i + 12].textContent = gameCells[i + 8].textContent;
					gameCells[i + 8].textContent = '';
				}

				if (gameCells[i + 8].textContent !== '') {
					if (gameCells[i + 4].textContent === gameCells[i + 8].textContent) {
						gameCells[i + 8].textContent = Number(gameCells[i + 4].textContent) * 2;
						gameCells[i + 4].textContent = ''
					}
				} else {
					gameCells[i + 8].textContent = gameCells[i + 4].textContent;
					gameCells[i + 4].textContent = '';
				}

				if (gameCells[i + 4].textContent !== '') {
					if (gameCells[i].textContent === gameCells[i + 4].textContent) {
						gameCells[i + 4].textContent = Number(gameCells[i].textContent) * 2;
						gameCells[i].textContent = ''
					}
				} else {
					gameCells[i + 4].textContent = gameCells[i].textContent;
					gameCells[i].textContent = '';
				}

			}
		}

		freeCells = gameCells.filter(cell => cell.textContent === '')
		toFillCell()
	}
	if (key === 'a' || key === 'ArrowLeft') {

		for (let j = 0; j < 4; j++) {
			for (let i = 3; i < 16; i += 4) {

				if (gameCells[i - 3].textContent !== '') {
					if (gameCells[i - 2].textContent === gameCells[i - 3].textContent) {
						gameCells[i - 3].textContent = Number(gameCells[i - 2].textContent) * 2;
						gameCells[i - 2].textContent = ''
					}
				} else {
					gameCells[i - 3].textContent = gameCells[i - 2].textContent;
					gameCells[i - 2].textContent = '';
				}

				if (gameCells[i - 2].textContent !== '') {
					if (gameCells[i - 1].textContent === gameCells[i - 2].textContent) {
						gameCells[i - 2].textContent = Number(gameCells[i - 1].textContent) * 2;
						gameCells[i - 1].textContent = ''
					}
				} else {
					gameCells[i - 2].textContent = gameCells[i - 1].textContent;
					gameCells[i - 1].textContent = '';
				}

				if (gameCells[i - 1].textContent !== '') {
					if (gameCells[i].textContent === gameCells[i - 1].textContent) {
						gameCells[i - 1].textContent = Number(gameCells[i].textContent) * 2;
						gameCells[i].textContent = ''
					}
				} else {
					gameCells[i - 1].textContent = gameCells[i].textContent;
					gameCells[i].textContent = '';
				}
			}
		}

		freeCells = gameCells.filter(cell => cell.textContent === '')
		toFillCell()
	}
	if (key === 'd' || key === 'ArrowRight') {

		for (let j = 0; j < 4; j++) {
			for (let i = 0; i < 13; i += 4) {

				if (gameCells[i + 3].textContent !== '') {
					if (gameCells[i + 2].textContent === gameCells[i + 3].textContent) {
						gameCells[i + 3].textContent = Number(gameCells[i + 2].textContent) * 2;
						gameCells[i + 2].textContent = ''
					}
				} else {
					gameCells[i + 3].textContent = gameCells[i + 2].textContent;
					gameCells[i + 2].textContent = '';
				}

				if (gameCells[i + 2].textContent !== '') {
					if (gameCells[i + 1].textContent === gameCells[i + 2].textContent) {
						gameCells[i + 2].textContent = Number(gameCells[i + 1].textContent) * 2;
						gameCells[i + 1].textContent = ''
					}
				} else {
					gameCells[i + 2].textContent = gameCells[i + 1].textContent;
					gameCells[i + 1].textContent = '';
				}

				if (gameCells[i + 1].textContent !== '') {
					if (gameCells[i].textContent === gameCells[i + 1].textContent) {
						gameCells[i + 1].textContent = Number(gameCells[i].textContent) * 2;
						gameCells[i].textContent = ''
					}
				} else {
					gameCells[i + 1].textContent = gameCells[i].textContent;
					gameCells[i].textContent = '';
				}
			}
		}

		freeCells = gameCells.filter(cell => cell.textContent === '')
		toFillCell()
	}
}

document.addEventListener('keydown', handleKeyDown)
// document.addEventListener('click', toFillCell)