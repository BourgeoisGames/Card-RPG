$.holdReady(true);

var sample_card_effect1 = {} // TODO
var sampleCardEffect2 = {} // TODO

var sample_card_effects = {
    "onPlayCard": ["onPlayCard", ["args_onPlayCard"]],
    "onCardPlayedAgainst": ["onCardPlayedAgainst", ["args_onCardPlayedAgainst"]],
    "onCardResolved": ["onCardResolved", ["args_onCardResolved"]],
    "onCardResolvedAgainst": ["onCardResolvedAgainst", ["args_onCardResolvedAgainst"]],
    "onRemovedFromActive": ["onRemovedFromActive", ["args_onRemovedFromActive"]],
    "onAttacked": ["onAttacked", ["args_onAttacked"]],
    "onDealsDamage": ["onDealsDamage", ["args_onDealsDamage"]],
    "onDamaged": ["onDamaged", ["args_onDamaged"]],
    "onBlocksAttack": ["onBlocksAttack", ["args_onBlocksAttack"]],
    "onAttackBlocked": ["onAttackBlocked", ["args_onAttackBlocked"]],
    "onDiscarded": ["onDiscarded", ["args_onDiscarded"]],
    "onRemovedFromHand": ["onRemovedFromHand", ["args_onRemovedFromHand"]],
    "onDrawn": ["onDrawn", ["args_onDrawn"]],
    "onOpponentDraws": ["onOpponentDraws", ["args_onOpponentDraws"]]
}

var sample_status_effect = {
    "duration": 2,
    "name": "Test Status",
    "description": "This status effect is for testing",
    "hidden": false,
    "hooks": {
        "status_onPlayCard": ["status_onPlayCard", ["args_onPlayCard"]],
        "status_onCardPlayedAgainst": ["status_onCardPlayedAgainst", ["args_onCardPlayedAgainst"]],
        "status_onCardResolved": ["status_onCardResolved", ["args_onCardResolved"]],
        "status_onCardResolvedAgainst": ["status_onCardResolvedAgainst", ["args_onCardResolvedAgainst"]],
        "status_onRemovedFromActive": ["status_onRemovedFromActive", ["args_onRemovedFromActive"]],
        "status_onAttacked": ["status_onAttacked", ["args_onAttacked"]],
        "status_onDealsDamage": ["status_onDealsDamage", ["args_onDealsDamage"]],
        "status_onDamaged": ["status_onDamaged", ["args_onDamaged"]],
        "status_onBlocksAttack": ["status_onBlocksAttack", ["args_onBlocksAttack"]],
        "status_onAttackBlocked": ["status_onAttackBlocked", ["args_onAttackBlocked"]],
        "status_onDiscarded": ["status_onDiscarded", ["args_onDiscarded"]],
        "status_onRemovedFromHand": ["status_onRemovedFromHand", ["args_onRemovedFromHand"]],
        "status_onDrawn": ["status_onDrawn", ["args_onDrawn"]],
        "status_onOpponentDraws": ["status_onOpponentDraws", ["args_onOpponentDraws"]]
    },
}


var sampleCard1 = {
    "card_id": "card one", 
    "description": "description one",
    "card_effects": sample_card_effects,
    "card_attack": 2,
    "card_defense": 1,
    "card_cost": 1
}

var sampleCard2 = {
    "card_id": "card two", 
    "description": "description two",
//    "card_effects": ,
    "card_attack": 3,
    "card_defense": 2,
    "card_cost": 2
}

var character1 = {
    "name": "character1",
    "hand": [sampleCard1],
    "deck": ["card_id1"],
    "discard": ["discarded card"],
    "hp": 25,
    "initiative": 10,
    "active_card": $.extend(true, {}, sampleCard1)
}
var character2 = {
    "name": "character2",
    "hand": [sampleCard1],
    "deck": ["card_id1"],
    "discard": [],
    "hp": 25,
    "initiative": 10,
    "active_card": null
}

var sampleEncounterTemplate = {} // TODO
var sampleEncounter = {
    "combatants": [character1, character2],
    "history": []
}

var sampleCombatEncounter = {} // TODO
var sampleCombatAction = {} // TODO
var sampleCombatant = {} // TODO

