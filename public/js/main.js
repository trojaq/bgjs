console.log("Main.js fired");
var canvas = document.getElementById("container");
var stage = new createjs.Stage(canvas);
require(["chess"], function() {
		 console.log("chess loaded");
		
		var chessBoard = new ChessBoard();
		chessBoard.init(stage, {});
		stage.update();

});
