
/*
Expected args from script being called.
{
	"controller": controller,
	"card": card,
	"hook_args": hook_args,
	"card_args": card_args
}
*/

function true_damage(args) {
    var damage = 1;
    if (typeof(args.card_args.damage) === "number") {
        damage = args.card_args.damage;
    }
    args.target.hp -= damage;
}

/**
  *  Should be invoked by "onPlayCard"
  *  Sets the cost equal to the character that played the card's remaining 
  */
function initiaitve_into_attack(args) {
	var card = args.card;
	var attacker = args.hook_args.attacker
	
	card.cost = attacker.initiative;
	card.attack += attacker.initiative;
}

/**
  *  Should be invoked by "onPlayCard"
  *  Sets the cost equal to the character that played the card's remaining 
  */
function initiaitve_into_defense(args) {	
	var card = args.card;
	var attacker = args.hook_args.attacker
	
	card.cost = attacker.initiative;
	card.defense += attacker.initiative;
}

/**
  *  alters the target's stats based on the card args passed.
  *  args:
  *    hp (optional, default = 0) - added to actor's HP
  *    initiaitve (optional, default = 0) - added to actor's current initiative
  *    attack (optional, default = 0) - added to target's active card's attack value
  *    defense (optional, default = 0) - added to target's active card's defense value
  */
function buff_target(args) {	
	var target = args.hook_args.attacker
	var hp = 0;
	var initiative = 0;
	var attack = 0;
	var defense = 0;
	
	if (args.card_args.hp) {
		hp = args.card_args.hp
	}
	if (args.card_args.initiative) {
		initiative = args.card_args.initiative
	}
	if (args.card_args.attack) {
		initiative = args.card_args.attack
	}
	if (args.card_args.defense) {
		initiative = args.card_args.defense
	}
	target.hp += hp;
	target.initiative += initiative;
}

/**
  *  alters the actor's stats based on the card args passed.
  *  args:
  *    hp (optional, default = 0) - added to actor's HP
  *    initiaitve (optional, default = 0) - added to actor's current initiative
  *    attack (optional, default = 0) - added to actor's active card's attack value
  *    defense (optional, default = 0) - added to actor's active card's defense value
  */
function buff_actor(args) {	
	var attacker = args.hook_args.attacker
	var hp = 0;
	var initiative = 0;
	var attack = 0;
	var defense = 0;
	
	if (args.card_args.hp) {
		hp = args.card_args.hp
	}
	if (args.card_args.initiative) {
		initiative = args.card_args.initiative
	}
	if (args.card_args.attack) {
		initiative = args.card_args.attack
	}
	if (args.card_args.defense) {
		initiative = args.card_args.defense
	}
	attacker.hp += hp;
	attacker.initiative += initiative;
	attacker.active_card.attack += attack;
	attacker.active_card.defense += defense;
}

var scripts = {
	"initiaitve_into_attack": initiaitve_into_attack,
	"initiaitve_into_defense": initiaitve_into_defense,
	"buff_target": buff_target,
	"buff_actor": buff_actor,
	"true_damage": true_damage
}


export default gc => gc.add_scripts(scripts);