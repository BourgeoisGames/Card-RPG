


// data = {"call_data": {"attacker": character, "action": action}}
function takeActionScript(controller, data) {
    var encounter = getEncounter(controller.state);
    var attacker = encounter[data.call_data.attacker];
    var action = data.call_data.action;
    takeAction(controller, encounter, attacker, action);
}
function takeAction(controller, encounter, attacker, action) {
    if(action.type === "card") {
        playCard(controller, attacker, encounter, action.value);
    } else if (action.type === "delay") {
        delayTurn(controller, attacker, encounter, action.value);
    } else if (action.type === "action") {
        useAction(controller, attacker, encounter, action.value);
    } else {
        console.log("takeAction() argument action.value was not a valid type!");
    }
}
    
function useAction(controller, attacker, encounter, index) {
    // TODO
}

function delayTurn(controller, attacker, encounter, amountDelayed) {
    // TODO
}

function getCardEffectArgs(effect_id, card) {
    console.log("getCardEffectArgs - card:");
    console.log(card);
    if (null === card || undefined === card) { return []; }
    if ("undefined" === typeof(card.effect_args)) { return []; }
    if ("undefined" === typeof(card.effect_args[effect_id])) { return []; }
    var args = card.effect_args[effect_id];
    console.log(args);
    return args;
}

function executeCardEffect(effect_id, controller, card, otherCard) {
    console.log("executeCardEffect - card:");
    console.log(card);
    if (typeof(card) === "undefined") { return; }
    if (typeof(card.card_effects) === "undefined") { return; }
    var cardArgs = getCardEffectArgs(effect_id, card);
    var script_id = card.card_effects[effect_id]
    var script_args = {
        "controller": controller,
        "card": card,
        "target": otherCard,
        "card_args": cardArgs
    };
    controller.execute_script(script_id, script_args);
}

function playCard(controller, attacker, encounter, card_index) {
    var card = attacker.hand[card_index];
    console.log("playCard - card:");
    console.log(card);
    executeCardEffect("onPlayCard", controller, card, undefined);
    
    // execute "card.play_card 
    var i = encounter.history.length;
    encounter.history[i] = {"character": attacker, "card": card};
    
    executeCardEffect("onRemovedFromActive", controller, attacker.active_card, card);
    attacker.previousCard = attacker.active_card;
    attacker.active_card = card;
    attacker.initiative -= card.card_cost;
    removeCardFromHand(controller, attacker, card_index)
}

function drawCard(controller, character, index) {
    var card_id = character.deck.pop()
    var new_card = controller.get_by_type_and_id("card", card_id);
    var i = character.hand.length;
    character.hand[i] = new_card;
    executeCardEffect("onDrawn", controller, new_card, undefined);
}

function shuffleDeck(controller, character) {
    var new_deck = [];
    while(character.deck.length > 0) {
        var len = character.deck.length;
        var i = Math.floor(Math.random() * len);
        new_deck[new_deck.length] = character.deck[i]
        character.deck.splice(i, 1);
    }
    character.deck = new_deck;
}

function removeCardFromHand(controller, character, index) {
    var card = character.hand[index];
    console.log("removeCardFromHand: card; " + card);
    character.hand.splice(index, 1);
    console.log(character);
    executeCardEffect("onRemovedFromHand", controller, card, undefined);
    var i = character.discard.length;
    character.discard[i] = card.card_id;
    executeCardEffect("onDiscarded", controller, card, undefined);
}
function addCardToDiscard(controller, character, card_id) {
    // NOTE: does not invoke "onDiscarded" scripts, this should be invoked
    // after this function is called. Since this function does not take a card 
    // (which is required for invoking the card effect)
    console.log("combar.js - addCardToDiscard");
    console.log(character.discard);
}
    
function resolveCardScript(controller, data) { 
    var encounter = getEncounter(controller.state);
    var attacker = encounter[data.call_data.attacker];
    var defender = encounter[data.call_data.defender];
    resolveCard(controller, encounter, attacker, defender);
}
function resolveCard(controller, encounter, attacker, defender) {
    // execute card.resolveCard
    var defenseStat = 0;
    if (isCard(defender.active_card)) {
        defenseStat = defender.active_card.card_defense;
    }
    var damage = attacker.active_card.card_attack - defenseStat;
    if (damage < 0) {
        damage = 0;
    }
    defender.hp -= damage;
    executeCardEffect("onCardResolved", controller, attacker.active_card, defender.active_card);
    
    if (isCard(defender.active_card)) {
        executeCardEffect("onAttacked", controller, defender.active_card, attacker.active_card);
        if (damage > 0) {
            executeCardEffect("onDealsDamage", controller, attacker.active_card, defender.active_card);
            executeCardEffect("onDamaged", controller, defender.active_card, attacker.active_card);
        } else if (attacker.active_card.card_attack != 0) {
            executeCardEffect("onAttackBlocked", controller, attacker.active_card, defender.active_card);
            executeCardEffect("onBlocksAttack", controller, defender.active_card, attacker.active_card);
        }
    } else {
        if (damage > 0) {
            executeCardEffect("onDealsDamage", controller, attacker.active_card, defender.active_card);
        } else if (attacker.active_card.card_attack != 0) {
            executeCardEffect("onAttackBlocked", controller, attacker.active_card, defender.active_card);
        }
    }
}

var gameScrips = [
    {"game_script_id": "take_action", "script": takeActionScript},
//    {"game_script_id": "play_card", "script": playCard},
    {"game_script_id": "resolve_card", "script": resolveCardScript}
];

var gameEvent = [
    {"event_id": "take_action", "game_scripts": [takeAction], "data": {}},
    {"event_id": "", "game_scripts": [], "data": {}}
];

exports = gameScrips;