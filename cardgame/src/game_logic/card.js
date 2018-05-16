
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
 * onPlayCard               - resolves as soon as the card is played <args: {target, actor}>
 * &&& onCardPlayedAgainst      - resolves as soon as the card is played
 * onCardResolved           - resolves while the card is resolving <args: {target, actor}>
 * onCardResolvedAgainst    - resolves while the card is resolving <args: {target, actor}>
 * onRemovedFromActive      - resolves when the card is replaced by another card as
 *                              your active card <args: {target, actor}>
 * onAttacked               - resolves when an attack is made, while this card is 
 *                              active <args: {target, actor}>
 * onDealsDamage            - resolves when this card is resolved, and successfully 
 *                              deals damage <args: {target, actor}>
 * onDamaged                - resolves when another card resolves, while this card is 
 *                              active, which deals damage. <args: {target, actor}>
 * onBlocksAttack           - resolves when an attack, with at least 1 attack is made,
 *                              that deals no damage <args: {target, actor}>
 * onAttackBlocked          - resolves when card is played, but fails to deal damage 
 *                              <args: {target, actor}>
 * onDiscarded              - resolves as soon as the card is added to the discard
 * onRemovedFromHand        - resolves as soon as the card is removed from the hand.
 * onDrawn                  - resolves as soon as the card is drawn from the deck
 * onStartRound
 * onSidelined				- 
 * &&& onOpponentDraws          - resolves as soon as the card is drawn from the deck
 */
 // &&& field not yet implemented in the pipeline
 
 

/* Status Effect Hooks
 * onCardPlayedAgainst             - resolves as soon as a card is played against the character
 * status_onPlayCard               - resolves as soon as the card is played
 * status_onCardPlayedAgainst      - resolves as soon as the card is played
 * status_onCardResolved           - resolves while the card is resolving
 * status_onCardResolvedAgainst    - resolves while the card is resolving
 * status_onRemovedFromActive      - resolves when the card is replaced by another card as
 *                             your active card
 * status_onAttacked               - resolves when an attack is made, while this card is 
 *                             active
 * status_onDealsDamage            - resolves when this card is resolved, and successfully 
 *                             deals damage
 * status_onDamaged                - resolves when another card resolves, while this card is 
 *                             active, which deals damage.
 * status_onBlocksAttack           - resolves when an attack, with at least 1 attack is made,
 *                             that deals no damage
 * status_onAttackBlocked          - resolves when card is played, but fails to deal damage
 * status_onDiscarded              - resolves as soon as the card is added to the discard
 * status_onRemovedFromHand        - resolves as soon as the card is removed from the hand.
 * status_onDrawCard               - resolves as soon as the card is drawn from the deck
 * status_onOpponentDraws          - resolves as soon as the card is drawn from the deck
 * status_onStartRound
 */
 // &&& field not yet implemented in the pipeline