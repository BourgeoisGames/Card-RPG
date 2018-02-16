import game from "../game_logic/engine"

var yuri = "https://vignette.wikia.nocookie.net/doki-doki-literature-club/images/7/72/Yuri_school_1.png/revision/latest?cb=20171112095243";
var yuri2 = "https://vignette.wikia.nocookie.net/doki-doki-literature-club/images/1/19/Yurifull1.png/revision/latest?cb=20171203145750";
var yuri3 = "https://cdn140.picsart.com/251511791012212.png?r240x240";
var classroom = "https://vignette.wikia.nocookie.net/doki-doki-literature-club/images/8/87/Alt_classroom.jpeg/revision/latest?cb=20171211171811";
var spiderweb = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuz8PqsGP11FE5pFLY72RpulXoUM9XHtWEMrAZy7T3IGbEd_bX";
var bullying = "https://lparchive.org/Doki-Doki-Literature-Club/Update%2027/24-kJ6nlqg.gif";

var rooms = [
{
	message:"\"❤ Hi Player-san ❤\"",
	img:yuri,
	background:classroom
},
{
	message:"\"❤ I was hoping I'd get a chance to see you here ❤\""
},
{
	message:"\"... but ...\""
},
{
	message:"\"...\""
},
{
	message:"\"The falling stars you wished upon\""
},
{
	message:"\"are cinders now, and now they're gone\""
},
{
	message:"\"their residue festoons my fetid fields.\"",
	background:spiderweb
},
{
	message:"\"The withered husks of lovers past\""
},
{
	message:"\"the shells are all that ever last\""
},
{
	message:"\"I've taken everything that they've concealed.\""
},
{
	message:"\"...\"",
	img:yuri2
},
{
	message:"\"Who ever told you life was fair?\"",
	img:yuri3
},
{
	message:"Say no to bullying",
	img:null,
	background:bullying
}
];

var newroom = function(gc,args) {
	var room = gc.state.data.rooms.shift();
	if (!room) {return 1;}
	Object.keys(room).forEach(function(x){
		gc.state.data.room[x] = room[x];
	});
};
game.add_script({"id":"newroom","script":newroom});
game.add_trigger({"trigger_id":"click_to_next", "signal_id":"click", "script_reference":{"id":"newroom","args":{}}});

export class gameview {     
  constructor() {
  	this.game = game;
    this.game_state = game.state.data;
    this.send_click = function(){this.game.trigger('click',{})};
    game.state.data.rooms = rooms;
    game.state.data.room = {};
    game.trigger("click",{});
  }
}