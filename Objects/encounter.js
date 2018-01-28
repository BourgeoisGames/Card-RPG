1
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
    if (!bool) { return false };
    for (var i = 0; i < obj.hand.length; i++) {
        if (!isCard(obj.hand[i])) {
            return false;
        }
    }
    return bool;
} 

function CombatAction(value) {
    this.value = value
}