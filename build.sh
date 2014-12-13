#!/bin/bash
out=isthisit.js
function add {
	cat $1 >> ${out}
	echo "" >> ${out}
}
echo "Building ${out}..."
echo "" > ${out}
add underscore.js
add phaser.js
add expando_circle.js
add pulse_circle.js
add text_input.js
add connection_node.js
add connection.js
add connection_rails.js
add game.js
echo "Built"
