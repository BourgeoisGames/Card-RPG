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
    return that.data_model[type][tid];
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

  game_controller.run_script = function (ref, args) {
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

  exports.default = game_controller;
});
define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {}
});
define('views/gameview',["exports", "../game_logic/engine"], function (exports, _engine) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.gameview = undefined;

	var _engine2 = _interopRequireDefault(_engine);

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

	var yuri = "https://vignette.wikia.nocookie.net/doki-doki-literature-club/images/7/72/Yuri_school_1.png/revision/latest?cb=20171112095243";
	var yuri2 = "https://vignette.wikia.nocookie.net/doki-doki-literature-club/images/1/19/Yurifull1.png/revision/latest?cb=20171203145750";
	var yuri3 = "https://cdn140.picsart.com/251511791012212.png?r240x240";
	var classroom = "https://vignette.wikia.nocookie.net/doki-doki-literature-club/images/8/87/Alt_classroom.jpeg/revision/latest?cb=20171211171811";
	var spiderweb = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuz8PqsGP11FE5pFLY72RpulXoUM9XHtWEMrAZy7T3IGbEd_bX";
	var bullying = "https://lparchive.org/Doki-Doki-Literature-Club/Update%2027/24-kJ6nlqg.gif";

	var rooms = [{
		message: "\"❤ Hi Player-san ❤\"",
		img: yuri,
		background: classroom
	}, {
		message: "\"❤ I was hoping I'd get a chance to see you here ❤\""
	}, {
		message: "\"... but ...\""
	}, {
		message: "\"...\""
	}, {
		message: "\"The falling stars you wished upon\""
	}, {
		message: "\"are cinders now, and now they're gone\""
	}, {
		message: "\"their residue festoons my fetid fields.\"",
		background: spiderweb
	}, {
		message: "\"The withered husks of lovers past\""
	}, {
		message: "\"the shells are all that ever last\""
	}, {
		message: "\"I've taken everything that they've concealed.\""
	}, {
		message: "\"...\"",
		img: yuri2
	}, {
		message: "\"Who ever told you life was fair?\"",
		img: yuri3
	}, {
		message: "Say no to bullying",
		img: null,
		background: bullying
	}];

	var newroom = function newroom(gc, args) {
		var room = gc.state.data.rooms.shift();
		if (!room) {
			return 1;
		}
		Object.keys(room).forEach(function (x) {
			gc.state.data.room[x] = room[x];
		});
	};
	_engine2.default.add_script({ "id": "newroom", "script": newroom });
	_engine2.default.add_trigger({ "trigger_id": "click_to_next", "signal_id": "click", "script_reference": { "id": "newroom", "args": {} } });

	var gameview = exports.gameview = function gameview() {
		_classCallCheck(this, gameview);

		this.game = _engine2.default;
		this.game_state = _engine2.default.state.data;
		this.send_click = function () {
			this.game.trigger('click', {});
		};
		_engine2.default.state.data.rooms = rooms;
		_engine2.default.state.data.room = {};
		_engine2.default.trigger("click", {});
	};
});
define('text!app.html', ['module'], function(module) { module.exports = "<template><link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css\" integrity=\"sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u\" crossorigin=\"anonymous\"><script src=\"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js\"></script><require from=\"./views/gameview\"></require><div class=\"container\"><div class=\"jumbotron row\"><img class=\"col-sm-1\" src=\"${flame_img_url}\"><h1 class=\"col-sm-10\" style=\"text-align:center\">Welcome Hero</h1><img class=\"col-sm-1\" src=\"${flame_img_url}\"></div></div><div><gameview></gameview></div></template>"; });
define('text!views/gameview.html', ['module'], function(module) { module.exports = "<template><require from=\"./roomview.html\"></require><div click.trigger=\"send_click()\" style=\"text-align:center\"><roomview room.bind=\"game_state.room\"></roomview></div></template>"; });
define('text!views/roomview.html', ['module'], function(module) { module.exports = "<template bindable=\"room\"><div class=\"container\" style=\"background-color:gray;padding:10px 5px 5px 25px;border:3px outset pink;color:pink;border-radius:15px\"><div class=\"row\"><div class=\"col-md-8\" style=\"background-image:url(${room.background});background-size:cover;text-align:center;border:3px outset pink;color:pink;border-radius:15px\"><img src=\"${room.img}\" style=\"height:400px\"></div></div><div class=\"row\"><h2 class=\"col-md-6 offset-md-4\">${room.message}</h2></div></div></template>"; });
//# sourceMappingURL=app-bundle.js.map