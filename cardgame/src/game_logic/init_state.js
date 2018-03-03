var yuri = "https://vignette.wikia.nocookie.net/doki-doki-literature-club/images/7/72/Yuri_school_1.png/revision/latest?cb=20171112095243";
var yuri2 = "https://vignette.wikia.nocookie.net/doki-doki-literature-club/images/1/19/Yurifull1.png/revision/latest?cb=20171203145750";
var yuri3 = "https://cdn140.picsart.com/251511791012212.png?r240x240";
var classroom = "https://vignette.wikia.nocookie.net/doki-doki-literature-club/images/8/87/Alt_classroom.jpeg/revision/latest?cb=20171211171811";
var spiderweb = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuz8PqsGP11FE5pFLY72RpulXoUM9XHtWEMrAZy7T3IGbEd_bX";
var bullying = "https://lparchive.org/Doki-Doki-Literature-Club/Update%2027/24-kJ6nlqg.gif";
var just_monika = "https://vignette.wikia.nocookie.net/galnet/images/f/f8/Vikax.png/revision/latest?cb=20130709221406";
var treasure = "https://i.redditmedia.com/HwYQt93EgUAe8ao14otx6k2SErTDVoGh6ZzIFc-dEb0.jpg?w=768&s=6dbe34fe968f971b3f44642effc1434b";
var swamp = "https://cdna.artstation.com/p/assets/images/images/002/879/742/large/marius-janusonis-4.jpg";
var ruins_exterior = "https://img00.deviantart.net/8ca0/i/2012/288/1/f/forgotten_glory_by_jonasdero-d3jkcvy.jpg";
var ruins_interior = "https://i.redditmedia.com/6qWKlYJin05ZvDkFaFpk6U34H41siyq5a3ji5Y4d6ho.jpg?w=1024&s=be2d3837db21c90d9eaa4a4351c908c5";
var city = "https://i.redditmedia.com/T0-eQaOlaNXPRk4Jwr_2SNj1sW2OlPxYh4alr93WTGg.jpg?w=1024&s=9107f09f413a2ace411b773dbc8bde04";
var trap = "https://www.wildwestmotorsportspark.com/wp-content/uploads/2016/03/rocks-foreground.png";
var tavern = "https://cdna0.artstation.com/p/assets/images/images/003/187/064/large/aleksandra-mokrzycka-1-4.jpg?1470780461";
var death = "https://cdnb.artstation.com/p/assets/images/images/000/612/163/large/vitor-hudson-5.jpg?1428526789";


var sample_deck = ['fury','smash','endure',
'combat reflexes','charge',
'roar','grapple','smash',
'charge','endure','hunters eye',
'fury','smash','endure',
'combat reflexes','charge',
'roar','grapple','smash',
'charge','endure','hunters eye',
'fury','smash','endure',
'combat reflexes','charge',
'roar','grapple','smash',
'charge','endure','hunters eye'];

var sample_cards = {
	"fury":{
		"img":just_monika,
		"name":"fury",
		"description":"Terrible stregth with purpose, but not thought",
		"damage":5,
		"defense":-1,
		"cost":2,
		"tags":['menacing','quick','mighty','determined']
	},
	"smash":{
		"img":just_monika,
		"name":"smash",
		"description":"Crude, but effective",
		"damage":3,
		"defense":0,
		"cost":2,
		"tags":['mighty']
	},
	"endure":{
		"img":just_monika,
		"name":"endure",
		"description":"A body like iron, tempered in battle",
		"damage":0,
		"defense":1,
		"cost":0,
		"tags":['mighty','determined']
	},
	"combat reflexes":{
		"img":just_monika,
		"name":"combat reflexes",
		"description":"A mixture of instinct and experience",
		"damage":0,
		"defense":1,
		"cost":0,
		"tags":['quick']
	},
	"charge":{
		"img":just_monika,
		"name":"charge",
		"description":"Flashing forth like lightning; closing the distance",
		"damage":3,
		"defense":0,
		"cost":2,
		"tags":['mighty','quick','menacing']
	},
	"roar":{
		"img":just_monika,
		"name":"war cry",
		"description":"BLOOD! DEATH! AND VENGENCE!!!",
		"damage":0,
		"defense":1,
		"cost":1,
		"tags":['menacing','determined']
	},
	"grapple":{
		"img":just_monika,
		"name":"grapple",
		"description":"Close enough to feel their breath",
		"damage":1,
		"defense":0,
		"cost":4,
		"tags":['mighty','cunning']
	},
	"hunters eye":{
		"img":just_monika,
		"name":"hunter\'s eye",
		"description":"Senses as sharp and the blades they guide",
		"damage":0,
		"defense":0,
		"cost":1,
		"tags":['quick','cunning']
	}
};

