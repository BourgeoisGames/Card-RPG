import game from "./engine"

import init_skill_system from "./skill_system"
init_skill_system(game);

import init_narrative_system from "./narrative_system"
init_narrative_system(game);

import init_state from "./init_state"
init_state(game);

export default game;