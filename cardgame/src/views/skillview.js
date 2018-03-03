import {bindable} from 'aurelia-framework';

var remove_value = (arr,value) => {
  var index = arr.indexOf(value);
  if (index >= 0) {
      arr.splice( index, 1 );
  }
}

export class skillview {
  @bindable game = {};
  constructor() {
  	this.play_cards = function(){
      var that = this
      that.game.trigger('played_cards',{"cards":that.cards});
    };
    this.select_card = card =>{
      var that = this
      if (card.selected) {
        remove_value(that.cards,card.id);
        card.selected = false;
      }
      else{
        that.cards.push(card.id);
        card.selected = true;
      }
      //alert(that.cards);
    }
  	this.cards = [];
    this.hand = [];
  }
  bind() {
    this.hand = this.game.get_by_type_and_ids('card',this.game.state.data.player.hand);
    this.hand = this.hand.map(x => {
      var yy = x;
      yy.selected = false;
      return yy;
    });
  }
};