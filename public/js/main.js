console.log("Main.js fired");
var stage = new Kinetic.Stage({
        container: 'container',
      });
 
require(["chess"], function() {
		 console.log("chess loaded");
		
		var chessBoard = new ChessBoard();
		chessBoard.init(stage, {});

});
