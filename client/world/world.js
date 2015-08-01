// TODO Important, create a sparce map class. This if(!map..) is super tedious.

(function() {
	var SLICE_SIZE = 100;       // sqrt of amount of tiles in a slice
	var map = {
		/* There is room for huge performance gains. Typed arrayes, grouping by color, tile etc.
		*/
		0: {
			0: 'blue',
			1: 'white',
			2: 'red'
		},
		1: {
			0: 'green',
			1: 'brown'
		}
	};
	var slices = {};
	function map_update(data) {
		Object.keys(data).forEach(function(x) {
			if(!map[x])
				map[x] = {};
			Object.keys(data[x]).forEach(function(y) {
				map[x][y] = data[x][y];
			});
		});
	}
	var world = {
		getTile: function(x, y) {
			var x_slice = Math.floor(x / SLICE_SIZE);
			var y_slice = Math.floor(y / SLICE_SIZE);
			if(!slices[x_slice] || (slices[x_slice] && !slices[x_slice][y_slice])) {
				console.log('missing slice', x_slice, y_slice, 'will try to take it');
				// We are nether subscribed or hosting this slice
				var url = 'world slice ' + x_slice + ' ' + y_slice;
				url = url.replace(/\-/g, 'c');
				var slice = nocturnal.create(url, function(question) {
					// send initial state
					switch(question.action) {
						case 'complete_state':
							console.log('got request for slice', x_slice, y_slice);
							var mapslice = {};
							for(var x = x_slice * SLICE_SIZE; x < (x_slice + 1) * SLICE_SIZE; x++) {
								if(!mapslice[x])
									mapslice[x] = {};
								for(var y = y_slice * SLICE_SIZE; y < (y_slice + 1) * SLICE_SIZE; y++) {
									if(mapslice[x] && mapslice[x][y])
										mapslice[x][y] = map[x][y];
								}
							}
							return mapslice;
						case 'update':
							// Some security sorting so that we don't update things we don't controll
							var data = {};
							Object.keys(question.data).forEach(function(x) {
								if(x / SLICE_SIZE == x_slice) {
									if(!data[x])
										data[x] = {};
									Object.keys(question.data[x]).forEach(function(y) {
										if(y / SLICE_SIZE == y_slice)
											data[x][y] = question.data[x][y];
									});
								}
							});
							map_update(data);
							slice.broadcast(data);
							return '';
					}
				});
				var nodup = true;
				slice.addEventListener('error', function(error) {
					error.preventDefault();
					if(nodup) {
						nodup = false;
						// slice probably already owned, will try to connect.
						console.log('slice', x_slice, y_slice, 'is already occupided, tries to connect');
						delete slice;
						var slice = nocturnal.subscribe(url, function(data) {
							console.log('got broadcast data for slice', x_slice, y_slice);
							map_update(data);
						});
						slice.addEventListener('open', function() {
							console.log('slice', x_slice, y_slice, 'connected and listening to');
							slices[x_slice][y_slice] = slice;
							slice.request({action: 'complete_state'}, function(data) {
								console.log('got complete_state answer for slice', x_slice, y_slice);
								map_update(data);
							});
						});
					}
					return false;
				});
				if(!slices[x_slice])
					slices[x_slice] = {};
				slices[x_slice][y_slice] = slice;
			}
			if(map[x] && map[x][y])
				return map[x][y];
			else
				return 'white';
		},
		SLICE_SIZE: SLICE_SIZE,
		update_tiles: function(map_part) {
			// This code assumes that a getTile has already been called
			// map_part has the same format as the map.
			// This method will devide into slices and eather request a update or broadcast a update depending on ownership
			
			var map_slices = {};
			Object.keys(map_part).forEach(function(x) {
				Object.keys(map_part).forEach(function(y) {
					var x_slice = Math.floor(x / SLICE_SIZE);
					var y_slice = Math.floor(y / SLICE_SIZE);
					var slice = slices[x_slice][y_slice];
					if(!map_slices[x_slice])
						map_slices[x_slice] = {}
					if(!map_slices[x_slice][y_slice]) {
						var data = {};
						data[x] = {};
						data[x][y] = map_part[x][y];
						map_slices[x_slice][y_slice] = {
							map: data,
							connection: slice
						};
					} else {
						var mslice = map_slices[x_slice][y_slice];
						if(!mslice.map[x])
							mslice.map[x] = {}
						mslice.map[x][y] = map_part[x][y];
					}
				});
			});
			Object.keys(map_slices).forEach(function(x_slice) {
				Object.keys(map_slices[x_slice]).forEach(function(y_slice) {
					var connection = map_slices[x_slice][y_slice].connection;
					var slice_data = map_slices[x_slice][y_slice].map;
					if(connection.type == 'client') {
						console.log('update of non-owned slice, sending request', slice_data);
						connection.request({action: 'update', data: slice_data});
					}
					else if(connection.type == 'service') {
						console.log('update of owned slice, sending broadcast', slice_data);
						update_map(slice_data);
						connection.broadcast(slice_data);
					}
				});
			});
		}
	};
	window.world = world;
})();
