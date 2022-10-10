const GAME_STATE = {
  FirstCardAwaits: 'FirstCardAwaits',
  SecondCardAwaits: 'SecondCardAwaits',
  CardsMatchFailed: 'CardsMatchFailed',
  CardsMatched: 'CardsMatched',
  GameFinished: 'GameFinished',
}

const Symbols = [
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17989/__.png', // 黑桃
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17992/heart.png', // 愛心
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17991/diamonds.png', // 方塊
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17988/__.png', // 梅花
]
// View
const view = {
  // To render cards
  displayCards(indexes) {
    const rootElement = document.querySelector('#cards')
    // Can also use duck typing - Array.from({length: 52}, (e, i) => i++)
    // create an array with 0-51 index then map these indices inot getCardElement()
    // then join() together as a whole chunk of string template.
    rootElement.innerHTML = indexes
      .map((index) => this.getCardElement(index))
      .join('')
  },
  // To render back of each card
  getCardElement(index) {
    return `<div class="card back" data-index="${index}"></div>`
  },
  // To render card content
  getCardContent(index) {
    const number = this.transformNumber((index % 13) + 1)
    const symbol = Symbols[Math.floor(index / 13)]
    return `<p>${number}</p>
            <img src="${symbol}"/>
            <p>${number}</p>`
  },
  // To transform 1, 11, 12, 13 to card in English character
  transformNumber(number) {
    switch (number) {
      case 1:
        return 'A'
      case 11:
        return 'J'
      case 12:
        return 'Q'
      case 13:
        return 'K'
      default:
        return number
    }
  },
  flipCards(...cards) {
    cards.map((card) => {
      if (card.classList.contains('back')) {
        card.classList.remove('back')
        const index = Number(card.dataset.index)
        card.innerHTML = this.getCardContent(index)
        return
      }
      card.classList.add('back')
      card.innerHTML = null
    })
  },
  pairCards(...cards) {
    cards.map((card) => {
      card.classList.add('paired')
    })
  },
  renderScore(score) {
    document.querySelector('.score').textContent = `Score: ${score}`
  },
  renderTriedTimes(times) {
    document.querySelector('.tried').textContent = `You've tried: ${times}`
  },
  appendWrongAnimation(...cards) {
    cards.map((card) => {
      card.classList.add('wrong')
      card.addEventListener(
        'animationed',
        (event) => event.target.classList.remove('wrong'),
        { once: true }
      )
    })
  },
  showGameFinished() {
    const div = document.createElement('DIV')
    div.classList.add('completed')
    div.innerHTML = `
      <p>Complete!</p>
      <p>Score: ${model.score}</p>
      <p>You've tried: ${model.triedTimes} times</p>`

    const header = document.querySelector('#header')
    header.before(div)
  },
}

// Utility
const utility = {
  // To shuffle cards
  getRandomNumberArray(count) {
    const number = Array.from(Array(count).keys())
    for (let index = number.length - 1; index > 0; index--) {
      let randomIndex = Math.floor(Math.random() * (index + 1))
        ;[number[index], number[randomIndex]] = [
          number[randomIndex],
          number[index],
        ]
    }
    return number
  },
}

// Controller
const controller = {
  currentState: GAME_STATE.FirstCardAwaits,
  generateCards() {
    view.displayCards(utility.getRandomNumberArray(52))
  },
  dispacthCardAction(card) {
    if (!card.classList.contains('back')) {
      return
    }
    switch (this.currentState) {
      case GAME_STATE.FirstCardAwaits:
        view.flipCards(card)
        model.revealedCards.push(card)
        this.currentState = GAME_STATE.SecondCardAwaits
        break
      case GAME_STATE.SecondCardAwaits:
        view.renderTriedTimes(++model.triedTimes)
        view.flipCards(card)
        model.revealedCards.push(card)
        // Determine if two cards are matched
        if (model.isRevealedCardsMatched()) {
          // Matched
          view.renderScore((model.score += 10))
          this.currentState = GAME_STATE.CardsMatched
          view.pairCards(model.revealedCards[0])
          view.pairCards(model.revealedCards[1])
          model.revealedCards = []
          if (model.score === 260) {
            this.currentState = GAME_STATE.GameFinished
            view.showGameFinished()
            return
          }
          this.currentState = GAME_STATE.FirstCardAwaits
        } else {
          // Not matched
          this.currentState = GAME_STATE.CardsMatchFailed
          view.appendWrongAnimation(...model.revealedCards)
          setTimeout(this.resetCards, 1000)
        }
        break
    }
  },
  resetCards() {
    view.flipCards(...model.revealedCards)
    model.revealedCards = []
    controller.currentState = GAME_STATE.FirstCardAwaits
  },
}

// Model
const model = {
  revealedCards: [],
  isRevealedCardsMatched() {
    return (
      this.revealedCards[0].dataset.index % 13 ===
      this.revealedCards[1].dataset.index % 13
    )
  },
  score: 0,
  triedTimes: 0,
}

controller.generateCards()

// Listen to each cards
// document.querySelectorAll('.card').forEach((card) => {
//   card.addEventListener('click', (event) => {
//     console.log(card)
//   })
// })

const cards = document.querySelector('#cards')
cards.addEventListener('click', (event) => {
  if (event.target.tagName === 'DIV') {
    controller.dispacthCardAction(event.target)
  }
})
