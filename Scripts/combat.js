
function isEncounterTemplate(obj) {
    var bool = true;
    
    return bool;
}

function isEncounter(obj) {
    var bool = true;
    
    return bool;
}

function isCombatEncounter(obj) {
    var bool = true;
    
    return bool;
}

function isCombatAction(obj) {
    var bool = true;
    bool &= "number" === typeof(obj.time_cost) || null == obj.time_cost 
//    bool &= 
    return bool;
}

function isCombatant(obj) {
    var bool = true;
    bool &= "string" === typeof(obj.name);
    bool &= "number" === typeof(obj.hp);
    bool &= Array.isArray(obj.hand);
    if (!bool) return false;
    for (int i = 0; i < obj.hand.length; i++) {
        if (! isCard(obj.hand[i])) return false;    
    }
    return bool;
} 

function takeAction(attacker, encounter, action) {
    if(isCard(action.value)) {
        var obj = playCard(combatant, encounter, action.value);
        return obj;
    }
    else {
        console.log("takeAction() argument action.value was not a valid type!");
    }
    
}

function playCard(attacker, encounter, card) {
    attacker = $.extend(true, {}, attacker);
    attacker.activeCard = card;
    attacker.initiative -= card.card_cost;
    
    var action = new CombatAction(card);
    var encounter = $.extend(true, {}, extend);
    var i = encounter.history.length;
    encounter.history[i] = action;
    return {
        "attacker": attacker,
        "encounter": encounter,
        "action": action
    }
}

function resolveCard(attacker, defender, encounter) {
    attacker = $.extend(true, {}, attacker);
    defender = $.extend(true, {}, defender);
    encounter = $.extend(true, {}, encounter);

    var defenseStat = 0;
    if (isCard(defender.activeCard)) {
        defenseStat = defender.activeCard.card_defense;
    }
    var damage = attacker.activeCard.card_attack - defenseStat;
    if (damage < 0) {
        damage = 0;
    }
    defender.hp -= damage;
    return {
        "attacker": attacker,
        "defender": defender,
        "encounter": encounter
    }
}

function CombatAction(value) {
    this.value = value
}