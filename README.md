# Flipping Cards Game / Memorizing Game

## Table of contents

- [Overview](#overview)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)

## Overview

This is a memorizing card game, which you flip two cards and see if it's matched.
If it's matched, the matched cards stay visible. If it's not matched, the cards will flip back again.
This is a game to test your memorization. Each pair of matched cards is 10 points. When the score is at 260, the game is ended.

## My process

### Built with

- HTML5
- CSS custom properties and animation
- CSS Flexbox
- MVC design pattern
- Modularization (each function does one task)

### What I learned

##### MVC Design Pattern

MVC design pattern/architectural pattern is what I get the most out of this project.
It really helped me thinking within a framework while I was building/coding along for this project. It makes the whole project really manageable.
MVC stands for Model-View-Controller, which each of them has its own purpose to work collectively as a whole.

- Model: It is the backend that contains all the data logic, which serves as a database.
- View: It manages the presentation part, which is the frontend. Anything that shows to the users it must come from `view`.
- Controller: It is the brain of the whole application/project that works as a middleman between `model` and `view`. It controls how data is displayed to the users.

Why should we use MVC? It's all about `separation of concerns`. The MVC pattern helps us divide up the codebase into separate components. This leads to the application to be maintainable, scalable, and readable.

#### Fisher-Yates Shuffle

In this project, when the game is initialized, it has to shuffle a deck of cards in different order. Then, I found this popular algorithm - `Fisher-Yates Shuffle` and applied into the project.
What it does is to shuffle a given array in different order. The idea is to start from the last card/element in an array and swap it with a randomly selected element from the whole array.

```javascript
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
  }
```
