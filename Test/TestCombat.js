$.holdReady(true);

var sampleCardEffect1 = {} // TODO
var sampleCardEffect2 = {} // TODO

var mockController = {
    "execute_script": (x, y) => {}
}

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

var character1 = {
    "name": "character1",
    "hand": [sampleCard1],
    "deck": ["card_id1"],
    "discard": [],
    "hp": 25,
    "initiative": 10,
    "activeCard": sampleCard1
}
var character2 = {
    "name": "character2",
    "hand": [sampleCard1],
    "deck": ["card_id1"],
    "discard": [],
    "hp": 25,
    "initiative": 10,
    "activeCard": null
}

var sampleEncounterTemplate = {} // TODO
var sampleEncounter = {
    "combatants": [character1, character2],
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
    // setup test data 
    var action = new CombatAction("card", 0);
    var attacker = $.extend(true, {}, character1);
    var encounter = $.extend(true, {}, sampleEncounter)
    
    // get expected results
    var discard_len = attacker.discard.length;
    var hand_len = attacker.hand.length;
    var starting_active_card = attacker.active_card
    
    console.log("aaa");
    takeAction(mockController, encounter, attacker, action); 
    console.log("bbb");
    
    var bool = attacker.initiative === character1.initiative - sampleCard1.card_cost;
    assert.ok(bool, "Attacker's initiative is decreased");
    
    bool = encounter.history.length === sampleEncounter.history.length + 1;
    assert.ok(bool, "Encounter History Length Increases");
    
    assert.equal(attacker.discard.length, discard_len + 1, "card played increases discard");
    assert.equal(attacker.hand.length, hand_len - 1, "card played removed from hand");
    
    assert.equal(starting_active_card.card_id, attacker.discard.pop(), "discard has previous active card on top");
}

function testDrawCard(assert) {
    var character = {"deck": ["sampleCard"], "hand": []}
    var start_hand = character.hand.length;
    var start_deck = character.deck.length;
    var card_id = character.deck[character.deck.length-1]
    
    drawCard(character, 0);
    assert.equal(start_hand + 1, character.hand.length, "hand size increases");
    assert.equal(start_deck - 1, character.deck.length, "deck size decreases");
    var i = character.hand.length - 1;
    assert.equal(card_id, character.hand[i].card_id, "top card drawn");
}

function testResolveActionAgainstNull(assert) {
    var action = new CombatAction(sampleCard1);
    var attacker = $.extend(true, {}, character1);
    var encounter = $.extend(true, {}, sampleEncounter);
    takeAction(attacker, encounter, action); 
    
    var defender = $.extend(true, {}, character2);
    resolveCard(attacker, defender, encounter);
    
    var bool = obj2.defender.hp === character2.hp - attacker.active_card.attack;
    assert.ok(bool, "hp is decreased");
}

function testResolveActionAgainstCard(assert) {
    var action = new CombatAction(sampleCard1);
    var attacker = $.extend(true, {}, character1);
    var encounter = $.extend(true, {}, sampleEncounter);
    
    takeAction(attacker, encounter, action); 
    
    var defender = $.extend(true, {}, character2);
    resolveCard(attacker, defender, encounter);
    
    var bool = defender.hp === character2.hp - attacker.active_card.attack;
    assert.ok(bool, "hp is decreased");
}   

function testShuffleDeck(assert) {
    var mockCharacter = {"deck": [1, 2, 3, 4, 5, 6, 7, 8, 9]}
    var unshuffled = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    shuffleDeck(mockCharacter);
    var bool = false;
    for (var i = 0; i < unshuffled.length; i++) {
        bool = bool || (unshuffled[i] != mockCharacter.deck[i]);
    }   
    console.log("unshuffled: " + unshuffled);
    console.log(" shuffled:  " + mockCharacter.deck);
    assert.ok(bool, "deck is not the same");
}

function testDiscardCard(assert) {
    var mockCharacter = {
        "hand": [{"card_id": 0}, {"card_id": 1}, {"card_id": 2}, {"card_id": 3}, {"card_id": 4}],
        "discard": []
    }
    
    var discard_len = mockCharacter.discard.length;
    var hand_len = mockCharacter.hand.length;
    console.log("discard_len: " + discard_len);
    console.log("hand_len: " + hand_len);
    
    var test_card_id = 2;
    removeCardFromHand(mockCharacter, test_card_id);
    console.log(mockCharacter.hand);
    console.log(mockCharacter.discard);
    
    assert.ok(mockCharacter.discard.length === discard_len + 1, "number of discards is correct");
    assert.ok(mockCharacter.hand.length === hand_len - 1, "number of discards is correct");
    assert.equal(mockCharacter.discard[0], test_card_id, "discard contains correct card");
    var card_not_in_hand = true;
    for (var i = 0; i < mockCharacter.hand.length; i++) {
        card_not_in_hand &= mockCharacter.hand[i].card_id != test_card_id;
    }
    assert.ok(card_not_in_hand, "card was removed from hand");
}

window.onload = function() {
    console.log("testing combat");
//	QUnit.test( "Card Types", testCardTypes);
//	QUnit.test( "Combat Types", testCombatTypes);
	QUnit.test( "Play Card", testPlayCards);
//    QUnit.test( "Shuffle Deck", testShuffleDeck);
//    QUnit.test( "Discard Card", testDiscardCard);
    QUnit.test( "Test Draw Card", testDrawCard);
}
