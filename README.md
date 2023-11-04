# Tic-Tac-Toe Game
Created for Dev Challenge XX Final


## Description
Tic-Tac-Toe game that is implemented using WebRTC

## Technical information
The solution is based on pure vanilla js with no libs using [Vite](https://vitejs.dev/) as a bundler.

For tests it is using [Vitest](https://vitest.dev/) that is using [WebdriverIO](https://webdriver.io/) under the hood.

## Project structure
- `components` - Project is using component-based approach with custom elements. Components are using `ttt-` prefix that means "tic-tac-toe."
    - The `ttt-app` component is the main component containing the whole app.
    - The `tmp-counter` component is responsible for the counter
- `helpers` - Helper classes
    - `math.helper` - Math functions that are not defined in the default Math class
- `services` - Services
  - `web-rtc.service`
- `styles` - additional styles
    - `common` - styles that are common for the app and most likely needed in most/all components
- `main.js` - file defines all components

## Available functionality

## How to run
1. Clone the repo
2. Run `npm install`
3. Run `npm run dev`

## How to run test
1. Clone the repo
2. Run `npm install`
3. Run `npm run test`

# TODO
- [x] WebRTC connection
- [ ] Connection setup
    - Generate unique game session with a connection link or code
    - Player 2 can connect to the link to establish connection
    - Once player 2 connects, game starts
- [ ] Create 3x3 grid
- [ ] Starting the game
  - Players decide who goes first by mutual agreement or a random method implemented by the developer.
  - The interface shows which player's turn it is.
- [ ] During the game
  - Click on empty square to make move
  - the state is synced via WebRTC
  - Win/loss/draw message
- [ ] Game ending
  - Players can choose to play again without new WebRTC connection
- [ ] Error handling
  - If a player loses connection, the game should end and the other player should be notified.
  - If a player tries to connect to a game session that does not exist, they should be notified.
  - If a player tries to connect to a game session that already has two players, they should be notified.
  - If a player tries to connect to a game session that has already ended, they should be notified.
  - If a player tries to make a move before the game has started, they should be notified.
  - If a player tries to make a move when it is not their turn, they should be notified.
  - If a player tries to make an invalid move, they should be notified.
  - If a player tries to make a move after the game has ended, they should be notified.
- [ ] Mobile UI
- [ ] Animations
