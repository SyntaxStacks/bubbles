This is my first attempt into a multiplayer game that works over a network. Not sure where I'll take it.
###build
browserify ./lib/main.js -o ./bundle.js

###start multiplayer server
node lib/socketServer

###play
Open index.html
