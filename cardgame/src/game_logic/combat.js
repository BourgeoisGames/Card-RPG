
var GET_ACTION_TRIGGER_ID = "get_action_";
var GET_ACTION_SIGNAL_ID = "get_action_signal_";

/**
 * take_turn_script: sid: "take_turn"
 * args: {
 *   "action_list": [action]
 * }
 */
function take_turn_script(controller, data) {
    var encounter = get_encounter_from_game_state(controller.state);
    take_turn(controller, encounter, action_list);
}

// takes controller.state and returns the current encounter
function get_encounter_from_game_state(game_state) {
    return game_state.data.encounter;
}

function get_player_character_from_game_state(game_state) {
    return game_state.data.player_character;
}

// assumes that 
function take_turn(controller, encounter, action_list) {
	var action_list = encounter.readied_actions;
    for (var i = 0; i < action_list.length; i++) {
        var action = action_list[i];
        take_action(controller, encounter, action);
    }
    
    for (var i = 0; i < action_list.length; i++) {
        var action = action_list[i];
        resolve_card(controller, encounter, action);
    }
	start_new_turn(controller, encounter);
}

function is_round_over(controller, encounter) {
	for (var i = 0; i < encounter.characters.length; i++) {
		if (character_can_act(encounter.characters[i])) {
			return false;
		}
	}
	return true;
}

function default_is_combat_over(controller, encounter) {
	if (encoutner.characters[0].hp === 0) {
		return true;
	}
	for (var i = 0; i < encounter.characters.length; i++) {
		
	}
	
	return false;
}

/*
function instantiate_default_encounter() {
	// DEPRICATED -- do not use
	var encounter = {
        "type": "combat",
        "combatants": [controller.state.data.player],
		"is_combat_over": default_is_combat_over,
        "history": []
    }
	controller.state.data.player.id = 0;
    for (var i = 0; i < enemy_ids.length; i++) {
        var new_character = controller.get_by_type_and_id("character", enemy_ids[i]);
		// i+1 because player is at index 0 always
		new_character.id = i+1;
        encounter.characters.push(new_character);
    } 
    controller.state.data.encounter = encounter;	
}

function unpack_encounter(controller, character_ids) {
	var characters = []
	character_ids.forEach((char_id) => {
		var new_char = controller.get_by_type_and_id("character", char_id)
		characters.push(characters);
	});
	return encounter;
*/

function start_combat_script(controller, data) {
    var encounter = data.encounter;
    start_combat(controller, encounter);
}

function start_combat(controller, encouter) {
	controller.state.data.encounter = encounter;
	start_new_round(controller, encounter)
	start_new_turn(controller, encounter)
}

// clean up combat
function end_combat(controller, encounter, resolution) {
	// call a script to do stuff based on how the combat was resolved
	var outcome = encounter.outcomes[resolution];
	controller.run_script(outcome, {})

	// delete the now unused encounter from the gamestate
    delete controller.state.data.encounter;
}

// data = {"call_data": {"attacker": character, "action": action}}
// action: {"actor": character, "target": character, "type": string, "value": object | int}
function take_action_script(controller, data) {
    var encounter = get_encounter_from_game_state(controller.state);
    var action = data.action;
    take_action(controller, encounter, action);
}
function take_action(controller, encounter, action) {
    var attacker = action.actor;
	var defender = action.target;
    console.log("take action: type = " + action.type);
    if(action.type === "card") {
        play_card(controller, attacker, defender, encounter, action.value);
    } else if (action.type === "delay") {
        delay_turn(controller, attacker, encounter, action.value);
    } else if (action.type === "ability") {
        use_ability(controller, attacker, encounter, action.value);
    } else {
        console.log("take_action() argument action.value was not a valid type!");
    }
}

function start_new_round_script(controller, data) {
    var encounter = get_encounter_from_game_state(controller.state);
	start_new_round(controller, encounter);
	
}

