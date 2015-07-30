(function() {
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
	var world = {
		getTile: function(x, y) {
			if(map[x] && map[x][y])
				return map[x][y];
			else
				return 'white';
		}
	};
	window.world = world;
})();
