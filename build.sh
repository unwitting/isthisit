#!/bin/bash
outdev=isthisit.dev.js
outprod=isthisit.js

prodfiles="${prodfiles} conversations/birth.js"
prodfiles="${prodfiles} expando_circle.js"
prodfiles="${prodfiles} pulse_circle.js"
prodfiles="${prodfiles} text_input.js"
prodfiles="${prodfiles} connection_node.js"
prodfiles="${prodfiles} connection.js"
prodfiles="${prodfiles} connection_rails.js"
prodfiles="${prodfiles} game.js"

devfiles="${prodfiles}"

function adddev {
	echo " Adding $1"
	cat $1 >> ${outdev}
	echo "" >> ${outdev}
}
function addprod {
	echo " Adding $1"
	cat $1 | sed "s/DEV_MODE = true/DEV_MODE = false/" >> ${outprod}
	echo "" >> ${outprod}
}
echo "Building ${outdev}"
echo "" > ${outdev}
for f in ${devfiles}; do
	adddev ${f}
done
echo "Built ${outdev}"
echo "Building ${outprod}"
echo "" > ${outprod}
for f in ${prodfiles}; do
	addprod ${f}
done
echo "Built ${outprod}"