function MockController() {
    this.scripts_called = []
    this.execute_script = (sid, args) => {
        console.log("sid: " + sid);
        console.log("args: " + args);
        var i = this.scripts_called.length;
        this.scripts_called[i] = [sid, args];
    }
    this.get_by_type_and_id = (type, tid) => {
        return $.extend(true, {}, sampleCard1);
    }
}

function validate_script_was_called(assert, mockCtrl, sid, i) {
    console.log("validate_script_was_called(assert, mockCtrl, " + sid + ", " + i);
    console.log(mockCtrl.scripts_called);
//    var last_script = mockCtrl.scripts_called.length - 1;
//    var sid_called = mockCtrl.scripts_called[last_script - offset][0];
    var sid_called = mockCtrl.scripts_called[i][0]
    assert.equal(sid_called, sid, "script " + sid + " was called at the correct time"); 
}

function testvalidate_script_was_called(assert) {
    var mockMockCtrl = {"scripts_called": [["one", "args"], ["two", "args"], ["three", "args"]]}
    validate_script_was_called(assert, mockMockCtrl, "one", 0);
    validate_script_was_called(assert, mockMockCtrl, "two", 1);
    validate_script_was_called(assert, mockMockCtrl, "three", 2);
}

function testTakeTurnWithStatusEffect(assert) {
    var attacker = $.extend(true, {}, character1);
    attacker.status_effects = [ $.extend(true, {}, sample_status_effect) ];
    var defender = $.extend(true, {}, character1);
    defender.status_effects = [ $.extend(true, {}, sample_status_effect) ];
    var action = {"type": "card", "value": 0, "actor": attacker, "target": defender};
    var encounter = $.extend(true, {}, sampleEncounter)
    var mockCtrl = new MockController();
    
    // get expected results
    var discard_len = attacker.discard.length;
    var hand_len = attacker.hand.length;
    var starting_active_card = attacker.active_card
    
    take_turn(mockCtrl, encounter, [action]);

    validate_script_was_called(assert, mockCtrl, "status_onPlayCard", 0);
    validate_script_was_called(assert, mockCtrl, "onPlayCard", 1);
    validate_script_was_called(assert, mockCtrl, "status_onRemovedFromActive", 2);
    validate_script_was_called(assert, mockCtrl, "onRemovedFromActive", 3);
    validate_script_was_called(assert, mockCtrl, "status_onRemovedFromHand", 4);
    validate_script_was_called(assert, mockCtrl, "onRemovedFromHand", 5);
    validate_script_was_called(assert, mockCtrl, "status_onDiscarded", 6);
    validate_script_was_called(assert, mockCtrl, "onDiscarded", 7);
    
    // hooks from resolve card
    validate_script_was_called(assert, mockCtrl, "status_onCardResolved", 8);
    validate_script_was_called(assert, mockCtrl, "onCardResolved", 9);
    validate_script_was_called(assert, mockCtrl, "status_onCardResolvedAgainst", 10);
    validate_script_was_called(assert, mockCtrl, "onCardResolvedAgainst", 11);
    validate_script_was_called(assert, mockCtrl, "status_onAttacked", 12);
    validate_script_was_called(assert, mockCtrl, "onAttacked", 13);
    validate_script_was_called(assert, mockCtrl, "status_onDealsDamage", 14);
    validate_script_was_called(assert, mockCtrl, "onDealsDamage", 15);
    validate_script_was_called(assert, mockCtrl, "status_onDamaged", 16);
    validate_script_was_called(assert, mockCtrl, "onDamaged", 17);
}

