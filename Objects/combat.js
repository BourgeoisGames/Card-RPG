


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

function getCardEffectArgs(effect_id, card) {
    if ("undefined" === typeof(card.effect_args)) { return []; }
    if ("undefined" === typeof(card.effect_args[effect_id])) { return []; }
    return card.effect_args[effect_id];
}

function getCardModifierArgs(modifier_id, card) {
    if ("undefined" === typeof(card.modifier_args)) { return []; }
    if ("undefined" === typeof(card.modifier_args[modifier_id])) { return []; }
    return card.modifier_args[modifier_id];
}

function executeCardEffect(effect_id, controller, card, otherCard) {
    var cardArgs = getCardEffectArgs(effect_id, card);
    var script_id = card.card_effects[effect_id]
    var script_args = {
        "controller": controller,
        "card": card,
        "target": otherCard,
        "cardArgs": cardArgs
    };
    return controller.execute_script(script_id, script_args);
}

function executeCardModifier(modifier_id, controller, modifying_card, card_modified) {
    var cardArgs = getCardModifierArgs(modifier_id, modifying_card)
    var script_id = card.card_effects[effect_id];
    var args = {
        "controller": controller,
        "modifying_card":modifying_card,
        "card_modified":card_modified,
        "card_args": cardArgs
    };
    return controller.execute_script(script_id, args);
}

function playCard(controller, attacker, encounter, card) {
    executeCardEffect("onPlayCard", controller, card, undefined);
    
    // execute "card.play_card 
    var action = new CombatAction(card);
    var i = encounter.history.length;
    encounter.history[i] = action;
    
    executeCardEffect("onRemovedFromActive", controller, attacker.activeCard, card);
    attacker.previousCard = attacker.activeCard;
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
    var modifier = defender.activeCard.modifiers.defending(card);
    var defenseStat = 0;
    if (isCard(defender.activeCard)) {
        defenseStat = defender.activeCard.card_defense;
    }
    var damage = attacker.activeCard.card_attack - defenseStat;
    if (damage < 0) {
        damage = 0;
    }
    defender.hp -= damage;
    executeCardEffect("onCardResolved", controller, attacker.activeCard, defender.activeCard);
    
    if (isCard(defender.activeCard)) {
        executeCardEffect("onAttacked", controller, defender.activeCard, attacker.activeCard);
        if (damage > 0) {
            executeCardEffect("onDealsDamage", controller, attacker.activeCard, defender.activeCard);
            executeCardEffect("onDamaged", controller, defender.activeCard, attacker.activeCard);
        } else if (attacker.activeCard.card_attack != 0) {
            executeCardEffect("onAttackBlocked", controller, attacker.activeCard, defender.activeCard);
            executeCardEffect("onBlocksAttack", controller, defender.activeCard, attacker.activeCard);
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