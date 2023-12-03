# Tic-Tac-Toe Game
Created for Dev Challenge XX Final

Deployed app: https://tic-tac-toe-rtc.vercel.app/

## Description
Tic-Tac-Toe game that is implemented using WebRTC

## Technical information
The solution is based on pure vanilla js with no libs using [Vite](https://vitejs.dev/) as a bundler.

For tests it is using [Vitest](https://vitest.dev/) that is using [WebdriverIO](https://webdriver.io/) under the hood.

## Project structure
- `components` - Project is using component-based approach with custom elements. Components are using `ttt-` prefix that means "tic-tac-toe."
    - The `ttt-app` component is the main component containing the whole app, routing logic and app state.
    - The `ttt-start-page` component is responsible for the Start Page UI
    - The `ttt-host-page` component is responsible for Host Page UI
    - The `ttt-guest-page` component is responsible for Guest Page UI
    - The `ttt-game-page` component is responsible for running the game page
    - The `ttt-finish-page` component is responsible for the game over page
    - `base-component.js` - Base component that is used as a base for all components
- `helpers` - Helper classes
    - `game.helper` - Functions that are helping calculating game logic
    - `observable` - Observable implementation to add reactivity to the app
- `services` - Services
  - `web-rtc.service` - WebRtc implementation
- `styles` - additional styles
    - `common` - styles that are common for the app and most likely needed in most/all components
- `main.js` - file defines all components
- `main.css` - main css file that defines some top-level styles
- `game-controller.js` - file defines the game controller that is responsible for the game logic
- `enums.js` - enums ¯\_(ツ)_/¯

## Available functionality
- Host game
- Join to game
- Make move and sync it with the opponent
- Win/loss/draw message
- Randomly decide who goes first
- Show who plays what and whose turn is right now
- Users can start playing again without new WebRTC connection
- Error handling
- Responsive UI
- Start a new game from game over screen

## Known issues
- Copy is not working on mobile

## How to run
1. Clone the repo
2. Run `npm install`
3. Run `npm run dev`

## How to run test
1. Clone the repo
2. Run `npm install`
3. Run `npm run test`