// all combatants draw up to hand limits, reset initiative values to their base initiatives, 
// and resolve effects that happen every turn.
function start_new_round(controller, encounter) {
	console.log("encounter.characters");
	console.log(encounter.characters);
	
	// script_ref "state_setter" will set the value of 
	// "current_resolution" in the current encounter
	controller.run_script(encounter.state_setter, {})
	var combat_state = encounter.current_state;
	// TODO eventually combat will have states and end states, and will only exit on an endstate, rather than any state other than "unresolved"
	if (combat_state != "unresolved") {
		end_combat(controller, encounter, combat_state)
	}
	
	for (var i = 0; i < encounter.characters.length; i++) {
		var combatant = encounter.characters[i];
		// Draw up to hand size
		var card_draw = combatant.hand_size - combatant.hand.length;
		draw_cards(controller, combatant, card_draw);
		// reset initiative
		combatant.initiatve = combatant.base_initiative;
		decriment_status_effects(combatant);
		
		resolve_statuses("status_onStartRound", controller, combatant);
		execute_card_effect("onStartRound", controller, combatant.active_card, {});
	}
}

function start_new_turn_script(controller, data) {
	var encouter = get_encounter_from_game_state(controller.state);
	start_new_turn(controller, encounter);
}

function start_new_turn(controller, encounter) {
	encounter.readied_actions = []
	encounter.current_actors = get_current_actors(encounter);
	encounter.current_actors.forEach((char_index) => {
		get_action(controller, encounter, char_index)
	});
	if (is_round_over(controller, encounter)) {
		start_new_round(controller, encounter);
	}
}

// returns a list of all characters in the given encounter which will act on the coming turn.
function get_current_actors(encounter) {
	var current_actors = [];
	var init = -1; // initiaitve of the current actor(s)
	for (var i = 0; i < encounter.characters.length; i++) {
		if (can_character_act(encounter.characters[i])) {
			// if tied for most initiative, add to list of actors
			if (encounter.characters[i].initiative == init) {
				current_actors.push(i);
			}
			// if character's init is > current actor(s), remove current actor(s) and start a new list.
			else if (encounter.characters[i].initiative > init) {
				current_actors = [i];
				init = encounter.characters[i].initiative;
			}
		}
	}
	return current_actors;
}

function can_character_act(character) {
	if (character.initiative == 0) { return false; }
	if (character.hand.length == 0) { return false; }
	var min_cost = Number.MAX_SAFE_INTEGER;
	for (var i = 0; i < character.hand.length; i++) {
		var card = character.hand[i];
		if (card.cost <= min_cost) {
			min_cost = card.cost;
		}
	}
	return min_cost <= character.initiative;
}

// get player input

function get_action_script(controller, data) {
	// DEPRICATED - we probably do not need to export/expose this functions
	var char_index = data.char_index;
	var encounter = get_encounter_from_game_state(controller.state);
	get_action(controller, encounter, char_index);
}

function get_action(controller, encounter, char_index) {
	
	var trigger_args = {"actor_id": char_index}
	// add a trigger to call after and action is selected.
	controller.add_trigger({
		"trigger_id": GET_ACTION_TRIGGER_ID + char_index,
		"signal_id": GET_ACTION_SIGNAL_ID + char_index,
		// should call - resolve_actions(controller, data)
		// TODO set sid and args
		"script_reference": {"id": RESOLVE_ACTIONS, "args": trigger_args}
	});
	var character = encounter.characters[char_index];
	// unless undefined, call the method to cause the character to select an action.
	if (character.on_get_action) {
		controller.run_script(character.on_get_action);
	}
}

// data = {"actor_id": int, "action": action}
function set_action_script(controller, data) {
	var encounter = get_encounter_from_game_state(controller.state);
	var action = data.action;
	var actor_id = data.actor_id;
	set_action(controller, encounter, action, actor_id)
}

// sets the action used by the character at the given index (actor_id) in the given encounter
function set_action(controller, encounter, action, actor_id){
	controller.remove_trigger(GET_ACTION_TRIGGER_ID + actor_id);
	encounter.readied_actions[actor_id] = action;
	resolve_actions(controller, encounter);
}

function resolve_actions_script(ctrl, data) {
	var encounter = get_encounter_from_game_state(data.state);
	resolve_actions(ctrl, encounter)
}

function resolve_actions(controller, encounter) {
	var actions_ready = are_all_actions_ready(encounter); 
	if(! actions_ready) {
		return;
	}
	take_turn(controller, encounter, encounter.readied_actions);	
}

// takes an encounter, and returns a boolean if all the actors for the current turn have selected their actions.
function are_all_actions_ready(encounter) {
	for (var i = 0; i < encounter.readied_actions.length; i++) {
		var action = encounter.readied_actions[i];
		// if any action = undefined, return false.
		if (! action) {
			return false;
		}
	}
	return true;
}