var rooms = {
"1": {
	"next":2,
	"message":"\"❤ Hi Player-san ❤\"",
	"img":yuri,
	"background":classroom
},
"2": {
	"next":3,
	"message":"\"❤ I was hoping I'd get a chance to see you here ❤\""
},
"3": {
	"next":4,
	"message":"\"... but ...\""
},
"4": {
	"next":5,
	"message":"\"...\""
},
"5": {
	"next":6,
	"message":"\"The falling stars you wished upon\""
},
"6": {
	"next":7,
	"message":"\"are cinders now, and now they're gone\""
},
"7": {
	"next":8,
	"message":"\"their residue festoons my fetid fields.\"",
	"background":spiderweb
},
"8": {
	"next":9,
	"message":"\"The withered husks of lovers past\""
},
"9": {
	"next":10,
	"message":"\"the shells are all that ever last\""
},
"10": {
	"next":11,
	"message":"\"I've taken everything that they've concealed.\""
},
"11": {
	"next":12,
	"message":"\"...\"",
	"img":yuri2
},
"12": {
	"next":13,
	"message":"\"Who ever told you life was fair?\"",
	"img":yuri3
},
"13": {
	"next":1,
	"message":"Say no to bullying",
	"img":bullying,
	"background":null
},
"journey1": {
	"next":"journey2",
	"message":"With the map you aquired yesterday as a guide, you set off",
	"background":swamp
},
"journey2": {
	"next":"journey3",
	"message":"The southern swaps have never made for a pleasant journey, with flies biting at your ears and neck at every opportunity, and the smell of the marsh in the air"
},
"journey3": {
	"next":"arival1",
	"message":"But no matter, in time..."
},
"arival1": {
	"next":"arival2",
	"message":"...you arive",
	"background":ruins_exterior
},
"arival2": {
	"next":"arival3",
	"message":"The lost city of Leauver"
},
"arival3": {
	"next":"arival4",
	"message":"To the acedemics, this is proof the Outremeri made it this far north"
},
"arival4": {
	"next":"inside1",
	"message":"To you, it is an inviting promise of ancient treasure"
},
"inside1": {
	"next":"inside2",
	"message":"You make your way inside, to find a temple sanctuary chamber still standing after all these years",
	"background":ruins_interior
},
"inside2": {
	"next":"inside3",
	"message":"By the alter you find what you're looking for"
},
"inside3": {
	"next":"trap1",
	"message":"\"This should fetch a good price back in town\", you think to yourself, as you place it in your pack",
	"background":treasure
},
"trap1": {
	"next":"trap2",
	"message":"Just then, the arch supporting the entryway collapses, and rocks begin to tumble down from above",
	"img":trap,
	"background":ruins_interior
},
"trap2": {
	"next":"trap3",
	"message":"Your eyes dart from the rubble in the entrance that blocks your escape, to the newly opened hole in the cieling"
},
"trap3": {
	"next":"trap_skill1",
	"message":"You climb over rocks and fallen marble as quickly as you can before the rest of the roof caves in and crushed you underneath"
},
"trap_skill1": {
	"next":null,
	"message":null,
	"img":null,
	"background":null,
	"script":
		{"id":"do_skill_event","args":
			{"skill_event":
				{"skill_test":
					{"description":"You climb over rocks and fallen marble as quickly as you can before the rest of the roof caves in and crushes you underneath",
					"components":
						[{"tag":"quick","level":"medium"},
						{"tag":"mighty","level":"easy"}]
					},
				"outcomes":
					{0:{"id":"set_room","args":{"room_id":"beat_trap1"}},
					"fail":{"id":"set_room","args":{"room_id":"fail_trap1"}}}
				}
			}
		}
},
"fail_trap1": {
	"next":null,
	"message":"\"Your time has come, child\"",
	"background":death
},
"beat_trap1": {
	"next":"winning1",
	"message":"You scramble out just in time, and decide to head back to town with your new prize",
	"background":ruins_exterior
},
"winning1": {
	"next":"winning2",
	"message":"Somehow the swamp almost seems friendly on your way back, perhaps because you have wealth and triumph on your mind",
	"background":swamp
},
"winning2": {
	"next":"winning3",
	"message":"Ah, there it is: Breinhelm; home sweet home.",
	"background":city
},
"winning3": {
	"next":"winning4",
	"message":"Sure enough, you manage to sell off that Outremeri artifact you found for 250 stones of silver"
},
"winning4": {
	"next":"winning5",
	"message":"You go to the pub to celebrate",
	"background":tavern
},
"winning5": {
	"message":"\"Drinks are on me tonight lads! You can thank the Outremeri\""
}
};

var init_state = x => {
	var state = x.state.data;
	var model = x.data_model.data;
	model.room = rooms;
    state.room = x.get_by_type_and_id("room","journey1");
    state.player = {};
    state.player.deck = sample_deck;
    model.card = sample_cards;
};

export default init_state;