$.holdReady(true);

var sampleCardEffect1 = {} // TODO
var sampleCardEffect2 = {} // TODO

var sampleCard1 = {
    "name": "card one", 
    "description": "description one",
    "card_effects": [sampleCardEffect1],
    "card_attack": 2,
    "card_defense": 1,
    "card_cost": 1
}

var sampleCard1 = {
    "name": "card two", 
    "description": "description two",
    "card_effects": [sampleCardEffect2],
    "card_attack": 3,
    "card_defense": 2,
    "card_cost": 2
}

var combatant1 = {
    "name": "combatant1",
    "hand": [sampleCard1],
    "hp": 25,
    "initiative": 10,
    "activeCard": sampleCard1
}
var combatant2 = {
    "name": "combatant1",
    "hand": [sampleCard1],
    "hp": 25,
    "initiative": 10,
    "activeCard": null
}

var sampleEncounterTemplate = {} // TODO
var sampleEncounter = {
    "combatants": [combatant1, combatant2],
    "history": []
}

var sampleCombatEncounter = {} // TODO
var sampleCombatAction = {} // TODO
var sampleCombatant = {} // TODO


function testCardTypes(assert) {
    assert.ok(isCard(sampleCard1), "test isCard detects card");
    assert.ok(!isCard({}), "test isCard rejects empty object");
}

function testCombatTypes(assert) {
    assert.ok(isCard(sampleCard1), "test isCard detects card");
    assert.ok(!isCard(sampleEncounterTemplate), "test isCard detects card");
    assert.ok(!isCard(sampleEncounter), "test isCard detects card");
    assert.ok(!isCard({}), "test isCard rejects empty object");    
    
    assert.ok(isEncounterTemplate(sampleEncounterTemplate))
    assert.ok(!isEncounterTemplate(sampleCard1))
    assert.ok(!isEncounterTemplate(sampleEncounter))
    assert.ok(!isEncounterTemplate({}))
    
    assert.ok(isEncounter(sampleEncounter))
    assert.ok(!isEncounter(sampleCard1))
    assert.ok(!isEncounter(sampleEncounterTemplate))
    assert.ok(!isEncounter({}))
    
    assert.ok(isCombatEncounter(sampleCombatEncounter))
    assert.ok(!isCombatEncounter(sampleCard1))
    assert.ok(!isCombatEncounter({}))
    
    assert.ok(isCombatAction(sampleCombatAction))
    assert.ok(!isCombatAction(sampleCard1))
    assert.ok(!isCombatAction(sampleEncounterTemplate))
    assert.ok(!isCombatAction(sampleEncounter))
    assert.ok(!isCombatAction({}))
    
    assert.ok(isCombatant(sampleCombatant))
    assert.ok(!isCombatant(sampleCard1))
    assert.ok(!isCombatant({}))
}

function testPlayCards(assert) {
    var action = new CombatAction($.extend(true, {}, sampleCard1));
    var attacker = $.extend(true, {}, combatant1);
    var encounter = $.extend(true, {}, sampleEncounter)
    takeAction(attacker, encounter, action); 
    
    var bool = attacker.initiative === combatant1.initiative - sampleCard1.card_cost;
    assert.ok(bool, "Attacker's initiative is decreased");
    
    bool = encounter.history.length === sampleEncounter.history.length + 1;
    assert.ok(bool, "Encounter History Length Increases");
}

function testResolveActionAgainstNull(assert) {
    var action = new CombatAction(sampleCard1);
    var attacker = $.extend(true, {}, combatant1);
    var encounter = $.extend(true, {}, sampleEncounter);
    takeAction(attacker, encounter, action); 
    
    var defender = $.extend(true, {}, combatant2);
    resolveCard(attacker, defender, encounter);
    
    var bool = obj2.defender.hp === combatant2.hp - attacker.activeCard.attack;
    assert.ok(bool, "hp is decreased");
}

function testResolveActionAgainstCard(assert) {
    var action = new CombatAction(sampleCard1);
    var attacker = $.extend(true, {}, combatant1);
    var encounter = $.extend(true, {}, sampleEncounter);
    
    takeAction(attacker, encounter, action); 
    
    var defender = $.extend(true, {}, combatant2);
    resolveCard(attacker, defender, encounter);
    
    var bool = defender.hp === combatant2.hp - attacker.activeCard.attack;
    assert.ok(bool, "hp is decreased");
}

window.onload = function() {
    console.log("testing combat");
//	QUnit.test( "Card Types", testCardTypes);
//	QUnit.test( "Combat Types", testCombatTypes);
	QUnit.test( "Play Card", testPlayCards);
}
