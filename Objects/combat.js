
/**
 * take_turn_script: sid: "take_turn"
 * args: {
 *   "action_list": [action]
 * }
 */
function take_turn_script(controller, data) {
    var encounter = getEncounter(controller.state);
    var action_list = data.call_data.action_list;
    take_turn(controller, encounter, action_list);
}

// assumes that 
function take_turn(controller, encounter, action_list) {
    for (var i = 0; i < action_list.length; i++) {
        var action = action_list[i];
        take_action(controller, encounter, action);
    }
    
    for (var i = 0; i < action_list.length; i++) {
        var action = action_list[i];
        resolve_card(controller, encounter, action);
    }
}

function start_combat_script(controller, data) {
    var enemy_ids = data.call_data.enemy_ids;
    start_combat(controller, enemy_ids);
}

function start_combat(controller, enemy_ids) {
    var encounter = {
        "type": "combat",
        "combatants": [controller.state.data.player],
        "history": []
    }
    for (var i = 0; i < ids.length; i++) {
        var new_character = controller.get_by_type_and_id("character", ids[i]);
        encounter.combatants.push(new_character);
    } 
    controller.state.data.encounter = encounter;
}

function end_combat(controller) {
    delete controller.state.data.encounter;
}

// data = {"call_data": {"attacker": character, "action": action}}
// action: {"actor": character, "target": character, "type": string, "value": object | int}
function take_action_script(controller, data) {
    var encounter = getEncounter(controller.state);
    var action = data.call_data.action;
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
    var encounter = getEncounter(controller.state);
	start_new_round(controller, encounter);
}
function start_new_round(controller, encounter) {
	for (var i = 0; i < encounter.combatants.length; i++) {
		var combatant = encounter.combatants[i];
		// Draw up to hand size
		var card_draw = combatant.hand_size - combatant.hand.length;
		draw_cards(controller, combatant, card_draw);
		// reset initiative
		combatant.initiatve = combatant.base_initiative;
	}
}

function is_round_over_script(controller, data) {
    var encounter = getEncounter(controller.state);
	return is_round_over(controller, encounter);
}
function is_round_over(controller, encounter) {
	for (var i = 0; i < encounter.combatants.length; i++) {
		var character = encounter.combatants[i]
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
		var cost = character.hand[i].card_cost;
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
    console.log("execute_card_effect - card:");
    console.log(card);
    if (typeof(card) === "undefined") { return; }
    if (typeof(card.card_effects) === "undefined") { return; }
	var script_ref = card.card_effects[effect_id];
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
    controller.execute_script(script_id, script_args);
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
	controller.execute_script(script_id, script_args)
}

function resolve_statuses(hook_id, controller, character) {
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
    console.log("play_card - card:");
    console.log(card);
	var hook_args = {"actor": attacker, "target": target}
	resolve_statuses("status_onPlayCard", controller, attacker);
    execute_card_effect("onPlayCard", controller, card, hook_args);
    
    // execute "card.play_card 
    encounter.history.push({"character": attacker, "card": card});
	hook_args.card_replaced_with = card;
	resolve_statuses("status_onRemovedFromActive", controller, attacker);
    execute_card_effect("onRemovedFromActive", controller, attacker.active_card, hook_args);
    attacker.previousCard = attacker.active_card;
    attacker.active_card = card;
    attacker.initiative -= card.card_cost;
    remove_card_from_hand(controller, attacker, card_index)
}

function draw_cards(controller, character, numb_cards) {
	for (var i = 0; i < numb_cards; i++) {
		draw_one_card(controller, character);
	}
}

function draw_one_card(controller, character) {
    var card_id = character.deck.pop()
    var new_card = controller.get_by_type_and_id("card", card_id);
    character.hand.push(new_card);
	var hook_args = {"actor": character}
    resolve_statuses("status_onDrawCard", controller, attacker);
    execute_card_effect("onDrawn", controller, new_card, hook_args);
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

function remove_card_from_hand(controller, character, index) {
    var card = character.hand[index];
    console.log("remove_card_from_hand: card; " + card);
    character.hand.splice(index, 1);
    console.log(character);
	var hook_args = {"actor": character}
	resolve_statuses("status_onRemovedFromHand", controller, character);
    execute_card_effect("onRemovedFromHand", controller, card, hook_args);
    
    character.discard.push(card.card_id);
	resolve_statuses("status_onDiscarded", controller, character);
    execute_card_effect("onDiscarded", controller, card, hook_args);
}
function add_card_to_discard(controller, character, card_id) {
    // NOTE: does not invoke "onDiscarded" scripts, this should be invoked
    // after this function is called. Since this function does not take a card 
    // (which is required for invoking the card effect)
    console.log("combar.js - add_card_to_discard");
    console.log(character.discard);
}
    
function resolve_card_script(controller, data) { 
    var encounter = getEncounter(controller.state);
    var attacker = encounter[data.call_data.attacker];
    var defender = encounter[data.call_data.defender];
    resolve_card(controller, encounter, attacker, defender);
}
function resolve_card(controller, encounter, action) {
    // execute card.resolve_card
    var defense_stat = 0;
    var attacker = action.actor;
    var defender = action.target;    
    if (isCard(defender.active_card)) {
        defense_stat = defender.active_card.card_defense;
    }
    var damage = attacker.active_card.card_attack - defense_stat;
    if (damage < 0) {
        damage = 0;
    }
    defender.hp -= damage;
	var hook_args = {"actor": attacker, "target": defender, "encounter": encounter}
	resolve_statuses("status_onCardResolved", controller, attacker);
    execute_card_effect("onCardResolved", controller, attacker.active_card, hook_args);
    resolve_statuses("status_onCardResolvedAgainst", controller, defender);
    execute_card_effect("onCardResolvedAgainst", controller, defender.active_card, hook_args);
    if (isCard(defender.active_card)) {
        resolve_statuses("status_onAttacked", controller, defender);
        execute_card_effect("onAttacked", controller, defender.active_card, hook_args);
        if (damage > 0) {
            resolve_statuses("status_onDealsDamage", controller, attacker);
            execute_card_effect("onDealsDamage", controller, attacker.active_card, hook_args);
            resolve_statuses("status_onDamaged", controller, defender);
            execute_card_effect("onDamaged", controller, defender.active_card, hook_args);
        } else if (attacker.active_card.card_attack != 0) {
            resolve_statuses("status_onAttackBlocked", controller, attacker);
            execute_card_effect("onAttackBlocked", controller, attacker.active_card, hook_args);
            resolve_statuses("status_onBlocksAttack", controller, defender);
            execute_card_effect("onBlocksAttack", controller, defender.active_card, hook_args);
        }
    } else {
        if (damage > 0) {
            resolve_statuses("status_onDealsDamage", controller, attacker);
            execute_card_effect("onDealsDamage", controller, attacker.active_card, hook_args);
        } else if (attacker.active_card.card_attack != 0) {
            resolve_statuses("status_onAttackBlocked", controller, attacker);
            execute_card_effect("onAttackBlocked", controller, attacker.active_card, hook_args);
        }
    }
}

function is_character(obj) {
	return false;
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

exports = gameScrips;