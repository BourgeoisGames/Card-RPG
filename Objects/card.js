
function isCard(obj) {
    var bool;
    bool = "string" === typeof(obj.name);
    bool &= "string" === typeof(obj.description);
    bool &= "number" === typeof(obj.card_attack);
    bool &= "number" === typeof(obj.card_defense);
    bool &= "number" === typeof(obj.card_cost);
    bool &= Array.isArray(obj.card_effects);
    if (!bool) return false;
    for (var i = 0; i < obj.card_effects.length; i++) {
        // every item in obj.card_effects must be a cardEffect
        if (! isCardEffect(obj.card_effects[i])) return false;
    }
    return bool;
}

function isCardEffect(obj) {
    // TODO i defined this to return true so I can use cards before I 
    // create what a card effect is
    return true;  
}