
function takeAction(attacker, encounter, action) {
    if(isCard(action.value)) {
        playCard(attacker, encounter, action.value);
    }
    else {
        console.log("takeAction() argument action.value was not a valid type!");
    }
    
}

function playCard(attacker, encounter, card) {
    attacker.activeCard = card;
    attacker.initiative -= card.card_cost;
    
    var action = new CombatAction(card);
    var i = encounter.history.length;
    encounter.history[i] = action;
}

function resolveCard(attacker, defender, encounter) {
    var defenseStat = 0;
    if (isCard(defender.activeCard)) {
        defenseStat = defender.activeCard.card_defense;
    }
    var damage = attacker.activeCard.card_attack - defenseStat;
    if (damage < 0) {
        damage = 0;
    }
    defender.hp -= damage;
}