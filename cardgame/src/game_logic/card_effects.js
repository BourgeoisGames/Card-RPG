
function isCardEffect(obj) {
    return "function" === typeof(obj);
}

function trueDamage(args) {
    var damage = 1;
    if (typeof(args.cardArgs.damage) === "number") {
        damage = args.cardArgs.damage;
    }
    args.target.hp -= damage;
}

function boostDamageModifier(args) {
    
}