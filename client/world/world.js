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
	};
	window.world = world;
})();
