import { expect, test, beforeEach } from 'vitest'
import { scoreRunOf7In1Color, scoreSetOf7, score7Card1Color, scoreSetOf5AndSetOf2, scoreRunOf7, scoreSetsAndRuns, scoreEvenOrOdd } from '../src/game/scoring.js';
import { MyGame, Space, Card } from '../src/game/index.js';

//@ts-ignore
let game: MyGame;

beforeEach(() => {
    //@ts-ignore
    game = new MyGame({ classRegistry: [Space, Card] });
});


test('run of 7 of 1 color', () => {
    const card1 = game.create(Card, 'card1', { color: 'red', value: 3 })
    const card2 = game.create(Card, 'card2', { color: 'red', value: 1 })
    const card3 = game.create(Card, 'card3', { color: 'red', value: 7 })
    const card4 = game.create(Card, 'card4', { color: 'red', value: 4 })
    const card5 = game.create(Card, 'card5', { color: 'red', value: 5 })
    const card6 = game.create(Card, 'card6', { color: 'red', value: 6 })
    const card7 = game.create(Card, 'card7', { color: 'red', value: 2 })
    expect(scoreRunOf7In1Color(game.all(Card))).toBe(7);
    card1.color = 'blue';
    expect(scoreRunOf7In1Color(game.all(Card))).toBe(0);
});

test('set of 7', () => {
    const card1 = game.create(Card, 'card1', { color: 'red', value: 2 })
    const card2 = game.create(Card, 'card2', { color: 'blue', value: 2 })
    const card3 = game.create(Card, 'card3', { color: 'purple', value: 2 })
    const card4 = game.create(Card, 'card4', { color: 'red', value: 2 })
    const card5 = game.create(Card, 'card5', { color: 'red', value: 2 })
    const card6 = game.create(Card, 'card6', { color: 'red', value: 2 })
    const card7 = game.create(Card, 'card7', { color: 'red', value: 2 })
    expect(scoreSetOf7(game.all(Card))).toBe(6);
    card4.value = 3;
    expect(scoreSetOf7(game.all(Card))).toBe(0);
});


test('seven cards 1 color', () => {
    const card1 = game.create(Card, 'card1', { color: 'red', value: 3 })
    const card2 = game.create(Card, 'card2', { color: 'red', value: 1 })
    const card3 = game.create(Card, 'card3', { color: 'red', value: 7 })
    const card4 = game.create(Card, 'card4', { color: 'red', value: 4 })
    const card5 = game.create(Card, 'card5', { color: 'red', value: 5 })
    const card6 = game.create(Card, 'card6', { color: 'red', value: 6 })
    const card7 = game.create(Card, 'card7', { color: 'red', value: 2 })
    expect(score7Card1Color(game.all(Card))).toBe(5);
    card1.color = 'blue';
    expect(score7Card1Color(game.all(Card))).toBe(0);
});


test('set of 5 and set of 2', () => {
    const card1 = game.create(Card, 'card1', { color: 'red', value: 2 })
    const card2 = game.create(Card, 'card2', { color: 'blue', value: 2 })
    const card3 = game.create(Card, 'card3', { color: 'red', value: 4 })
    const card4 = game.create(Card, 'card4', { color: 'purple', value: 2 })
    const card5 = game.create(Card, 'card5', { color: 'red', value: 2 })
    const card6 = game.create(Card, 'card6', { color: 'red', value: 2 })
    const card7 = game.create(Card, 'card7', { color: 'red', value: 4 })
    expect(scoreSetOf5AndSetOf2(game.all(Card))).toBe(4);
    card4.value = 3;
    expect(scoreSetOf5AndSetOf2(game.all(Card))).toBe(0);
});

test('run of 7', () => {
    const card1 = game.create(Card, 'card1', { color: 'red', value: 3 })
    const card2 = game.create(Card, 'card2', { color: 'red', value: 1 })
    const card3 = game.create(Card, 'card3', { color: 'purple', value: 7 })
    const card4 = game.create(Card, 'card4', { color: 'red', value: 4 })
    const card5 = game.create(Card, 'card5', { color: 'red', value: 5 })
    const card6 = game.create(Card, 'card6', { color: 'blue', value: 6 })
    const card7 = game.create(Card, 'card7', { color: 'red', value: 2 })
    expect(scoreRunOf7(game.all(Card))).toBe(3);
    card1.value = 7;
    expect(scoreRunOf7(game.all(Card))).toBe(0);
});


test('sets and runs', () => {
    const card1 = game.create(Card, 'card1', { color: 'red', value: 2 })
    const card2 = game.create(Card, 'card2', { color: 'red', value: 1 })
    const card3 = game.create(Card, 'card3', { color: 'purple', value: 1 })
    const card4 = game.create(Card, 'card4', { color: 'red', value: 4 })
    const card5 = game.create(Card, 'card5', { color: 'red', value: 5 })
    const card6 = game.create(Card, 'card6', { color: 'blue', value: 3 })
    const card7 = game.create(Card, 'card7', { color: 'red', value: 2 })
    expect(scoreSetsAndRuns(game.all(Card))).toBe(2);
    card4.value = 5;
    expect(scoreSetsAndRuns(game.all(Card))).toBe(0);
    card6.value = 5;
    expect(scoreSetsAndRuns(game.all(Card))).toBe(2);
    card3.value = 4;
    card2.value = 6;
    card5.value = 2;
    card6.value = 2;
    expect(scoreSetsAndRuns(game.all(Card))).toBe(2);
});


test('even or odd', () => {
    const card1 = game.create(Card, 'card1', { color: 'red', value: 1 })
    const card2 = game.create(Card, 'card2', { color: 'red', value: 1 })
    const card3 = game.create(Card, 'card3', { color: 'purple', value: 1 })
    const card4 = game.create(Card, 'card4', { color: 'red', value: 7 })
    const card5 = game.create(Card, 'card5', { color: 'red', value: 5 })
    const card6 = game.create(Card, 'card6', { color: 'blue', value: 3 })
    const card7 = game.create(Card, 'card7', { color: 'red', value: 3 })

    expect(scoreEvenOrOdd(game.all(Card))).toBe(1);
    card1.value = 2;
    expect(scoreEvenOrOdd(game.all(Card))).toBe(0);
    card1.value = 2;
    card2.value = 4;
    card3.value = 6;
    card4.value = 4;
    card5.value = 4;
    card6.value = 2;
    card7.value = 6;
    expect(scoreEvenOrOdd(game.all(Card))).toBe(1);
});
