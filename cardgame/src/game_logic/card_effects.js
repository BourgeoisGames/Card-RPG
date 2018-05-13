
/*
Expected args from script being called.
{
	"controller": controller,
	"card": card,
	"hook_args": hook_args,
	"card_args": card_args
}
*/

function true_damage(ctrl, args) {
    var damage = 1;
    if (typeof(args.card_args.damage) === "number") {
        damage = args.card_args.damage;
    }
    args.target.hp -= damage;
}

/**
  *  Should be invoked by "onPlayCard"
  *  Sets the cost equal to the character that played the card's remaining 
  */
function initiaitve_into_attack(ctrl, args) {
	var card = args.card;
	var attacker = args.hook_args.actor
	
	card.cost = attacker.initiative;
	card.attack += attacker.initiative;
}

/**
  *  Should be invoked by "onPlayCard"
  *  Sets the cost equal to the character that played the card's remaining 
  */
function initiaitve_into_defense(ctrl, args) {	
	var card = args.card;
	var attacker = args.hook_args.actor
	
	card.cost = attacker.initiative;
	card.defense += attacker.initiative;
}

/**
  *  alters the target's stats based on the card args passed.
  *  args:
  *    hp (optional, default = 0) - added to actor's HP
  *    initiaitve (optional, default = 0) - added to actor's current initiative
  *    attack (optional, default = 0) - added to target's active card's attack value
  *    defense (optional, default = 0) - added to target's active card's defense value
  */
function buff_target(ctrl, args) {	
	var target = args.hook_args.actor
	var hp = 0;
	var initiative = 0;
	var attack = 0;
	var defense = 0;
	
	if (args.card_args.hp) {
		hp = args.card_args.hp
	}
	if (args.card_args.initiative) {
		initiative = args.card_args.initiative
	}
	if (args.card_args.attack) {
		attack = args.card_args.attack
	}
	if (args.card_args.defense) {
		defense = args.card_args.defense
	}
	target.hp += hp;
	target.initiative += initiative;
	target.active_card.attack += attack;
	target.active_card.defense += defense;
}

/**
  *  alters the actor's stats based on the card args passed.
  *  args:
  *    hp (optional, default = 0) - added to actor's HP
  *    initiaitve (optional, default = 0) - added to actor's current initiative
  *    attack (optional, default = 0) - added to actor's active card's attack value
  *    defense (optional, default = 0) - added to actor's active card's defense value
  */
function buff_actor(ctrl, args) {	
	var attacker = args.hook_args.actor
	var hp = 0;
	var initiative = 0;
	var attack = 0;
	var defense = 0;
	
	if (args.card_args.hp) {
		hp = args.card_args.hp
	}
	if (args.card_args.initiative) {
		initiative = args.card_args.initiative
	}
	if (args.card_args.attack) {
		initiative = args.card_args.attack
	}
	if (args.card_args.defense) {
		initiative = args.card_args.defense
	}
	attacker.hp += hp;
	attacker.initiative += initiative;
	attacker.active_card.attack += attack;
	attacker.active_card.defense += defense;
}

/**
  *   draws number of cards for the attacker equal to the value of "n_cards"
  *   default value of 1 for n_cards if it is undefined
  */
function draw_cards(ctrl, args) {
	var target = args.hook_args.actor;
	var cards_to_draw = args.n_cards;
	if (!cards_to_draw) { 
		// creates default value of 1 for cards_to_draw if it is undefined
		cards_to_draw = 1;
	}
	var data = {"character": target, "n_cards": cards_to_draw}
	ctrl.run_script({"id": "draw_cards", "args": data})
}

/**
  *  takes a list of script references, and executes them in the order of the list
  *  the "hook_args" which are passed to this script will be added to the args of all the script_refs 
  *    it uses before it 
  */
function multi_script(ctrl, args) {
	var scripts = args.script_refs;
	var hook_args = {}; // TODO - get this
	// regular for loop for garanteed execution order
	for (var i = 0; i < scripts.length; i++) {
		// creates new script ref that has the "hook_args" from this script call.
		var new_ref = {"id": scripts[i].id}
		new_ref.args = concat_args(scripts[i].args, hook_args)
		ctrl.run_script(new_ref);
	}
}

// Not Exported. Concatinates two objects and returns the result.
function concat_args(obj1, obj2) {
	var new_obj = {}
	for (var field in obj1) {
		new_obj[field] = obj1[field]
	}
	for (var field in obj2) {
		new_obj[field] = obj2[field]
	}
	return new_obj;
}

function sideline_active(ctrl, args) {
	
	ctrl.run_script({"id": "sideline_cards_script", {"actor": args.hook_args.actor}})
}

var scripts = {
	"initiaitve_into_attack": initiaitve_into_attack,
	"initiaitve_into_defense": initiaitve_into_defense,
	"buff_target": buff_target,
	"buff_actor": buff_actor,
	"true_damage": true_damage,
	"draw_cards": draw_cards,
	"multi_script": multi_script
}


export default gc => gc.add_scripts(scripts);