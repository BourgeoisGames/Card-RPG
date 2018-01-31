
function isCard(obj) {
    var bool;
    bool = "string" === typeof(obj.name);
    bool &= "string" === typeof(obj.description);
    bool &= "number" === typeof(obj.card_attack);
    bool &= "number" === typeof(obj.card_defense);
    bool &= "number" === typeof(obj.card_cost);
    // card effects is an object, each field contains a function which returns a game_script execution.
    bool &= "object" === typeof(obj.card_effects);
    return bool;
}


/* Card Effect Types
onPlayCard
onCardResolved
onAttacked