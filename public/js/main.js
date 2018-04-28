console.log("Main.js fired");
var canvas = document.getElementById("container");
var stage = new createjs.Stage(canvas);
require(["chess", "socket.io"], function() {
		 console.log("chess loaded");
		 var socket = io();
		 console.log("socket connected");

		var chessBoard = new ChessBoard();
		chessBoard.init(socket, stage, {});
		stage.update();

});
