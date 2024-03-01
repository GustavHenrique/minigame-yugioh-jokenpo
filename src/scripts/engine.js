const state = {
    score: {
        player: 0,
        computer: 0,
        scoreBox: document.getElementById('score_points'),
    },
    cardSprites: {
        avatar: document.getElementById('card_image'),
        name: document.getElementById('card-name'),
        type: document.getElementById('card-type'),
    },
    fieldCards: {
        player: document.getElementById('player-field-card'),
        computer: document.getElementById('computer-field-card'),
    },
    playerSides: {
        player1: 'player-cards',
        player1Box: document.querySelector('#player-cards'),
        computer: 'computer-cards',
        computerBox: document.querySelector('#computer-cards'),
    },
    actions: {
        button: document.getElementById('next-duel'),
    }
};

const playerSides = {
    player1: 'player-cards',
    computer: 'computer-cards',
};

const pathImages = "./src/assets/icons/";

const cardData = [
    {
        id: 0,
        name: 'Blue Eyes White Dragon',
        type: 'Paper',
        img: `${pathImages}dragon.png`,	
        winOf: [1],
        loseOf: [2],
    },
    {
        id: 1,
        name: 'Dark Magician',
        type: 'Rock',
        img: `${pathImages}magician.png`,	
        winOf: [2],
        loseOf: [0],
    },
    {
        id: 2,
        name: 'Exodia',
        type: 'Scissors',
        img: `${pathImages}exodia.png`,	
        winOf: [0],
        loseOf: [1],
    },
];

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

async function createCardImage(cardId, fieldSide) {
    const cardImage = document.createElement('img');
    cardImage.setAttribute('height', '100px');
    cardImage.setAttribute('src', './src/assets/icons/card-back.png');
    cardImage.setAttribute('data-id', cardId);
    cardImage.classList.add('card');

    if (fieldSide === playerSides.player1) {
        cardImage.addEventListener('click', () => {
            setCardsField(cardImage.getAttribute('data-id'))
        });
        cardImage.addEventListener('mouseover', () => {
            drawSelectedCard(cardId)
        });
    }
    

    return cardImage;
}

function drawSelectedCard(cardId) { 
    state.cardSprites.avatar.src = cardData[cardId].img;
    state.cardSprites.name.innerText = cardData[cardId].name;
    state.cardSprites.type.innerText = "Attribute: " + cardData[cardId].type;
}

async function removeAllCardsImages() {
    let { computerBox, player1Box } = state.playerSides;

    let imgElements = computerBox.querySelectorAll('img');

    imgElements.forEach(img => img.remove());

    imgElements = player1Box.querySelectorAll('img');

    imgElements.forEach(img => img.remove());
}

async function setCardsField(cardId) {
    await removeAllCardsImages();

    let computerCardId = await getRandomCardId();

    state.fieldCards.player.style.display = 'block';
    state.fieldCards.computer.style.display = 'block';

    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

    let duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResults);

    const card = cardData.find(card => card.id === parseInt(cardId));
    state.fieldCards.player.setAttribute('src', card.img);
    state.fieldCards.player.setAttribute('data-id', card.id);
}

async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.player} | Lose: ${state.score.computer}`;
}

async function drawButton(text) {
    state.actions.button.innerText = text;
    state.actions.button.style.display = 'block';
}

async function checkDuelResults(playerCardId, computerCardId) {
    let duelResults = "DRAW";

    let playerCard = cardData[playerCardId];

    if (playerCard.winOf.includes(computerCardId)) {
        duelResults = 'WIN';
        state.score.player++;
        
    } else if (playerCard.loseOf.includes(computerCardId)) {
        duelResults =  'LOSE';
        state.score.computer++;
    }

    await playAudio(duelResults.toLowerCase() === 'win' ? 'win' : 'lose');
    return duelResults;
}

async function drawCards(amount, fieldSide) {
    for (let i = 0; i < amount; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

async function resetDuel() {
    state.fieldCards.player.style.display = 'none';
    state.fieldCards.computer.style.display = 'none';
    state.actions.button.style.display = 'none';

    state.cardSprites.avatar.src = '';
    state.cardSprites.name.innerText = 'Selecione';
    state.cardSprites.type.innerText = 'uma carta';

    await removeAllCardsImages();
    await drawCards(5, playerSides.player1);
    await drawCards(5, playerSides.computer);
}

async function playAudio(status) {
    try {
        let audio = new Audio(`./src/assets/audios/${status}.wav`);
        audio.play();
        
    } catch (error) {
        console.log('Error trying to play audio: ', error);
    }
}

function init() {
    state.fieldCards.player.style.display = 'none';
    state.fieldCards.computer.style.display = 'none';
    drawCards(5, playerSides.player1);
    drawCards(5, playerSides.computer);

    const bgm = document.getElementById('bgm');
    bgm.volume = 0.1;
    bgm.play();
}

init();