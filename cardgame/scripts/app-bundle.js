define('app',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var App = exports.App = function App() {
    _classCallCheck(this, App);

    this.flame_img_url = "https://media.giphy.com/media/fly1dGJ5CekcU/giphy.gif";
  };
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('main',['exports', './environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function configure(aurelia) {
    aurelia.use.standardConfiguration().feature('resources');

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }
});
define('scriptinjector',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.scriptinjector = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _dec3, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3;

  var scriptinjector = exports.scriptinjector = (_dec = (0, _aureliaFramework.noView)(), _dec2 = (0, _aureliaFramework.customElement)('scriptinjector'), _dec3 = (0, _aureliaFramework.bindable)({ defaultBindingMode: _aureliaFramework.bindingMode.oneWay }), _dec(_class = _dec2(_class = (_class2 = function () {
    function scriptinjector() {
      _classCallCheck(this, scriptinjector);

      _initDefineProp(this, 'url', _descriptor, this);

      _initDefineProp(this, 'isAsync', _descriptor2, this);

      _initDefineProp(this, 'scripttag', _descriptor3, this);
    }

    scriptinjector.prototype.attached = function attached() {
      if (this.url) {
        this.scripttag = document.createElement('script');
        if (this.isAsync) {
          this.scripttag.async = true;
        }
        this.scripttag.setAttribute('src', this.url);
        document.body.appendChild(this.scripttag);
      }
    };

    scriptinjector.prototype.detached = function detached() {
      if (this.scripttag) {
        this.scripttag.remove();
      }
    };

    return scriptinjector;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'url', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'isAsync', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'scripttag', [_dec3], {
    enumerable: true,
    initializer: null
  })), _class2)) || _class) || _class);
});
define('game_logic/engine',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var is_type = function is_type(x, y) {
    return x !== undefined && (typeof x === "undefined" ? "undefined" : _typeof(x)) == y;
  };
  var is_array = function is_array(x) {
    return Array.isArray(x);
  };
  var is_type_array = function is_type_array(x, y) {
    return is_array(x) && x.every(function (e) {
      return is_type(e, y);
    });
  };
  var is_object_type_array = function is_object_type_array(x, y) {
    return is_array(x) && x.every(y);
  };
  var is_union_type = function is_union_type(x, y) {
    return is_type_array(y, "string") && y.some(function (e) {
      return is_type(x, e);
    });
  };
  var is_primitive = function is_primitive(x) {
    return is_union_type(x, ["string", "number", "boolean"]) || is_object_type_array(x, is_primitive);
  };
  var is_datum = function is_datum(x) {
    return is_primitive(x) || is_data_object(x) || is_object_type_array(is_data_object);
  };
  var is_data_pair = function is_data_pair(x) {
    return is_array(x) && is_type(x[0], "string") && is_datum(x[1]);
  };
  var is_data_object = function is_data_object(x) {
    return is_type(x, "object") && Object.entries(x).every(is_data_pair);
  };
  var is_value = function is_value(x, y) {
    return x == y;
  };

  var copy = function copy(x) {
    return JSON.parse(JSON.stringify(x));
  };

  var is_event = function is_event(x) {
    return is_data_object(x) && is_type(x.event_id, "string") && is_type(x.data, "object");
  };

  var is_script_reference = function is_script_reference(x) {
    return is_type(x, "object") && is_type(x.id, "string") && is_type(x.args, "object");
  };

  var is_executable = function is_executable(x) {
    return is_type(x, "object") && is_object_type_array(x.scripts, is_script_reference);
  };

  var is_script = function is_script(x) {
    return is_type(x, "object") && is_type(x.id, "string") && is_type(x.script, "function");
  };

  var is_trigger_list = function is_trigger_list(x) {
    return is_type_array(x, "string");
  };

  var game_data_model = {};
  game_data_model.scripts = { schema: is_script, data: {} };
  game_data_model.data = {};

  var game_controller = {};
  game_controller.state = {
    "interrupted": false,
    "script_stack": [],
    "triggers": {},
    "signals": {},
    "data": {}
  };
  game_controller.data_model = game_data_model;

  game_controller.add_trigger = function (x) {
    var that = this;
    that.state.triggers[x.trigger_id] = { "signal_id": x.signal_id, "script_reference": x.script_reference };
    if (!that.state.signals[x.signal_id]) {
      that.state.signals[x.signal_id] = [];
    }
    that.state.signals[x.signal_id].push(x.trigger_id);
  };

  game_controller.remove_trigger = function (x) {
    var that = this;
    var arr = that.state.signals[that.state.triggers[x].signal_id];
    var index = arr.indexOf(x);
    if (index !== -1) arr.splice(index, 1);
    that.state.triggers[x] = undefined;
  };

  game_controller.add_script = function (x) {
    var that = this;that.data_model.scripts.data[x.id] = x;
  };

  game_controller.validate_game_data = function () {
    var that = this.data_model;
    var bad_data = {};
    Object.entries(that).forEach(function (obj_type) {
      var bad_instances = [];
      var type_id = obj_type[0];
      var schema = obj_type[1].schema;
      if (!schema) {
        return 1;
      }
      Object.entries(obj_type[1].data).forEach(function (objl) {
        var obj = objl[1];
        if (!schema(obj)) {
          bad_instances.push(obj);
        }
      });
      if (bad_instances.length > 0) {
        bad_data[type_id] = bad_instances;
      }
    });
    return bad_data;
  };

  game_controller.get_by_type_and_id = function (type, tid) {
    var that = this;
    var cop = copy(that.data_model.data[type][tid]);
    cop.id = tid;
    return cop;
  };

  game_controller.get_by_type_and_ids = function (type, tids) {
    var that = this;
    return tids.map(function (x) {
      return that.get_by_type_and_id(type, x);
    });
  };

  game_controller.get_script = function (sid) {
    var that = this;
    return that.data_model.scripts.data[sid];
  };

  game_controller.get_triggers = function (tid) {
    var that = this;
    var ans = that.state.signals[tid];
    if (ans) {
      return ans;
    }
    return [];
  };

  game_controller.handle_error = function (err) {
    console.log(err);
  };

  game_controller.run_script = function (ref) {
    var that = this;
    if (that.interrupted) {
      return 1;
    }
    var full_args = copy(ref.args);
    var sc = that.get_script(ref.id).script;

    return sc(that, full_args);
  };

  game_controller.halt_stack = function (tid) {
    var that = this;
    return that.interrupted = true;
  };

  game_controller.resume_stack = function (tid) {
    var that = this;
    return copy(that.state.signals[tid]);
  };

  game_controller.clear_stack = function (tid) {
    var that = this;
    return copy(that.state.signals[tid]);
  };

  game_controller.trigger = function (signal_id, args) {
    var that = this;
    that.state.interrupted = false;
    that.get_triggers(signal_id).forEach(function (tid) {
      var tr = copy(that.state.triggers[tid]);
      var ref = tr.script_reference;
      ref.args.trigger_args = copy(args);
      that.run_script(ref);
    });

    that.interrupted = false;
  };

  game_controller.add_scripts = function (obj) {
    var that = this;
    Object.keys(obj).forEach(function (script_id) {
      var script = obj[script_id];
      that.add_script({ "id": script_id, "script": script });
    });
  };

  exports.default = game_controller;
});
define('game_logic/init_game',["exports", "./engine", "./skill_system", "./narrative_system", "./init_state"], function (exports, _engine, _skill_system, _narrative_system, _init_state) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _engine2 = _interopRequireDefault(_engine);

  var _skill_system2 = _interopRequireDefault(_skill_system);

  var _narrative_system2 = _interopRequireDefault(_narrative_system);

  var _init_state2 = _interopRequireDefault(_init_state);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  (0, _skill_system2.default)(_engine2.default);

  (0, _narrative_system2.default)(_engine2.default);

  (0, _init_state2.default)(_engine2.default);

  exports.default = _engine2.default;
});
define('game_logic/init_state',["exports"], function (exports) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var yuri = "https://vignette.wikia.nocookie.net/doki-doki-literature-club/images/7/72/Yuri_school_1.png/revision/latest?cb=20171112095243";
	var yuri2 = "https://vignette.wikia.nocookie.net/doki-doki-literature-club/images/1/19/Yurifull1.png/revision/latest?cb=20171203145750";
	var yuri3 = "https://cdn140.picsart.com/251511791012212.png?r240x240";
	var classroom = "https://vignette.wikia.nocookie.net/doki-doki-literature-club/images/8/87/Alt_classroom.jpeg/revision/latest?cb=20171211171811";
	var spiderweb = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuz8PqsGP11FE5pFLY72RpulXoUM9XHtWEMrAZy7T3IGbEd_bX";
	var bullying = "https://lparchive.org/Doki-Doki-Literature-Club/Update%2027/24-kJ6nlqg.gif";
	var just_monika = "https://vignette.wikia.nocookie.net/galnet/images/f/f8/Vikax.png/revision/latest?cb=20130709221406";
	var treasure = "https://i.redditmedia.com/HwYQt93EgUAe8ao14otx6k2SErTDVoGh6ZzIFc-dEb0.jpg?w=768&s=6dbe34fe968f971b3f44642effc1434b";
	var swamp = "https://cdna.artstation.com/p/assets/images/images/002/879/742/large/marius-janusonis-4.jpg";
	var ruins_exterior = "https://img00.deviantart.net/8ca0/i/2012/288/1/f/forgotten_glory_by_jonasdero-d3jkcvy.jpg";
	var ruins_interior = "https://i.redditmedia.com/6qWKlYJin05ZvDkFaFpk6U34H41siyq5a3ji5Y4d6ho.jpg?w=1024&s=be2d3837db21c90d9eaa4a4351c908c5";
	var city = "https://i.redditmedia.com/T0-eQaOlaNXPRk4Jwr_2SNj1sW2OlPxYh4alr93WTGg.jpg?w=1024&s=9107f09f413a2ace411b773dbc8bde04";
	var trap = "https://www.wildwestmotorsportspark.com/wp-content/uploads/2016/03/rocks-foreground.png";
	var tavern = "https://cdna0.artstation.com/p/assets/images/images/003/187/064/large/aleksandra-mokrzycka-1-4.jpg?1470780461";
	var death = "https://cdnb.artstation.com/p/assets/images/images/000/612/163/large/vitor-hudson-5.jpg?1428526789";

	var sample_deck = ['fury', 'smash', 'endure', 'combat reflexes', 'charge', 'roar', 'grapple', 'smash', 'charge', 'endure', 'hunters eye', 'fury', 'smash', 'endure', 'combat reflexes', 'charge', 'roar', 'grapple', 'smash', 'charge', 'endure', 'hunters eye', 'fury', 'smash', 'endure', 'combat reflexes', 'charge', 'roar', 'grapple', 'smash', 'charge', 'endure', 'hunters eye'];

	var sample_cards = {
		"fury": {
			"img": just_monika,
			"name": "fury",
			"description": "Terrible stregth with purpose, but not thought",
			"damage": 5,
			"defense": -1,
			"cost": 2,
			"tags": ['menacing', 'quick', 'mighty', 'determined']
		},
		"smash": {
			"img": just_monika,
			"name": "smash",
			"description": "Crude, but effective",
			"damage": 3,
			"defense": 0,
			"cost": 2,
			"tags": ['mighty']
		},
		"endure": {
			"img": just_monika,
			"name": "endure",
			"description": "A body like iron, tempered in battle",
			"damage": 0,
			"defense": 1,
			"cost": 0,
			"tags": ['mighty', 'determined']
		},
		"combat reflexes": {
			"img": just_monika,
			"name": "combat reflexes",
			"description": "A mixture of instinct and experience",
			"damage": 0,
			"defense": 1,
			"cost": 0,
			"tags": ['quick']
		},
		"charge": {
			"img": just_monika,
			"name": "charge",
			"description": "Flashing forth like lightning; closing the distance",
			"damage": 3,
			"defense": 0,
			"cost": 2,
			"tags": ['mighty', 'quick', 'menacing']
		},
		"roar": {
			"img": just_monika,
			"name": "war cry",
			"description": "BLOOD! DEATH! AND VENGENCE!!!",
			"damage": 0,
			"defense": 1,
			"cost": 1,
			"tags": ['menacing', 'determined']
		},
		"grapple": {
			"img": just_monika,
			"name": "grapple",
			"description": "Close enough to feel their breath",
			"damage": 1,
			"defense": 0,
			"cost": 4,
			"tags": ['mighty', 'cunning']
		},
		"hunters eye": {
			"img": just_monika,
			"name": "hunter\'s eye",
			"description": "Senses as sharp and the blades they guide",
			"damage": 0,
			"defense": 0,
			"cost": 1,
			"tags": ['quick', 'cunning']
		}
	};

	var rooms = {
		"1": {
			"next": 2,
			"message": "\"❤ Hi Player-san ❤\"",
			"img": yuri,
			"background": classroom
		},
		"2": {
			"next": 3,
			"message": "\"❤ I was hoping I'd get a chance to see you here ❤\""
		},
		"3": {
			"next": 4,
			"message": "\"... but ...\""
		},
		"4": {
			"next": 5,
			"message": "\"...\""
		},
		"5": {
			"next": 6,
			"message": "\"The falling stars you wished upon\""
		},
		"6": {
			"next": 7,
			"message": "\"are cinders now, and now they're gone\""
		},
		"7": {
			"next": 8,
			"message": "\"their residue festoons my fetid fields.\"",
			"background": spiderweb
		},
		"8": {
			"next": 9,
			"message": "\"The withered husks of lovers past\""
		},
		"9": {
			"next": 10,
			"message": "\"the shells are all that ever last\""
		},
		"10": {
			"next": 11,
			"message": "\"I've taken everything that they've concealed.\""
		},
		"11": {
			"next": 12,
			"message": "\"...\"",
			"img": yuri2
		},
		"12": {
			"next": 13,
			"message": "\"Who ever told you life was fair?\"",
			"img": yuri3
		},
		"13": {
			"next": 1,
			"message": "Say no to bullying",
			"img": bullying,
			"background": null
		},
		"journey1": {
			"next": "journey2",
			"message": "With the map you aquired yesterday as a guide, you set off",
			"background": swamp
		},
		"journey2": {
			"next": "journey3",
			"message": "The southern swaps have never made for a pleasant journey, with flies biting at your ears and neck at every opportunity, and the smell of the marsh in the air"
		},
		"journey3": {
			"next": "arival1",
			"message": "But no matter, in time..."
		},
		"arival1": {
			"next": "arival2",
			"message": "...you arive",
			"background": ruins_exterior
		},
		"arival2": {
			"next": "arival3",
			"message": "The lost city of Leauver"
		},
		"arival3": {
			"next": "arival4",
			"message": "To the acedemics, this is proof the Outremeri made it this far north"
		},
		"arival4": {
			"next": "inside1",
			"message": "To you, it is an inviting promise of ancient treasure"
		},
		"inside1": {
			"next": "inside2",
			"message": "You make your way inside, to find a temple sanctuary chamber still standing after all these years",
			"background": ruins_interior
		},
		"inside2": {
			"next": "inside3",
			"message": "By the alter you find what you're looking for"
		},
		"inside3": {
			"next": "trap1",
			"message": "\"This should fetch a good price back in town\", you think to yourself, as you place it in your pack",
			"background": treasure
		},
		"trap1": {
			"next": "trap2",
			"message": "Just then, the arch supporting the entryway collapses, and rocks begin to tumble down from above",
			"img": trap,
			"background": ruins_interior
		},
		"trap2": {
			"next": "trap3",
			"message": "Your eyes dart from the rubble in the entrance that blocks your escape, to the newly opened hole in the cieling"
		},
		"trap3": {
			"next": "trap_skill1",
			"message": "You climb over rocks and fallen marble as quickly as you can before the rest of the roof caves in and crushed you underneath"
		},
		"trap_skill1": {
			"next": null,
			"message": null,
			"img": null,
			"background": null,
			"script": { "id": "do_skill_event", "args": { "skill_event": { "skill_test": { "description": "You climb over rocks and fallen marble as quickly as you can before the rest of the roof caves in and crushes you underneath",
							"components": [{ "tag": "quick", "level": "medium" }, { "tag": "mighty", "level": "easy" }]
						},
						"outcomes": { 0: { "id": "set_room", "args": { "room_id": "beat_trap1" } },
							"fail": { "id": "set_room", "args": { "room_id": "fail_trap1" } } }
					}
				}
			}
		},
		"fail_trap1": {
			"next": null,
			"message": "\"Your time has come, child\"",
			"background": death
		},
		"beat_trap1": {
			"next": "winning1",
			"message": "You scramble out just in time, and decide to head back to town with your new prize",
			"background": ruins_exterior
		},
		"winning1": {
			"next": "winning2",
			"message": "Somehow the swamp almost seems friendly on your way back, perhaps because you have wealth and triumph on your mind",
			"background": swamp
		},
		"winning2": {
			"next": "winning3",
			"message": "Ah, there it is: Breinhelm; home sweet home.",
			"background": city
		},
		"winning3": {
			"next": "winning4",
			"message": "Sure enough, you manage to sell off that Outremeri artifact you found for 250 stones of silver"
		},
		"winning4": {
			"next": "winning5",
			"message": "You go to the pub to celebrate",
			"background": tavern
		},
		"winning5": {
			"message": "\"Drinks are on me tonight lads! You can thank the Outremeri\""
		}
	};

	var init_state = function init_state(x) {
		var state = x.state.data;
		var model = x.data_model.data;
		model.room = rooms;
		state.room = x.get_by_type_and_id("room", "journey1");
		state.player = {};
		state.player.deck = sample_deck;
		model.card = sample_cards;
	};

	exports.default = init_state;
});
define('game_logic/narrative_system',["exports"], function (exports) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var set_room = function set_room(gc, args) {
		if (gc.state.data.skill_event) {
			return 1;
		}
		var room_id = args.room_id;
		var room = gc.get_by_type_and_id("room", room_id);
		if (!room) {
			return 1;
		}
		Object.keys(room).forEach(function (x) {
			gc.state.data.room[x] = room[x];
		});
		if (room.script) {
			gc.run_script(room.script);
		}
	};

	var next_room = function next_room(gc, args) {
		if (!gc.state.data.room) {
			return 1;
		}
		var room_id = gc.state.data.room.next;
		if (!room_id) {
			return 1;
		}
		gc.run_script({ "id": "set_room", "args": { "room_id": room_id } });
	};

	exports.default = function (game) {
		game.add_script({ "id": "next_room", "script": next_room });
		game.add_script({ "id": "set_room", "script": set_room });
		game.add_trigger({ "trigger_id": "click_to_next", "signal_id": "click", "script_reference": { "id": "next_room", "args": {} } });
	};
});
define('game_logic/skill_system',["exports"], function (exports) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var copy = function copy(x) {
		return JSON.parse(JSON.stringify(x));
	};
	function shuffle(array_in) {
		var array = copy(array_in);
		for (var i = array.length - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			var temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}
		return array;
	};
	function remove_value(arr, value) {
		var index = arr.indexOf(value);
		if (index >= 0) {
			arr.splice(index, 1);
		}
	}
	var pick = function pick(x) {
		return x[Math.floor(Math.random() * x.length)];
	};

	var skill_test_levels = {
		"easy": {
			"name": "normal",
			"description": "It will take effort, but no great skill",
			"distribution": [0, 1, 1, 2],
			"num_cards_to_draw": 4
		},
		"medium": {
			"name": "expert",
			"description": "A chance to demonstrate your expertise",
			"distribution": [1, 2, 2, 3],
			"num_cards_to_draw": 5
		},
		"hard": {
			"name": "masterful",
			"description": "A daunting barrier in your path, or a story to tell when you're done",
			"distribution": [2, 3, 4, 4],
			"num_cards_to_draw": 6
		},
		"random": {
			"name": "unknown",
			"description": "Feeling lucky?",
			"distribution": [0, 1, 2, 3, 4],
			"num_cards_to_draw": 6
		}
	};

	var get_card = function get_card(gc, cid) {
		return gc.get_by_type_and_id('card', cid);
	};

	var get_deck = function get_deck(gc) {
		return copy(gc.state.data.player.deck);
	};

	var get_skill_test_level = function get_skill_test_level(lid) {
		return copy(skill_test_levels[lid]);
	};

	var draw_skill_test_hand = function draw_skill_test_hand(gc, skill_test) {
		var deck = get_deck(gc);
		var shuffled = shuffle(deck);
		var components = copy(skill_test.components);
		var counts = {};
		components.forEach(function (e) {
			counts[e.tag] = get_skill_test_level(e.level).num_cards_to_draw;
		});
		var hand = [];
		shuffled.forEach(function (cid) {
			var card = get_card(gc, cid);
			var tag = null;
			card.tags.forEach(function (e) {
				if (counts[e]) {
					tag = e;
				}
			});
			if (tag) {
				counts[tag] -= 1;
				hand.push(cid);
			}
		});
		return hand;
	};

	var generate_skill_test_dcs = function generate_skill_test_dcs(skill_test) {
		var components = copy(skill_test.components);
		var dcs = {};
		components.forEach(function (e) {
			dcs[e.tag] = pick(get_skill_test_level(e.level).distribution);
		});
		return dcs;
	};

	var get_score_result = function get_score_result(dcs, scores) {
		var result = 0;
		var leftover = 0;
		Object.keys(dcs).forEach(function (e) {
			var score = scores[e];
			if (!score) score = 0;
			var dc = dcs[e];
			if (score <= dc) {
				result += score - dc;
			} else {
				leftover += score - dc;
			}
		});
		result += Math.floor(leftover / 2);
		return result;
	};

	var get_scores = function get_scores(gc, cids) {
		var scores = {};
		cids.forEach(function (cid) {
			var card = get_card(gc, cid);
			card.tags.forEach(function (tag) {
				if (scores[tag]) {
					scores[tag] += 1;
				} else {
					scores[tag] = 1;
				}
			});
		});
		return scores;
	};

	var get_skill_test_result = function get_skill_test_result(gc, cids, skill_test) {
		var scores = get_scores(gc, cids);
		var dcs = generate_skill_test_dcs(skill_test);
		var result = get_score_result(dcs, scores);

		return result;
	};

	var sample_skill_event = {
		"skill_test": {},
		"outcomes": {
			1: { "id": "newroom", "args": {} }
		}
	};

	var resolve_skill_test = function resolve_skill_test(gc, args) {
		var cids = args.trigger_args.cards;
		var skill_event = gc.state.data.skill_event;
		var skill_test = skill_event.skill_test;
		var outcomes = skill_event.outcomes;
		var result = get_skill_test_result(gc, cids, skill_test);

		var outcome = -10000;
		Object.keys(outcomes).forEach(function (key) {
			var val = parseInt(key);

			if (!isNaN(val) && result >= val && val >= outcome) {
				outcome = val;
			}
		});

		if (!(outcome > -10000)) {
			outcome = "fail";
		}
		var ref = outcomes[outcome];

		gc.remove_trigger("played_cards_to_resolve_skill_event");
		gc.state.data.skill_event = undefined;
		gc.run_script(ref, {});
	};

	var do_skill_event = function do_skill_event(gc, args) {
		var skill_event = args.skill_event;
		gc.state.data.skill_event = skill_event;
		gc.state.data.player.hand = draw_skill_test_hand(gc, skill_event.skill_test);
		gc.add_trigger({
			"trigger_id": "played_cards_to_resolve_skill_event",
			"signal_id": "played_cards",
			"script_reference": { "id": "resolve_skill_test", "args": {} }
		});
	};

	var scripts = {
		"do_skill_event": do_skill_event,
		"resolve_skill_test": resolve_skill_test
	};

	exports.default = function (gc) {
		return gc.add_scripts(scripts);
	};
});
define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {}
});
define('views/gameview',["exports", "../game_logic/init_game"], function (exports, _init_game) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.gameview = undefined;

  var _init_game2 = _interopRequireDefault(_init_game);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var gameview = exports.gameview = function gameview() {
    _classCallCheck(this, gameview);

    this.send_click = function () {
      this.game.trigger('click', {});
    };
    this.game = _init_game2.default;
    this.game_state = _init_game2.default.state.data;
  };
});
define('views/skillview',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.skillview = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _desc, _value, _class, _descriptor;

  var remove_value = function remove_value(arr, value) {
    var index = arr.indexOf(value);
    if (index >= 0) {
      arr.splice(index, 1);
    }
  };

  var skillview = exports.skillview = (_class = function () {
    function skillview() {
      var _this = this;

      _classCallCheck(this, skillview);

      _initDefineProp(this, 'game', _descriptor, this);

      this.play_cards = function () {
        var that = this;
        that.game.trigger('played_cards', { "cards": that.cards });
      };
      this.select_card = function (card) {
        var that = _this;
        if (card.selected) {
          remove_value(that.cards, card.id);
          card.selected = false;
        } else {
          that.cards.push(card.id);
          card.selected = true;
        }
      };
      this.cards = [];
      this.hand = [];
    }

    skillview.prototype.bind = function bind() {
      this.hand = this.game.get_by_type_and_ids('card', this.game.state.data.player.hand);
      this.hand = this.hand.map(function (x) {
        var yy = x;
        yy.selected = false;
        return yy;
      });
    };

    return skillview;
  }(), (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'game', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return {};
    }
  })), _class);
  ;
});
define('text!app.html', ['module'], function(module) { module.exports = "<template><link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css\" integrity=\"sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u\" crossorigin=\"anonymous\"><script src=\"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js\"></script><require from=\"./views/gameview\"></require><div class=\"container\"><div class=\"jumbotron row\"><img class=\"col-sm-1\" src=\"${flame_img_url}\"><h1 class=\"col-sm-10\" style=\"text-align:center\">Welcome Hero</h1><img class=\"col-sm-1\" src=\"${flame_img_url}\"></div></div><div><gameview></gameview></div></template>"; });
define('text!views/gameview.html', ['module'], function(module) { module.exports = "<template><require from=\"./roomview.html\"></require><require from=\"./skillview\"></require><div click.trigger=\"send_click()\" style=\"text-align:center\"><roomview room.bind=\"game_state.room\" if.bind=\"!game_state.skill_event\"></roomview><skillview game.bind=\"game\" if.bind=\"game_state.skill_event\"></skillview></div></template>"; });
define('text!views/roomview.html', ['module'], function(module) { module.exports = "<template bindable=\"room\"><div class=\"container\" style=\"background-color:gray;padding:10px 5px 5px 25px;border:3px outset gold;color:gold;border-radius:15px\"><div class=\"row\"><div class=\"col-md-8\" style=\"background-image:url(${room.background});background-size:cover;text-align:center;padding:0\"><img src=\"${room.img}\" style=\"height:400px;width:100%;border:3px outset gold;color:gold\"></div></div><div class=\"row\"><h2 class=\"col-md-6 offset-md-4\">${room.message}</h2></div></div></template>"; });
define('text!views/skillview.html', ['module'], function(module) { module.exports = "<template bindable=\"game\"><div class=\"container\" style=\"background-color:gray;padding:25px 5px 5px 25px;border:3px outset gold;color:gold;border-radius:15px\"><div class=\"row\"><h3 class=\"col-sm-11\">${game.state.data.skill_event.skill_test.description}</h3></div><hr class=\"row\"><div class=\"row container\"><h4 class=\"row\">Challenges:</h4><div class=\"row\" repeat.for=\"challenge of game.state.data.skill_event.skill_test.components\" style=\"border:2px outset gold;background-color:#a9a9a9;margin-right:15px\"><h3 class=\"col-md-5\">${challenge.tag}</h3><h3 class=\"col-md-5\">${challenge.level}</h3></div></div><hr class=\"row\"><div class=\"row\"><h4 style=\"color:#fff\" class=\"col-md-6 offset-md-4\">Select cards to use:</h4></div><div class=\"row\"><div class=\"col-md-2 container\" style=\"padding:10px;border:2px outset gold;border-radius:15px;background-color:#d3d3d3;color:#b8860b\" repeat.for=\"card of hand\" click.trigger=\"select_card(card)\"><h5 class=\"row\" style=\"color:green\" if.bind=\"card.selected\">&lt Selected &gt</h5><h4 class=\"row\">${card.name}</h4><img class=\"row\" src=\"${card.img}\" style=\"width:100px;border:1px outset gold;background-color:#fff\"><p class=\"row\">${card.description}</p><hr class=\"row\"><div class=\"row\"><span class=\"col-sm-6\" repeat.for=\"tag of card.tags\" style=\"color:#000;border:1px outset #000;border-radius:15px;background-color:#add8e6\">${tag}</span></div></div></div><hr class=\"row\"><div class=\"row\"><h2 class=\"col-md-4\" click.trigger=\"play_cards()\" style=\"background-color:#add8e6;border:4px outset #d3d3d3;border-radius:10px\">Play Selected Cards</h2></div></div></template>"; });
//# sourceMappingURL=app-bundle.js.map