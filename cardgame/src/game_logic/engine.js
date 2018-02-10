//some utilities

//alert("hell");

var is_type = (x, y) => (x !== undefined) && (typeof x == y); //check if primitive fields are the correct primitive
var is_array = x => Array.isArray(x);
var is_type_array = (x,y) => is_array(x) && x.every(e => is_type(e,y));
var is_object_type_array = (x,y) => is_array(x) && x.every(y);
var is_union_type = (x,y) => is_type_array(y,"string") && y.some(e => is_type(x,e));
var is_primitive = x => is_union_type(x,["string","number","boolean"]) || is_object_type_array(x,is_primitive);
var is_datum = x => is_primitive(x) || is_data_object(x) || is_object_type_array(is_data_object);
var is_data_pair = x => is_array(x) && is_type(x[0],"string") && is_datum(x[1]);
var is_data_object = x => is_type(x,"object") && Object.entries(x).every(is_data_pair);
var is_value = (x,y) => x == y;

var copy = x => JSON.parse(JSON.stringify(x));

//the meat

var is_event = x => is_data_object(x) && is_type(x.event_id,"string") && is_type(x.data,"object");//data is mutable, and used to store whatever the dickens

//var is_display_data = x => is_type(x.display_id,"string") && is_type(x.args,"object");

//var is_displayable = x => is_display_data(x.display_data);

var is_script_reference = x => is_type(x,"object") && is_type(x.id, "string") && is_type(x.args,"object");

var is_executable = x => is_type(x,"object") && is_object_type_array(x.scripts,is_script_reference);

var is_script = x => is_type(x,"object") && is_type(x.id,"string") && is_type(x.script,"function"); //should take in a game state object, an arguments object, and 

//var is_trigger = x => is_data_object(x) && is_type(x,"object") && is_type(x.signal_id,"string") && is_script_reference(x.id);

var is_trigger_list = x => is_type_array(x,"string");//eventids

//is_message_event = x => is_event(x) && is_value(x.event_type,"message") && is_type(x.event_data.message, "string");

//is_messages_event = x => is_event(x) && is_value(x.event_type,"messages") && is_type_array(x.event_data.messages, "string");

//test_message_event = {message: "my heart is pounding!"};

//test_messages_event = {messages: ["my heart is pounding!","I slice the bread, and feed myself again"]};

//test_script_event = {script_id: "the epiphony", args: {"reality":false, "love":"player-kun", "yandere_score":Number.MAX_VALUE}};

//test_bad_script_event = {script_id: "sayori's room", args: {"reaction": w => (x => x(x))((x => x(x)))}};

var game_data_model = {};//this is loaded, and then static, and should NEVER mutate
//game_data_model.triggers = {schema:is_trigger_list,data:{}};//triggers WILL CHANGE
//game_data_model.events = {schema:is_event,data:{}};
game_data_model.scripts = {schema:is_script,data:{}};
game_data_model.data = {};

//sig = {"signal_id":"dialogue_option_1", "data":{"bullying":false}};//this is from aurelia, and gets sent to the game_controller

//quetzalcuatl = {"signal_id":"dialogue_option_1", "event_id":"player_rejects_confession"}//triggers have data too;

//tezcotlipoca = {"event_id":"player_accepts_confession", "data":{"sayori's heart":"broken"}} //if no scripts apply; is_event -> true

//xochiquetzal = {"event_id":"player_accepts_confession", "data":{"sayori's heart":"broken"}, "scripts":[xipe]}//is_event -> true; is_executable -> true

//{"sayori's heart":"broken", "trigger_data":{"bullying":false}}

//xipe = {"id":"sayori's room", "args":{"items":["rope","tears"]}}

//

//tlazal = {id:"sayori's room", script:w => (x => x(x))((x => x(x)))}

//w => (x => x(x))((x => x(x))) //kill yourself

//////////////////////////////////
var game_controller = {};
game_controller.state = {
  "interrupted":false,
  "script_stack":[],
  "triggers":{},//trigger_id, script_id
  "signals":{},//signal_id, [trigger_ids]
  "data":{}
};//require("./game_state_prototype.json"); //this is the only non-temporary, mutable object in the game!!!
game_controller.data_model = game_data_model;//never touch this directly

