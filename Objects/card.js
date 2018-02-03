
function isCard(obj) {
    var bool;
    bool = "string" === typeof(obj.name);
    bool &= "string" === typeof(obj.description);
    bool &= "number" === typeof(obj.card_attack);
    bool &= "number" === typeof(obj.card_defense);
    bool &= "number" === typeof(obj.card_cost);
    bool &= ("undefined" === typeof(obj.effect_args)
         || "object" === typeof(obj.effect_args))
    // card effects is an object, each field contains a function which returns a game_script execution.
    bool &= "object" === typeof(obj.card_effects);
    bool &- "object" === typeof(obj.modifiers)
         || "undefined" === typeof(obj.modifiers)
    return bool;
}

/* Card Effect Types
 * 
 * onPlayCard           - resolves as soon as the card is played
 * onCardResolved       - resolves while the card is resolving
 * onRemovedFromActive  - resolves when the card is replaced by another card as
 *                         your active card
 * onAttacked           - resolves when an attack is made, while this card is 
 *                         active
 * onDealsDamage        - resolves when this card is resolved, and successfully 
 *                         deals damage
 * onDamaged            - resolves when another card resolves, while this card is 
 *                         active, which deals damage.
 * onBlocksAttack       - resolves when an attack, with at least 1 attack is made,
 *                         that deals no damage
 * onAttackBlocked      - resolves when card is played, but fails to deal damage
 * &&& onDeckDiscard        - resolves when card is discarded from the deck
 * &&& onHandDiscarded      - resolves when card is discarded from the hand
 * &&& onDrawn              - resolves as soon as the card is drawn from the deck
 */
 // &&& field not yet implemented in the pipeline
 
 
/* Card Modifier Types
 * card-modifiers is an object which contains a bunch of functions which 
 * take 1 card, and return a "modifiers" object 
 * {"attack": int, "defense": int, "cost": int}, which are modifiers applied
 * to those stats.
 *
 * The CardModifier object contains several fields which may or may map to
 * either a game_script_id or undefined. Different fields will be invoced at 
 * different times in card execution pipeline, and some fields will be invoked
 * against cards played by other characters while a card is active, others will
 * be invoked when a card is played.
 *
 * onNewCardPlayed      - a character's activeCard modifies a card just played 
 *                          (which will then replace the active card)
 * onResolved           - this function applies to the card itself as it is
 *                          resolved
 * onAttacked           - modifies a card resolved targeting the controlling 
 *                          this card
 * 
 */