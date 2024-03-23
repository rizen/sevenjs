import React from 'react';
import { render, ProfileBadge } from '@boardzilla/core';
import { default as setup, Card, Space, Reference } from '../game/index.js';

import './style.scss';
import '@boardzilla/core/index.css';

render(setup, {
  boardSizes: (_screenX, _screenY, mobile) => mobile ? {
    name: 'mobile',
    aspectRatio: 19.5 / 9,
  } : {
    name: 'desktop',
    aspectRatio: 16 / 9.5,
  },

  settings: {
  },
  layout: (game, _player, boardSize) => {
    //game.showLayoutBoundingBoxes();
    game.disableDefaultAppearance();

    if (boardSize === 'desktop') {

      game.layout('hand', {
        area: { left: 0, top: 10, width: 78, height: 90 },
      });

    } // end desktop
    else { // mobile

      game.layout('hand', {
        area: { left: 0, top: 10, width: 78, height: 90 },
      });

    } // end mobile

    game.all('hand').layout(Card, {
      columns: 6,
      rows: 2,
      alignment: 'bottom',
    });

    game.layout('discard', {
      area: { left: 80, top: 0, width: 20, height: 100 },
      columns: 1,
      rows: 7,
      gap: 1,
    });

    game.all('discard').layout(Card, {
      columns: 10,
      rows: 1,
      alignment: 'bottom left',
    });

    game.layout('scoreboard', {
      area: { left: 80, top: 0, width: 20, height: 100 },
      columns: 1,
      rows: 7,
    });

    game.all('scoreboard').appearance({
      render: scoreboard => (
        <div className="scoreHeader">
          <ProfileBadge player={scoreboard.player} />
          <span className="score">
            {scoreboard.player.score} points
          </span>
        </div>
      )
    });

    game.layout('refdrawer', {
      area: {
        top: 0, left: 30, width: 40, height: 45
      },
      drawer: {
        closeDirection: 'up',
        tab: () => 'Scoring Reference',
      },
    });

    game.all(Card).appearance({
      aspectRatio: 775 / 1075,
      render: ({ name }) => (
        <div className="flipper">
          <div className="front" title={name}></div>
          <div className="back"></div>
        </div>
      ),
    });

    $.mess.layout(Card, {
      columns: 1,
      offsetRow: { x: 1, y: 1 },
      scaling: 'fit',
      limit: 10,
      //  haphazardly: 5,
    });

    game.all('hand', { mine: false }).appearance({ render: false });

    $.mess.appearance({ render: false });

    game.layoutControls({
      element: game,
      top: 0,
      left: 0,
      width: 80,
    });

  }
});