game_controller.add_trigger = function(x){//x = {trigger_id:"", signal_id:"", script_reference:{some script reference}}
  var that = this; 
  that.state.triggers[x.trigger_id] = {"signal_id":x.signal_id, "script_reference":x.script_reference};
  if(!that.state.signals[x.signal_id]){that.state.signals[x.signal_id] = [];}
  that.state.signals[x.signal_id].push(x.trigger_id);
};

game_controller.remove_trigger = function(x){
  var that = this; 
  var arr = that.state.signals[that.state.triggers[x].signal_id]
  var index = arr.indexOf(x);
  if (index !== -1) arr.splice(index, 1);
  that.state.triggers[x] = undefined;
};
//game_controller.add_game_event = function(x){var that = this.data_model; that.events.data[x.event_id] = x;};
game_controller.add_script = function(x){var that = this; that.data_model.scripts.data[x.id] = x;};

game_controller.validate_game_data = function(){
  var that = this.data_model;
  var bad_data = {};
  Object.entries(that).forEach(function(obj_type){
    var bad_instances = [];
    var type_id = obj_type[0];
    var schema = obj_type[1].schema;
    if (!schema) {return 1;}
    Object.entries(obj_type[1].data).forEach(function(objl){
      var obj = objl[1]
      if(!schema(obj)){
        bad_instances.push(obj);
      }
    });
    if(bad_instances.length > 0){
      bad_data[type_id] = bad_instances;
    }
  });
  return bad_data
};

game_controller.get_by_type_and_id = function(type,tid){
  var that = this;
  return that.data_model[type][tid];
};

game_controller.get_script = function(sid){
  var that = this;
  return that.data_model.scripts.data[sid];
};



/*game_controller.get_event = function(eid){
  var that = this;
  return copy(that.get_by_type_and_id("events",eid));
};*/

game_controller.get_triggers = function(tid){
  var that = this;
  var ans = that.state.signals[tid];
  if (ans) {return ans;}
  return [];
};

game_controller.handle_error = function(err){
  console.log(err);
};

game_controller.run_script = function(ref, args){//takes a script reference and list of arguments
  var that = this;
  if (that.interrupted) {return 1;}
  var full_args = copy(ref.args)
  var sc = that.get_script(ref.id).script;
  
  return sc(that,full_args);
};

game_controller.halt_stack = function(tid){
  var that = this;
  return that.interrupted = true;
};

game_controller.resume_stack = function(tid){
  var that = this;
  return copy(that.state.signals[tid]);
};

game_controller.clear_stack = function(tid){
  var that = this;
  return copy(that.state.signals[tid]);
};

/*game_controller.execute_script = function(sid, args){
  var that = this;
  that.get_script(sid)(that,args);
};

game_controller.push_event = function(eid,data_obj){
  var that = this;
  var ev = that.get_event(eid)(that.state,args);
  ev.data.call_data = data_obj;
  that.state.event_stack.push(ev);
};

game_controller.create_and_push_event = function(ev){//this is weird
  var that = this;
  that.state.event_stack.push(ev);
};

game_controller.end_event = function(){//do not use!!
  var that = this;
  var ev = that.state.event_stack.pop();
  that.state.current_event = ev;
};*/

/*game_controller.execute_event = function(){//never use
  var that = this;
  var ev = that.state.current_event;
  var unloaded = !ev;
  if(ev && is_executable(ev)){
    ev.scripts.forEach(function (scr){
      var args2 = clone(src.args)
      args2.event_data = ev.data
      args2.trigger_data = ev.trigger_data
      that.execute_script(src.id, args2);
    });
  }
  that.end_event();
  if(unloaded){
    that.execute_event;
  }
};*/

/*game_controller.execute_event_stack = function(){//use this instead
  var that = this;
  that.execute_event();
  var ev = !that.state.current_event;
  if(!ev){
    that.execute_event();
  }
  ev = !that.state.current_event;
  if(ev){
    that.execute_event_stack();
  }
};*/

game_controller.trigger = function(signal_id,args){
  var that = this;
  that.state.interrupted = false;
  that.get_triggers(signal_id).forEach(function(tid){
    var tr = copy(that.state.triggers[tid]);
    var ref = tr.script_reference;
    ref.args.trigger_args = copy(args)
    that.run_script(ref);
  });

  that.interrupted = false;
};

export default game_controller;

//document.write("asdsaaf");

//module.exports = game_controller;