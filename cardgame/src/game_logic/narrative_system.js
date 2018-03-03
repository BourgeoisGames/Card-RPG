var set_room = function(gc,args) {
	if (gc.state.data.skill_event){
		return 1;
	}
	var room_id = args.room_id
	var room = gc.get_by_type_and_id("room",room_id);
	if (!room) {return 1;}
	Object.keys(room).forEach(function(x){
		gc.state.data.room[x] = room[x];
	});
	if (room.script) {
		gc.run_script(room.script);
	}
};

var next_room = function(gc,args) {
	if (!gc.state.data.room) {return 1;}
	var room_id = gc.state.data.room.next;//shift();
	if (!room_id) {return 1}
	gc.run_script({"id":"set_room","args":{"room_id":room_id}});
};

export default game => {
game.add_script({"id":"next_room","script":next_room});
game.add_script({"id":"set_room","script":set_room});
game.add_trigger({"trigger_id":"click_to_next", "signal_id":"click", "script_reference":{"id":"next_room","args":{}}});
}