function decriment_status_effects(character) {
	console.log("character.status_effects:\n" + character.status_effects);
	if (typeof(character.status_effects) === "undefined") { return; }
	for (var j = 0; j < character.status_effects.length; j++) {
		var effect = character.status_effects[j];
		if (effect.duration > 0) {
			effect.duration -= 1;
		}
		if (effect.duration === 0) {
			character.status_effects.splice(j, 1);
		}
	}
}

function is_round_over_script(controller, data) {
    var encounter = get_encounter_from_game_state(controller.state);
	return is_round_over(controller, encounter);
}
function is_round_over(controller, encounter) {
	for (var i = 0; i < encounter.characters.length; i++) {
		var character = encounter.characters[i]
		if (character_can_act(character)) { return true; }
	}
	return false;
}

function character_can_act(character) {
	if (character.hand.length <= 0 || character.initiative <= 0) {
		return false;
	}
	var min_cost = Number.MAX_SAFE_INTEGER;
	for (var i = 0; i < character.hand.length; i++) {
		var cost = character.hand[i].cost;
		min_cost = min(min_cost, cost);
	}
	return character.initiative > cost;
}
    
function use_ability(controller, attacker, encounter, index) {
    // TODO
}

function delay_turn(controller, attacker, encounter, amountDelayed) {
    // TODO
}

function get_card_effect_args(effect_id, card) {
    console.log("get_card_effect_args - card:");
    console.log("DEPRICATED!");
    console.log(card);
    if (null === card || undefined === card) { return []; }
    if ("undefined" === typeof(card.effect_args)) { return []; }
    if ("undefined" === typeof(card.effect_args[effect_id])) { return []; }
    var args = card.effect_args[effect_id];
    console.log(args);
    return args;
}

function execute_card_effect(effect_id, controller, card, hook_args) {
    console.log("execute_card_effect('" + effect_id + "') - card:");
    console.log(card);
    if (typeof(card) === "undefined") { return; }
    if (typeof(card.effects) === "undefined") { return; }
	var script_ref = card.effects[effect_id];
	if (typeof(script_ref) === "undefined") { return; }
    //var cardArgs = get_card_effect_args(effect_id, card);
    var script_id = script_ref[0]
	var card_args = script_ref[1]
    var script_args = {
        "controller": controller,
        "card": card,
        "hook_args": hook_args,
        "card_args": card_args
    }; //*/
    controller.run_script({"id": script_id, "args": script_args});
}

// {
//  "name": string,
//  "description": string,
//  "hidden": bool,
//  "duration": int,
//  "hooks": {
//    String hook: [
//	  String scriptId,
//	  Array args
//	]
//  }

function execute_one_status(hook_id, controller, effect, character) {
	console.log(character.name + " effect: " + hook_id);
	var script_info = effect.hooks[hook_id];
	if (typeof(script_info) === "undefined") { return; }
	var script_id = script_info[0];
	var script_args = script_info[1];
	// add 
	script_args.character = character;
	controller.run_script({"id": script_id, "args": script_args})
}

function resolve_statuses(hook_id, controller, character) {
	console.log("resolve statuses('"  + hook_id + "');");
	if (typeof(character.status_effects) === "undefined") {
		console.log("character " + character.name + " has no status effects");
		return;
	}
	for (var i = 0; i < character.status_effects.length; i++) {
		var effect = character.status_effects[i];
		execute_one_status(hook_id, controller, effect, character);
	}
	
}

function play_card(controller, attacker, target, encounter, card_index) {
    var card = attacker.hand[card_index];
	if (card.cost > attacker.initiaitve)
		throw {"msg": "not enough initiative to play the selected card"}
    console.log("play_card - card:");
    console.log(card);
	var hook_args = {"actor": attacker, "target": target}
//	resolve_statuses("status_onPlayCard", controller, attacker);
//    execute_card_effect("onPlayCard", controller, card, hook_args);
	activate_card_hook("onPlayCard", controller, character, card, hook_args);
    
	attacker.initiative -= card.cost;
	encounter.history.push({"character": attacker, "card": card});
	// if card does not become active, it is immediately discarded.
	if (card.becomes_active || typeof(card.becomes_active)==="undefined") {
		hook_args.card_replaced_with = card;
//		resolve_statuses("status_onRemovedFromActive", controller, attacker);
//		execute_card_effect("onRemovedFromActive", controller, attacker.active_card, hook_args);
		activate_card_hook("onRemovedFromActive", controller, character, card, hook_args);
		
		add_card_to_discard(controller, attacker, attacker.active_card);
		attacker.previousCard = attacker.active_card;
		attacker.active_card = card;
		remove_card_from_hand(controller, attacker, card_index);
	} else {
		discard_card_from_hand(controller, attacker, card_index);
	}
}

