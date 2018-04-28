var ChessBoard = function() {
      var color, colorIndex, letter, number, x, y, _i, _j;

      this.chess = {};
      this.figures = {};
      this.bin = [];
      x = 0;
      y = 0;
      color = ['white', 'black'];
	  letters = ['a','b','c','d','e','f','g','h'];
      colorIndex = 0;
      for (_i = 0; _i<8;_i++,x += 60) {
        y = 0;
        for (_j = 1; _j <= 8; _j++,y += 60) {
          this.chess["" + letters[_i] + _j] = {
		        name: "" + letters[_i] + _j,
            top: y,
            left: x,
            color: color[colorIndex]
          };

          colorIndex = 1 - colorIndex;
        }

		    colorIndex = 1 - colorIndex;
      }


}

ChessBoard.prototype = {
	init : function(io, stage, objects) {
			var staticLayer = new createjs.Container();
			var dynamicLayer = new createjs.Container();
		  var field, name, object;

		  for (let name in this.chess) {
			console.log("Field: " + name);
			field = this.chess[name];


      field.draw = new createjs.Shape();
			field.draw.x = field.top;
			field.draw.y = field.left;
			field.draw.graphics.beginStroke('black').beginFill(field.color).drawRect(0, 0, 60, 60);
      field.draw.addEventListener("click", event =>
        io.emit('click', {name:name})
      );

			staticLayer.addChild(field.draw);
		  }
		  for(name in objects) {
		     var pion = objects[name];
			   this.figure[name] = pion;


		  }
		  stage.addChild(staticLayer);
		  stage.addChild(dynamicLayer);
	  }


}
