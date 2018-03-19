import game from "../game_logic/init_game"

export class gameview {     
  constructor() {
  	this.send_click = function(){this.game.trigger('click',{})};
  	this.game = game;
    this.game_state = game.state.data;
  }
}