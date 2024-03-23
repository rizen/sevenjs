import {
  createGame,
  createGameClasses,
  Player,
  Game,
} from '@boardzilla/core';
import { cards } from './cards.js';
import { scorePlayer } from './scoring.js';

export class SevenPlayer extends Player {
  score = 0;
};

export class MyGame extends Game {
  round = 1;
  match = 1;
}

export const { Space, Piece } = createGameClasses();

export class Card extends Piece {
  color = undefined;
  value = undefined;
  quantity = 1;
}

export class Reference extends Piece { }

export default createGame(SevenPlayer, MyGame, game => {

  const { action } = game;
  const { playerActions, loop, everyPlayer, whileLoop } = game.flowCommands;

  game.registerClasses(Card, Reference);

  game.create(Space, 'refdrawer');
  $.refdrawer.create(Reference, 'scorecard');
  game.create(Space, 'mess');
  $.mess.onEnter(Card, t => t.hideFromAll());
  for (const card of cards) {
    $.mess.createMany(card.quantity, Card, card.name, card);
  }

  for (const player of game.players) {
    const hand = game.create(Space, 'hand', { player });
    hand.onEnter(Card, c => {
      c.showOnlyTo(player.position);
      hand.sortBy('name');
    });
    const discard = game.create(Space, 'discard', { player });
    discard.onEnter(Card, c => c.showToAll());
    game.create(Space, 'scoreboard', { player });
  }

  game.defineActions({
    drawCards: player => action({ prompt: 'Draw 2 cards' })
      .chooseOnBoard('cards', $.mess.all(Card), {
        number: 2,
      })
      .move('cards', player.my('hand')),
    discardCard: player => action({ prompt: 'Discard a card' })
      .chooseOnBoard('card', player.my('hand').all(Card))
      .move('card', player.my('discard')),
    discardDown: player => action({ prompt: 'Choose 3 cards to discard, black cards discarded will score' })
      .chooseOnBoard('cards', player.my('hand').all(Card), {
        number: 3,
        confirm: 'Are you sure these are the 3 you want to discard?',
      })
      .do(({ cards }) => cards.forEach((c) => {
        if (c.color == 'black')
          player.score++;
      }))
      .move('cards', player.my('discard')),
  });


  const determineWinner = () => {
    let highestPlayer = undefined;
    let highestScore = 0;
    for (const player of game.players) {
      if (player.score > highestScore) {
        highestPlayer = player;
        highestScore = player.score;
      }
      else if (player.score == highestScore) {
        highestPlayer = undefined;
      }
      console.log(player.name, player.score)
    }
    game.finish(highestPlayer);
  }

  game.defineFlow(
    whileLoop({
      while: () => game.match < 4,
      do: [
        () => {
          $.mess.shuffle();
          for (const player of game.players) {
            $.mess.firstN(3, Card).putInto(player.my('hand'))
          }
        },
        whileLoop({
          while: () => game.round < 8,
          do: [
            () => {
              for (const player of game.players) {
                $.mess.firstN(2, Card).putInto(player.my('hand'))
              }
            },
            everyPlayer({
              do: playerActions({ actions: ['discardCard'] })
            }),
            () => {
              game.round++;
            }
          ]
        }),
        everyPlayer({
          do: playerActions({ actions: ['discardDown'] })
        }),
        () => {
          for (const player of game.players) {
            scorePlayer(player, game);
            player.my('hand').all().putInto($.mess);
            player.my('discard').all().putInto($.mess);
          }
          game.match++
          game.round = 0;
        }
      ]
    }),
    () => {
      determineWinner();
    },
  ); // end flow

});

