import { Game } from './game.js'

let container = document.getElementById('game');	
let game = new Game({container: container});
game.start();