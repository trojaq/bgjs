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
		    name:"" + letters[_i] + _j,
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
	init : function(stage, objects) {
			stage.width(480);
			stage.height(480);
			var staticLayer = new Kinetic.Layer();
			var dynamicLayer = new Kinetic.Layer();
		  var field, name, object;
		
		  for (name in this.chess) {
			console.log("Field: " + name);
			field = this.chess[name];
			field.draw = new Kinetic.Rect({
				x : field.top,
				y : field.left,
				width: 60,
				height: 60,
				fill: field.color,
				stroke: 'black',
				strokeWidth: 1
				});
			staticLayer.add(field.draw);
		  }
		  for(name in objects) {
		     var pion = objects[name];
			this.figure[name] = pion;
			
			
		  }
		  stage.add(staticLayer);
		  stage.add(dynamicLayer);
	  }


}