function draw_cards_script(controller, data) {
	var character = data.character;
	var numb_cards = data.n_cards;
	draw_cards(controller, character, numb_cards)
}

function draw_cards(controller, character, numb_cards) {
	for (var i = 0; i < numb_cards; i++) {
		draw_one_card(controller, character);
	}
}

function draw_one_card(controller, character) {
    var card_id = character.deck.pop()
    var new_card = controller.get_by_type_and_id("card", card_id);
	new_card.card_id = card_id;
    character.hand.push(new_card);
	var hook_args = {"actor": character};
//    resolve_statuses("status_onDrawCard", controller, character);
//    execute_card_effect("onDrawn", controller, new_card, hook_args);
	activate_card_hook("onDrawn", controller, character, card, hook_args);
}

function shuffle_deck(controller, character) {
    var new_deck = [];
    while(character.deck.length > 0) {
        var len = character.deck.length;
        var i = Math.floor(Math.random() * len);
        new_deck[new_deck.length] = character.deck[i]
        character.deck.splice(i, 1);
    }
    character.deck = new_deck;
}

function pop_card_from_hand(controller, character, index) {
	var card_removed = character.hand[index];
    console.log("remove_card_from_hand: card; " + card);
    character.hand.splice(index, 1);
    console.log(character);
	
	var hook_args = {"actor": character}
//	resolve_statuses("status_onRemovedFromHand", controller, character);
//    execute_card_effect("onRemovedFromHand", controller, card, hook_args);
	activate_card_hook("onRemovedFromHand", controller, character, card, hook_args);
	
	return card_removed;
}

function discard_card_from_hand(controller, character, index) {
	var card = pop_card_from_hand(controller, character, index);
    console.log("remove_card_from_hand: card; " + card);
	add_card_to_discard(controller, character, card);
}

function add_card_to_discard(controller, character, card) {
    
    character.discard.push(card.card_id);
	var hook_args = {"actor": character}
//	resolve_statuses("status_onDiscarded", controller, character);
//    execute_card_effect("onDiscarded", controller, card, hook_args);
//	resolve_statuses("status_removedFromPlay", controller, character);
//    execute_card_effect("removedFromPlay", controller, card, hook_args);
	activate_card_hook("onDiscarded", controller, character, card, hook_args);
	activate_card_hook("removedFromPlay", controller, character, card, hook_args);
	
    console.log("combar.js - add_card_to_discard");
    console.log(character.discard);
}

function activate_card_hook(key, controller, character, card, hook_args) {
	// TODO - call trigger 
    execute_card_effect(key, controller, card, hook_args);
	resolve_statuses(key, controller, character);
}
    
