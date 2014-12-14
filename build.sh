#!/bin/bash
outdev=isthisit.dev.js
outprod=isthisit.js

noprod=0
if [ "$1" == "noprod" ]; then
	noprod=1
fi

prodfiles="${prodfiles} device.js"
prodfiles="${prodfiles} device_manager.js"
prodfiles="${prodfiles} expando_circle.js"
prodfiles="${prodfiles} pulse_circle.js"
prodfiles="${prodfiles} text_input.js"
prodfiles="${prodfiles} connection_node.js"
prodfiles="${prodfiles} connection.js"
prodfiles="${prodfiles} connection_rails.js"
prodfiles="${prodfiles} game.js"
prodfiles="${prodfiles} conversations/birth.js"

devfiles="${prodfiles}"

function adddev {
	echo " Adding $1"
	cat $1 >> ${outdev}
	echo "" >> ${outdev}
}
function addprod {
	echo " Uglifying and adding $1"
	cat $1 | sed "s/DEV_MODE = true/DEV_MODE = false/" | ./node_modules/.bin/uglifyjs >> ${outprod} 2>/dev/null
	if [ "$?" != "0" ]; then
		echo "Uglifying $1 failed, aborting"
		exit 1
	fi
	echo "" >> ${outprod}
}
echo "Building ${outdev}"
echo "" > ${outdev}
for f in ${devfiles}; do
	adddev ${f}
done
echo "Built ${outdev}"
if [ "${noprod}" != "1" ]; then
	echo "Installing build dependencies"
	npm i
	echo "Building ${outprod}"
	echo "" > ${outprod}
	for f in ${prodfiles}; do
		addprod ${f}
	done
	echo "Built ${outprod}"
fi
echo "Note: DEV_MODE mentions:"
find . -name "*.js" | grep -v isthisit | xargs grep -v "var DEV_MODE =" | grep -A5 DEV_MODE
