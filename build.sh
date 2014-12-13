#!/bin/bash
outdev=isthisit.dev.js
outprod=isthisit.js

PROD_BUILD=1
if [ "$1" == "noprod" ]; then
	PROD_BUILD=0
fi

files="${files} underscore.js"
files="${files} phaser.js"
files="${files} expando_circle.js"
files="${files} pulse_circle.js"
files="${files} text_input.js"
files="${files} connection_node.js"
files="${files} connection.js"
files="${files} connection_rails.js"
files="${files} game.js"

function adddev {
	echo " Adding $1"
	cat $1 >> ${outdev}
	echo "" >> ${outdev}
}
function addprod {
	echo " Adding $1"
	cat $1 | sed "s/DEV_MODE = true/DEV_MODE = false/" | ./node_modules/.bin/uglifyjs >> ${outprod}
	echo "" >> ${outprod}
}
echo "Building ${outdev}"
echo "" > ${outdev}
for f in ${files}; do
	adddev ${f}
done
echo "Built ${outdev}"
if [ "${PROD_BUILD}" != "0" ]; then
	echo "Installing build dependencies"
	npm i
	echo "Building ${outprod}"
	for f in ${files}; do
		addprod ${f}
	done
	echo "Built ${outprod}"
fi
