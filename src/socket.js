import io from 'socket.io-client';
import {changeBgColor, changeBgPos} from './index.js';
import {showShape, showText, showGraph} from './sketch.js';
import {newSound, changeFilter} from './sound.js';
import {DEFAULT_IP} from './config';

var socket;
var serverIP = DEFAULT_IP;

export function connectServer(ip) {
	console.log('connecting to server...');
    if (socket) socket.disconnect();
    if (ip != null && ip != '')  serverIP = ip;
	socket = io(serverIP);
	addSocketListener();
}

function addSocketListener() {
	console.log('!');
	socket.on('connect', (data) => {
		console.log('connect!');
		//receiver: 
		socket.on('osc', (message) => {
			
		});

		socket.on('bgcolor', (colorarr) => {
			//console.log('bgcolor', colorarr);
			changeBgColor(colorarr);
		})

		socket.on('bgpos', (pos) => {
			//console.log('bgpos', pos);
			changeBgPos(pos);
		})


		socket.on('shape', (shape) => {
			showShape(shape);
			
		})

		socket.on('text', (text) => {
			//console.log(text);
			showText(text);
		})

		socket.on('freq', (freq) => {
			//console.log(freq);
			newSound(freq);
		})

		socket.on('filter', (filter) => {
			changeFilter(filter);
		})

		socket.on('graph', (graph)=>{
			showGraph(graph);
		})
		//sender:

	})
}