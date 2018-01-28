//some utilities

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

var force_push = function(x,y){
  if(is_array(x)){
    x.push(y)
  }
  else{
    x = [y]
  }
};
//the meat

var is_event = x => is_data_object(x) && is_type(x.event_id,"string") && is_type(x.data,"object");

var is_display_data = x => is_type(x.display_id,"string") && is_type(x.args,"object");

var is_displayable = x => is_display_data(x.display_data);

var is_game_script_reference = x => is_type(x,"object") && is_type(x.game_script_id, "string") && is_type(x.args,"object");

var is_executable = x => is_type(x,"object") && is_object_type_array(x.game_scripts,is_game_script_reference);

var is_game_script = x => is_type(x,"object") && is_type(x.game_script_id,"string") && is_type(x.script,"function"); //should take in a game state object, an arguments object, and 

//var is_trigger = x => is_data_object(x) && is_type(x,"object") && is_type(x.signal_id,"string") && is_game_script_reference(x.game_script_id);

var is_trigger_list = x => is_type_array("string");//eventids

//is_message_event = x => is_event(x) && is_value(x.event_type,"message") && is_type(x.event_data.message, "string");

//is_messages_event = x => is_event(x) && is_value(x.event_type,"messages") && is_type_array(x.event_data.messages, "string");

//test_message_event = {message: "my heart is pounding!"};

//test_messages_event = {messages: ["my heart is pounding!","I slice the bread, and feed myself again"]};

//test_script_event = {script_id: "the epiphony", args: {"reality":false, "love":"player-kun", "yandere_score":Number.MAX_VALUE}};

//test_bad_script_event = {script_id: "sayori's room", args: {"reaction": w => (x => x(x))((x => x(x)))}};


var game_data_model = {};
game_data_model.triggers = {schema:is_trigger_list,data:{}};
game_data_model.events = {schema:is_event,data:{}};
game_data_model.game_scripts = {schema:is_game_script,data:{}};

//////////////////////////////////
var game_controller = {};
game_controller.state = require("./game_state_prototype.json");
game_controller.data_model = game_data_model;

game_controller.add_game_trigger = function(x){var that = this.data_model; force_push(that.triggers.data[x.signal_id],x);};
game_controller.add_game_event = function(x){var that = this.data_model; that.events.data[x.event_id] = x;};
game_controller.add_game_script = function(x){var that = this.data_model; that.game_scripts.data[x.game_script_id] = x;};

game_controller.validate_game_data = function(){
  var that = this.data_model;
  var bad_data = {};
  Object.entries(that).forEach(function(obj_type){
    var bad_instances = [];
    var type_id = obj_type[0];
    var schema = obj_type[1].schema;
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
}

game_controller.get_script = function(sid){
  var that = this;
  return that.get_by_type_and_id("game_scripts",sid).script;
}

game_controller.get_event = function(eid){
  var that = this;
  return copy(that.get_by_type_and_id("events",eid));
}

game_controller.get_triggers = function(tid){
  var that = this;
  return copy(that.get_by_type_and_id("triggers",tid));
}

game_controller.handle_error = function(err){
  console.log(err);
}

game_controller.execute_script = function(sid, args){
  var that = this;
  that.get_script(sid)(that,args);
}

game_controller.push_event = function(eid){
  var that = this;
  var ev = that.get_event(eid)(that.state,args);
  that.state.event_stack.push(ev);
}

game_controller.create_and_push_event = function(ev){
  var that = this;
  that.state.event_stack.push(ev);
}

game_controller.end_event = function(){
  var that = this;
  var ev = that.state.event_stack.pop();
  that.state.current_event = ev;
}

game_controller.execute_event = function(){
  var that = this;
  var ev = that.state.current_event;
  var unloaded = !ev;
  if(ev && is_executable(ev)){
    ev.game_scripts.forEach(function (scr){
      var args2 = clone(src.args)
      args2.event_data = ev.data
      args2.trigger_data = ev.trigger_data
      that.execute_script(src.game_script_id, src.args);
    });
  }
  that.end_event();
  if(unloaded){
    that.execute_event;
  }
}

game_controller.execute_event_stack = function(){
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
}

game_controller.trigger = function(tid,args){
  var that = this;
  if(that.state.enabled_triggers[tid]){
    that.get_triggers(tid).forEach(function(eid){
      var ev = that.get_event(eid);
      ev.trigger_data = args;
      that.push_event(ev);
    });
    that.execute_event_stack();
  }
}



module.exports = game_controller;
