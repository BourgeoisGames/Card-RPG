1
function isEncounterTemplate(obj) {
    var bool = true;
    
    return bool;
}

function getEncounter(game_state) {
    return controller.state.data.encounter;
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

function CombatAction(type, value) {
    this.type = type;
    this.value = value;
}