

var game_data_model = {};
game_data_model.triggers = {schema:is_trigger_list,data:{}};
game_data_model.events = {schema:is_event,data:{}};
game_data_model.game_scripts = {schema:is_game_script,data:{}};

var game_controller = {};
game_controller.state = require("./game_state_prototype.json");
game_controller.data_model = game_data_model;

game_controller.add_game_trigger = function(x){};
game_controller.add_game_event = function(x){};
game_controller.add_game_script = function(x){};

game_controller.validate_game_data = function(){
  return {}
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