function testTakeTurnWithOneAction(assert) {
    var attacker = $.extend(true, {}, character1);
    var defender = $.extend(true, {}, character1);
    var action = {"type": "card", "value": 0, "actor": attacker, "target": defender};
    var encounter = $.extend(true, {}, sampleEncounter)
    var mockCtrl = new MockController();
    
    // get expected results
    var discard_len = attacker.discard.length;
    var hand_len = attacker.hand.length;
    var starting_active_card = attacker.active_card
    
    take_turn(mockCtrl, encounter, [action]);
    
    var bool = attacker.initiative === character1.initiative - sampleCard1.card_cost;
    assert.ok(bool, "Attacker's initiative is decreased");
    
    bool = encounter.history.length === sampleEncounter.history.length + 1;
    assert.ok(bool, "Encounter History Length Increases");
    
    assert.equal(attacker.discard.length, discard_len + 1, "card played increases discard");
    assert.equal(attacker.hand.length, hand_len - 1, "card played removed from hand");
    
    assert.equal(starting_active_card.card_id, attacker.discard.pop(), "discard has previous active card on top");
    
    var bool = defender.hp === character1.hp - attacker.active_card.attack;
    assert.ok(bool, "hp is decreased");
    
    console.log(mockCtrl.scripts_called);
    // hooks from play card
    validate_script_was_called(assert, mockCtrl, "onPlayCard", 0);
    validate_script_was_called(assert, mockCtrl, "onRemovedFromActive", 1);
    validate_script_was_called(assert, mockCtrl, "onRemovedFromHand", 2);
    validate_script_was_called(assert, mockCtrl, "onDiscarded", 3);
    
    // hooks from resolve card
    validate_script_was_called(assert, mockCtrl, "onCardResolved", 4);
    validate_script_was_called(assert, mockCtrl, "onCardResolvedAgainst", 5);
    validate_script_was_called(assert, mockCtrl, "onAttacked", 6);
    validate_script_was_called(assert, mockCtrl, "onDealsDamage", 7);
    validate_script_was_called(assert, mockCtrl, "onDamaged", 8);
}

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

function testUndefinedCardArgs() {
    
}

function testPlayCards(assert) {
    // setup test data 
    var attacker = $.extend(true, {}, character1);
    var action = {"type": "card", "value": 0, "actor": attacker};
    var encounter = $.extend(true, {}, sampleEncounter)
    var mockCtrl = new MockController();
    
    // get expected results
    var discard_len = attacker.discard.length;
    var hand_len = attacker.hand.length;
    var starting_active_card = attacker.active_card
    
    take_action(mockCtrl, encounter, action); 
    
    var bool = attacker.initiative === character1.initiative - sampleCard1.card_cost;
    assert.ok(bool, "Attacker's initiative is decreased");
    
    bool = encounter.history.length === sampleEncounter.history.length + 1;
    assert.ok(bool, "Encounter History Length Increases");
    
    assert.equal(attacker.discard.length, discard_len + 1, "card played increases discard");
    assert.equal(attacker.hand.length, hand_len - 1, "card played removed from hand");
    
    assert.equal(starting_active_card.card_id, attacker.discard.pop(), "discard has previous active card on top");
    
    console.log(mockCtrl.scripts_called);
    validate_script_was_called(assert, mockCtrl, "onPlayCard", 0);
    validate_script_was_called(assert, mockCtrl, "onRemovedFromActive", 1);
    validate_script_was_called(assert, mockCtrl, "onRemovedFromHand", 2);
    validate_script_was_called(assert, mockCtrl, "onDiscarded", 3);
}

function testDrawCard(assert) {
    var character = {"deck": ["sampleCard"], "hand": []}
    var start_hand = character.hand.length;
    var start_deck = character.deck.length;
    var card_id = character.deck[character.deck.length-1]
    var mockCtrl = new MockController();
    
    draw_one_card(mockCtrl, character, 0);
    assert.equal(start_hand + 1, character.hand.length, "hand size increases");
    assert.equal(start_deck - 1, character.deck.length, "deck size decreases");
    var i = character.hand.length - 1;
    // this test is bad because it tests the card returned by a mock function.
    // assert.equal(card_id, character.hand[i].card_id, "top card drawn");
    
    validate_script_was_called(assert, mockCtrl, "onDrawn", 0);
    validate_script_was_called(assert, mockCtrl, "onOpponentDraws", 1);
}

function testResolveActionAgainstNull(assert) {
    var action = new CombatAction(sampleCard1);
    var attacker = $.extend(true, {}, character1);
    var encounter = $.extend(true, {}, sampleEncounter);
    var mockCtrl = new MockController();
    take_action(mockCtrl, attacker, encounter, action); 
    
    var defender = $.extend(true, {}, character2);
    
    var action = {"type": "card", "actor": attacker, "target": defender, "value": 0}
    resolve_card(mockCtrl, encounter, action);
    
    var bool = defender.hp === character2.hp - attacker.active_card.attack;
    assert.ok(bool, "hp is decreased");
    
    validate_script_was_called(assert, mockCtrl, "onCardResolved", 0);
    validate_script_was_called(assert, mockCtrl, "onCardResolvedAgainst", 1);
    validate_script_was_called(assert, mockCtrl, "onDealsDamage", 2);
    validate_script_was_called(assert, mockCtrl, "onRemovedFromHand", 3);
    validate_script_was_called(assert, mockCtrl, "onDiscarded", 4);
}

