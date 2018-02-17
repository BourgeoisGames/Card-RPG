
function isCard(obj) {
    var bool;
    bool = "string" === typeof(obj.card_id);
    bool &= "string" === typeof(obj.description);
    bool &= "number" === typeof(obj.card_attack);
    bool &= "number" === typeof(obj.card_defense);
    bool &= "number" === typeof(obj.card_cost);
    bool &= ("undefined" === typeof(obj.effect_args)
         || "object" === typeof(obj.effect_args))
    // card effects is an object, each field contains a function which returns a game_script execution.
    bool &= "object" === typeof(obj.card_effects);
    bool &= "object" === typeof(obj.modifiers)
         || "undefined" === typeof(obj.modifiers);
    bool &= "undefined" === typeof(obj.card_holder)
         || isCharacter(obj.card_holder);
    return bool;
}

/* Card Effect Types
 * 
 * onPlayCard               - resolves as soon as the card is played
 * &&& onCardPlayedAgainst      - resolves as soon as the card is played
 * onCardResolved           - resolves while the card is resolving
 * onCardResolvedAgainst    - resolves while the card is resolving
 * onRemovedFromActive      - resolves when the card is replaced by another card as
 *                             your active card
 * onAttacked               - resolves when an attack is made, while this card is 
 *                             active
 * onDealsDamage            - resolves when this card is resolved, and successfully 
 *                             deals damage
 * onDamaged                - resolves when another card resolves, while this card is 
 *                             active, which deals damage.
 * onBlocksAttack           - resolves when an attack, with at least 1 attack is made,
 *                             that deals no damage
 * onAttackBlocked              - resolves when card is played, but fails to deal damage
 * onDiscarded              - resolves as soon as the card is added to the discard
 * onRemovedFromHand        - resolves as soon as the card is removed from the hand.
 * onDrawn                  - resolves as soon as the card is drawn from the deck
 * &&& onOpponentDraws          - resolves as soon as the card is drawn from the deck
 */
 // &&& field not yet implemented in the pipeline
 