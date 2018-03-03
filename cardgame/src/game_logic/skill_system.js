var copy = x => JSON.parse(JSON.stringify(x));
function shuffle(array_in) {
	var array = copy(array_in);
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
};
function remove_value(arr,value) {
	var index = arr.indexOf(value);
	if (index >= 0) {
  		arr.splice( index, 1 );
	}
}
var pick = x => x[Math.floor(Math.random()*x.length)];

/*var sample_deck = ['fury','smash','endure',
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
		"name":"fury",
		"description":"Terrible stregth with purpose, but not thought",
		"damage":5,
		"defense":-1,
		"cost":2,
		"tags":['menacing','quick','mighty','determined']
	},
	"smash":{
		"name":"smash",
		"description":"Crude, but effective",
		"damage":3,
		"defense":0,
		"cost":2,
		"tags":['mighty']
	},
	"endure":{
		"name":"endure",
		"description":"A body like iron, tempered in battle",
		"damage":0,
		"defense":1,
		"cost":0,
		"tags":['mighty','determined']
	},
	"combat reflexes":{
		"name":"combat reflexes",
		"description":"A mixture of instinct and experience",
		"damage":0,
		"defense":1,
		"cost":0,
		"tags":['quick']
	},
	"charge":{
		"name":"charge",
		"description":"Flashing forth like lightning; closing the distance",
		"damage":3,
		"defense":0,
		"cost":2,
		"tags":['mighty','quick','menacing']
	},
	"war cry":{
		"name":"war cry",
		"description":"BLOOD! DEATH! AND VENGENCE!!!",
		"damage":0,
		"defense":1,
		"cost":1,
		"tags":['menacing','determined']
	},
	"grapple":{
		"name":"grapple",
		"description":"Close enough to feel their breath",
		"damage":1,
		"defense":0,
		"cost":4,
		"tags":['mighty','cunning']
	},
	"hunters eye":{
		"name":"hunter\'s eye",
		"description":"Senses as sharp and the blades they guide",
		"damage":0,
		"defense":0,
		"cost":1,
		"tags":['quick','cunning']
	}
};*/

var skill_test_levels = {
	"easy":{
		"name":"normal",
		"description":"It will take effort, but no great skill",
		"distribution":[0,1,1,2],
		"num_cards_to_draw":4
	},
	"medium":{
		"name":"expert",
		"description":"A chance to demonstrate your expertise",
		"distribution":[1,2,2,3],
		"num_cards_to_draw":5
	},
	"hard":{
		"name":"masterful",
		"description":"A daunting barrier in your path, or a story to tell when you're done",
		"distribution":[2,3,4,4],
		"num_cards_to_draw":6
	},
	"random":{
		"name":"unknown",
		"description":"Feeling lucky?",
		"distribution":[0,1,2,3,4],
		"num_cards_to_draw":6
	}
};

/*var sample_skill_test = {
	"description":"You climb as fast as you can to escape",
	"components":[
	{"tag":"quick","level":"medium"},
	{"tag":"mighty","level":"easy"}
	]
};*/

var get_card = (gc,cid) => gc.get_by_type_and_id('card',cid);//copy(sample_cards[cid]);

var get_deck = gc => copy(gc.state.data.player.deck);

var get_skill_test_level = lid => copy(skill_test_levels[lid]);

var draw_skill_test_hand = function(gc,skill_test){
	var deck = get_deck(gc);
	var shuffled = shuffle(deck);
	var components = copy(skill_test.components);
	var counts = {}
	components.forEach(e => {
		counts[e.tag] = get_skill_test_level(e.level).num_cards_to_draw;
	});
	var hand = [];
	shuffled.forEach(cid => {
		var card = get_card(gc,cid);
		var tag = null;
		card.tags.forEach(e => {
			if (counts[e]) {
				tag = e;
			}
		});
		if (tag) {
			counts[tag] -= 1;
			hand.push(cid);
		}
	});
	return hand;
};

var generate_skill_test_dcs = function(skill_test){
	var components = copy(skill_test.components);
	var dcs = {}
	components.forEach(e => {
		dcs[e.tag] = pick(get_skill_test_level(e.level).distribution);
	});
	return dcs;
};

var get_score_result = function(dcs,scores){
	var result = 0;
	var leftover = 0;
	Object.keys(dcs).forEach(e => {
		var score = scores[e];
		if(!score) score = 0;
		var dc = dcs[e];
		if (score <= dc) {
			result += (score - dc);
		}
		else{
			leftover += (score - dc);
		}
	});
	result += Math.floor(leftover/2);
	return result;
};

var get_scores = function(gc,cids){
	var scores = {};
	cids.forEach(cid => {
		var card = get_card(gc,cid);
		card.tags.forEach(tag => {
			if (scores[tag]) {
				scores[tag] += 1;
			}
			else{
				scores[tag] = 1;
			}
		});
	});
	return scores;
};

var get_skill_test_result = function(gc,cids,skill_test){
	var scores = get_scores(gc,cids);
	var dcs = generate_skill_test_dcs(skill_test);
	var result = get_score_result(dcs,scores);
	//console.log("--------")
	//console.log(scores)
	//console.log(dcs)
	//console.log(result)
	//console.log("--------")
	return result;
};

var sample_skill_event = {
	"skill_test":{},
	"outcomes":{
		1:{"id":"newroom","args":{}}
	}
}

var resolve_skill_test = function(gc,args){
	var cids = args.trigger_args.cards;
	var skill_event = gc.state.data.skill_event;
	var skill_test = skill_event.skill_test;
	var outcomes = skill_event.outcomes;
	var result = get_skill_test_result(gc,cids,skill_test);
	
	var outcome = -10000;
	Object.keys(outcomes).forEach(key => {
		var val = parseInt(key);
		//alert(val)
		//alert(result >= val && !isNaN(val))
		if ((!isNaN(val)) && (result >= val) && (val >= outcome)) {
			//alert("kkaad");
			outcome = val;
		}
	});
	//alert(outcome)
	if (!(outcome > -10000)) {
		outcome = "fail";
	}
	var ref = outcomes[outcome];
	//alert(JSON.stringify(ref))
	gc.remove_trigger("played_cards_to_resolve_skill_event");
	gc.state.data.skill_event = undefined;
	gc.run_script(ref,{});
};

var do_skill_event = function(gc,args){
	var skill_event = args.skill_event;
	gc.state.data.skill_event = skill_event;
	gc.state.data.player.hand = draw_skill_test_hand(gc,skill_event.skill_test);
	gc.add_trigger({
		"trigger_id":"played_cards_to_resolve_skill_event",
		"signal_id":"played_cards", 
		"script_reference":{"id":"resolve_skill_test","args":{}}
	});
}

//console.log(draw_skill_test_hand(sample_deck,sample_skill_test));
//var sample_dcs = generate_skill_test_dcs(sample_skill_test);
//var sample_scores = {"mighty":4,"quick":0};
//console.log(sample_dcs);
//console.log(get_score_result(sample_dcs,sample_scores));
//console.log(get_scores(['charge','charge']));
//console.log(get_skill_test_result(['charge','charge'],sample_skill_test))

var scripts = {
	"do_skill_event":do_skill_event,
	"resolve_skill_test":resolve_skill_test
};

export default gc => gc.add_scripts(scripts);