function testResolveActionAgainstCard(assert) {
    var action = new CombatAction(sampleCard1);
    var attacker = $.extend(true, {}, character1);
    var encounter = $.extend(true, {}, sampleEncounter);
    var mockCtrl = new MockController();
    
    take_action(mockCtrl, attacker, encounter, action); 
    
    var defender = $.extend(true, {}, character2);
    
    var action = {"type": "card", "value": 0, "actor": attacker, "target": defender};
    resolve_card(mockCtrl, encounter, action);
    
    var bool = defender.hp === character2.hp - attacker.active_card.attack;
    assert.ok(bool, "hp is decreased");
    
    validate_script_was_called(assert, mockCtrl, "onCardResolved", 0);
    validate_script_was_called(assert, mockCtrl, "onCardResolvedAgainst", 1);
    validate_script_was_called(assert, mockCtrl, "onAttacked", 2);
    validate_script_was_called(assert, mockCtrl, "onDealsDamage", 3);
    validate_script_was_called(assert, mockCtrl, "onDamaged", 4);
    validate_script_was_called(assert, mockCtrl, "onRemovedFromHand", 5);
    validate_script_was_called(assert, mockCtrl, "onDiscarded", 6);
}   

function testShuffleDeck(assert) {
    var mockCharacter = {"deck": [1, 2, 3, 4, 5, 6, 7, 8, 9]}
    var unshuffled = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    var mockCtrl = new MockController();
    
    shuffleDeck(mockCtrl, mockCharacter);
    var bool = false;
    for (var i = 0; i < unshuffled.length; i++) {
        bool = bool || (unshuffled[i] != mockCharacter.deck[i]);
    }   
    console.log("unshuffled: " + unshuffled);
    console.log(" shuffled:  " + mockCharacter.deck);
    assert.ok(bool, "deck is not the same");
}

function testDiscardCard(assert) {
    var mockCtrl = new MockController();
    var mockCharacter = {
        "hand": [{"card_id": 0}, {"card_id": 1}, {"card_id": 2}, {"card_id": 3}, {"card_id": 4}],
        "discard": []
    }
    
    var discard_len = mockCharacter.discard.length;
    var hand_len = mockCharacter.hand.length;
    console.log("discard_len: " + discard_len);
    console.log("hand_len: " + hand_len);
    
    var test_card_id = 2;
    removeCardFromHand(mockCtrl, mockCharacter, test_card_id);
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

function testExecuteCardEffect(assert) {
    var mockCtrl = new MockController();
    var card = {
        "card_effects": {"some_script": "expected script name"},
        "effect_args": {"some_script": [1, 2, 3]}
    };
    executeCardEffect("some_script", mockCtrl, card, undefined);
    // assert, mockCtrl, sid, offset
//    validate_script_was_called(assert, mockCtrl, "expected script name", 0);
    var sid = mockCtrl.scripts_called[0][0]
    var args = mockCtrl.scripts_called[0][1]
    assert.equal(sid, "expected script name", "correct script called");
    var expected_args = card.effect_args.some_script;
    for (var i = 0; i < expected_args.length; i++) {
        assert.equal(args.card_args[i], expected_args[i], "arg " + i + " matches expected");
    }
}

window.onload = function() {
    console.log("testing combat");
/*
	QUnit.test( "Card Types", testCardTypes);
	QUnit.test( "Combat Types", testCombatTypes);
    QUnit.test("Test Execute Card Effect", testExecuteCardEffect);
	QUnit.test( "Play Card", testPlayCards);
    QUnit.test( "Shuffle Deck", testShuffleDeck);
    QUnit.test( "Discard Card", testDiscardCard);
	QUnit.test( "Test Validate Script Function", testvalidate_script_was_called); //*/
	QUnit.test( "Test Take Turn (one action)", testTakeTurnWithOneAction);
//    QUnit.test( "Test Draw Card", testDrawCard);
    QUnit.test( "Take Turn with A Status Effects", testTakeTurnWithStatusEffect);
}
