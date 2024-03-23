import { Card } from './index.js';


export const scoreRunOf7In1Color = (hand) => {
    if (score7Card1Color(hand) == 0)
        return 0;
    if (scoreRunOf7(hand) == 0)
        return 0;
    return 7;
}

export const scoreSetOf7 = (hand) => {
    //@ts-ignore
    const sorted = hand.sortedBy('value');
    if (sorted[0].value == sorted[6].value) {
        return 6;
    }
    return 0;
}

export const score7Card1Color = (hand) => {
    //@ts-ignore
    const sorted = hand.sortedBy('color');
    if (sorted[0].color == sorted[6].color)
        return 5;
    return 0;
}

export const scoreSetOf5AndSetOf2 = (hand) => {
    //@ts-ignore
    const sorted = hand.sortedBy('value');
    if (
        (sorted[0].value == sorted[1].value && sorted[2].value == sorted[6].value)
        ||
        (sorted[0].value == sorted[4].value && sorted[5].value == sorted[6].value)
    )
        return 4;
    return 0;
}

export const scoreRunOf7 = (hand) => {
    //@ts-ignore
    const sorted = hand.sortedBy('value');
    //@ts-ignore
    if (sorted.every((card, index) => card.value == index + 1))
        return 3;
    return 0;
}

export const scoreSetsAndRuns = (hand) => {
    if (hand.every((card) => card.value == '+1'))
        return 0;
    //@ts-ignore
    const sorted = hand.sortedBy('value');

    // find and remove set of 3
    const largest = {};
    for (const card of sorted) {
        if (card.value in largest)
            largest[card.value]++;
        else
            largest[card.value] = 1;
    }
    let setOf3 = false;
    for (const value of [1, 2, 3, 4, 5, 6, 7]) {
        if (largest[value] == 7 || largest[value] == 5 || largest[value] == 3) {
            //@ts-ignore
            const index = sorted.findIndex(card => card.value == value);
            sorted.splice(index, 3);
            setOf3 = true;
            break;
        }
    }

    // remove pairs
    let previous = undefined;
    let pairs = 0;
    for (let index = sorted.length - 1; index >= 0; index--) {
        if (sorted[index].value == previous) {
            sorted.splice(index, 2)
            previous = undefined;
            pairs++;
        }
        else {
            previous = sorted[index].value
        }
    }
    if (pairs != 2)
        return 0;

    // test all sets
    if (setOf3)
        return 2;

    // test for run
    if (sorted[0].value + 1 == sorted[1].value && sorted[1].value + 1 == sorted[2].value)
        return 2;

    /// TODO: we're currently taking the set of 3 out as one of the pairs and that's costing the test for the set of 3 to fail

    // test for set of 3
    if (sorted[0].value == sorted[1].value && sorted[1].value == sorted[2].value)
        return 2;

    // no joy
    return 0;
}

export const scoreEvenOrOdd = (hand) => {
    if (hand.every((card) => card.value == '+1'))
        return 0;
    //@ts-ignore
    if (hand.every(card => card.value % 2 == 0) || hand.every(card => card.value % 2 != 0))
        return 1;
    return 0;
}


export const scorePlayer = (player, game) => {
    const hand = player.my('hand')?.all(Card) || [];
    let score = scoreRunOf7In1Color(hand);
    if (score) {
        player.score += score;
        game.message(`${player.name} has scored a run of 7 in 1 color.`);
    }
    else {
        score = scoreSetOf7(hand);
        if (score) {
            player.score += score;
            game.message(`${player.name} has scored a set of 7.`);
        }
        else {
            score = score7Card1Color(hand);
            if (score) {
                player.score += score;
                game.message(`${player.name} has scored 7 cards in 1 color.`);
            }
            else {
                score = scoreSetOf5AndSetOf2(hand);
                if (score) {
                    player.score += score;
                    game.message(`${player.name} has scored a set of 5 + a set of 2.`);
                }
                else {
                    score = scoreRunOf7(hand);
                    if (score) {
                        player.score += score;
                        game.message(`${player.name} has scored a run of 7.`);
                    }
                    else {
                        score = scoreSetsAndRuns(hand);
                        if (score) {
                            player.score += score;
                            game.message(`${player.name} has scored a bunch of sets and runs.`);
                        }
                        else {
                            score = scoreEvenOrOdd(hand);
                            if (score) {
                                player.score += score;
                                game.message(`${player.name} has scored all even or odd.`);
                            }
                            else {
                                game.message(`${player.name} failed to create a scorable hand.`);
                            }
                        }
                    }
                }
            }
        }
    }
    // add bonus points
    let bonus = 0;
    for (const card of hand) {
        if (card.color == 'black') {
            player.score++;
            bonus++;
        }
    }
    if (bonus)
        game.message(`${player.name} has scored ${bonus} bonus point${bonus == 1 ? 's' : ''}.`);
}