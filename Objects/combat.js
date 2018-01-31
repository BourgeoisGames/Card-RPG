


function takeActionScript(controller, data) {
    var encounter = getEncounter(controller.state);
    var attacker = encounter[data.call_data.attacker];
    var action = data.call_data.action;
    takeAction(controller, encounter, attacker, action);
}
    
function takeAction(controller, encounter, attacker, action)
    if(isCard(action.value)) {
        playCard(controller, attacker, encounter, action.value);
    }
    else {
        console.log("takeAction() argument action.value was not a valid type!");
    }
}

function executeCardEffect(effect_id, controller, encounter, card) {
    var cardEffect = card.card_effects[effect_id]
    var script_obj = card_effect(controller, encounter, card);
    controller.execute_script(script_obj.sid, script_obj.args);
}

function playCard(controller, attacker, encounter, card) {
    
    executeCardEffect("onPlayCard", controller, encounter, card);
    
    // execute "card.play_card 
    var action = new CombatAction(card);
    var i = encounter.history.length;
    encounter.history[i] = action;
    
    attacker.activeCard = card;
    attacker.initiative -= card.card_cost;
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
    if (isCard(defender.activeCard)) {
        defenseStat = defender.activeCard.card_defense;
    }
    var damage = attacker.activeCard.card_attack - defenseStat;
    if (damage < 0) {
        damage = 0;
    }
    defender.hp -= damage;
    executeCardEffect("onCardResolved", controller, encounter, attacker.activeCard);
    if (isCard(defender.activeCard)) {
        executeCardEffect("onAttacked", controller, encounter, defender.activeCard);
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