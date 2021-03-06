# Nocturnal World
A webrtc pub sub system made for a game jam with the same name. All participant code on the same project at the same time. A small set of premade microservices and a client are hopefully already written for the game jam to get you started!.

> The adjective nocturnal comes from the late latin nocturnalis, which means “belonging to the night."

# Contribution
The system itself can't do much. We need to improve it! You can do this in multiple ways:

	- by using the client, populating the world with content
	- by writing new services that you run on your own client that others can use
	- by making pull requests on the client and client library
	- by making pull requests on the server
	- by spell checking this README and making a pull request (or changing it right here on GitHub)

# The Client
The client consists of a index.html file which imports the client library. The index.html looks for a myscript.js file in the same directory. Thats one easy way to use the application. You can also edit the HTML file directly or use something like chrome devtools snippits.

## Setup
The client dependencies are managed by bower. If you don't already have bower install it with `npm install -g bower`. If you don't have node and npm install. Do that with your systems package manager like bower, apt-get or from the official node website.

Then type: `bower install`, to get all client dependencies.

Then just open `client/index.html` your browser.

# Server
The server dependencies are managed with npm so a `npm install` should be sufficient to get them all.

To run the server type: `npm run-script run`.

# Tests
These are run with karma and built in jasmine. To run them just type: `npm test`.