function resolve_card_script(controller, data) { 
    var encounter = get_encounter_from_game_state(controller.state);
    var attacker = encounter[data.attacker];
    var defender = encounter[data.defender];
    resolve_card(controller, encounter, attacker, defender);
}
function resolve_card(controller, encounter, action) {
    // execute card.resolve_card
    var defense_stat = 0;
    var attacker = action.actor;
    var defender = action.target;    
    if (isCard(defender.active_card)) {
        defense_stat = defender.active_card.defense;
    }
    var damage = attacker.active_card.attack - defense_stat;
    if (damage < 0) {
        damage = 0;
    }
    defender.hp -= damage;
	var hook_args = {"actor": attacker, "target": defender}
//	resolve_statuses("status_onCardResolved", controller, attacker);
//    execute_card_effect("onCardResolved", controller, attacker.active_card, hook_args);
	activate_card_hook("onCardResolved", controller, character, card, hook_args);
//    resolve_statuses("status_onCardResolvedAgainst", controller, defender);
//    execute_card_effect("onCardResolvedAgainst", controller, defender.active_card, hook_args);
	activate_card_hook("onCardResolvedAgainst", controller, character, card, hook_args);
    if (isCard(defender.active_card)) {
//        resolve_statuses("status_onAttacked", controller, defender);
//        execute_card_effect("onAttacked", controller, defender.active_card, hook_args);
		activate_card_hook("onAttacked", controller, character, card, hook_args);
        if (damage > 0) {
//            resolve_statuses("status_onDealsDamage", controller, attacker);
//            execute_card_effect("onDealsDamage", controller, attacker.active_card, hook_args);
			activate_card_hook("onDealsDamage", controller, character, card, hook_args);
//            resolve_statuses("status_onDamaged", controller, defender);
//            execute_card_effect("onDamaged", controller, defender.active_card, hook_args);
			activate_card_hook("onDamaged", controller, character, card, hook_args);
        } else if (attacker.active_card.attack != 0) {
//            resolve_statuses("status_onAttackBlocked", controller, attacker);
//            execute_card_effect("onAttackBlocked", controller, attacker.active_card, hook_args);
			activate_card_hook("onAttackBlocked", controller, character, card, hook_args);
//            resolve_statuses("status_onBlocksAttack", controller, defender);
//            execute_card_effect("onBlocksAttack", controller, defender.active_card, hook_args);
			activate_card_hook("onBlocksAttack", controller, character, card, hook_args);
        }
    } else {
        if (damage > 0) {
            //resolve_statuses("status_onDealsDamage", controller, attacker);
            //execute_card_effect("onDealsDamage", controller, attacker.active_card, hook_args);
			activate_card_hook("onDealsDamage", controller, character, card, hook_args);
        } else if (attacker.active_card.attack != 0) {
            //resolve_statuses("status_onAttackBlocked", controller, attacker);
            //execute_card_effect("onAttackBlocked", controller, attacker.active_card, hook_args);
			activate_card_hook("onAttackBlocked", controller, character, card, hook_args);
        }
    }
}

function sideline_cards_script(ctrl, data) {
	var cards = data.cards;
	var character = data.character;
	sideline_cards(ctrl, cards, character)
}

// takse an array of cards, and a character.
// adds the cards to the BOTTOM of the deck of the character, with the last 
// list elements must be card objects.
function sideline_cards(ctrl, cards, character) {
	var card_ids = []
	// TODO - make sure the order of opperations is correct here, and document exactly how is should work.
	for (var i = 0; i < cards.length; i++) {
		if (typeof(cards[i]) === "object") {
			card_ids[i] = cards[i].card_id
			//resolve_statuses("status_onSidelined", controller, character);
			//execute_card_effect("onSidelined", controller, card, hook_args);
			activate_card_hook("onSidelined", controller, character, card, hook_args);
			//resolve_statuses("status_removedFromPlay", controller, character);
			//execute_card_effect("removedFromPlay", controller, card, hook_args);
			activate_card_hook("removedFromPlay", controller, character, card, hook_args);
		}
	}
	console.log("sideline cards (before/after):");
	console.log(character.deck);
	character.deck = card_ids.concat(character.deck);
	console.log(character.deck);
}




var gameScrips = [
    {"game_script_id": "take_action", "script": take_action_script},
//    {"game_script_id": "play_card", "script": play_card},
    {"game_script_id": "resolve_card", "script": resolve_card_script}
];

var gameEvent = [
    {"event_id": "take_action", "game_scripts": [take_action], "data": {}},
    {"event_id": "", "game_scripts": [], "data": {}}
];

var RESOLVE_ACTIONS = "resolve_actions";


var scripts = {
	// 
	"take_turn_script": take_turn_script,
	
	//
	"start_combat_script": start_combat_script,
	
	//
	"take_action_script": take_action_script,
	
	//
	"start_new_round_script": start_new_round_script,
	
	// takes 0 args, and returns a bool of whether the round is over. 
	"is_round_over_script": is_round_over_script,
	
	// takes data.attacker and *.*.defender, and resolves the 
	// attacker's active card against the defenders active card
	"resolve_card_script": resolve_card_script,
	
	// takes no arge
	RESOLVE_ACTIONS: resolve_actions_script,
	// takes "cards" (list of cards to be sidelined) and "character." Adds cards to bottom of character's deck.
	// "cards" may contain cardId's or card objects (which will be converted to cardId's)
	"sideline_cards_script": sideline_cards_script
};

export default gc => gc.add_scripts(scripts);