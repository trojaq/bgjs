var core = require('./gamemodel.js');
var dual = require('./duality.js');


const express = require('express');
const app = express();


app.use(express.static('public'));


var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', socket =>
  {
    console.log("connected");
    socket.on('click', data => console.log(data));
  }
);
http.listen(80, function(){
  console.log('listening on *:80');
});

clicks = [{clicked: "o_1"}, {clicked: "o2_2"}, {clicked: "o2_2"}, {clicked: "o_1"}];

gm = new core.GameModel("chess");
mod = new core.Modifier('Modifier', function(props, model) {
    console.log(`modyfing ${JSON.stringify(props)}`)
    if (props["data"]) { props["data"] = props["data"] + 1};
});
trig = new core.Trigger('Trigger', function(event, model) {
    if(event.event == "AllEventsResolved") {
        console.log("Triggered")
        return true
    }
    return false
}, function(event, model) {
    if(clicks.length > 0) {
        gm.postEvent("click", clicks.pop());
    }
});


const move = function*(gamemodel) {
    let interactor = yield {
        filter: object => object.baseName === "o2",
        times: 1,
        txt: 'Select source'
    }
    console.log("Step " + interactor.currentStep);
    console.log("Selected " + interactor.selected);
    interactor = yield {
        filter: object => object.data,
        times: 2,
        txt: 'Select target'
    }
    console.log("Step " + interactor.currentStep);
    console.log("Selected " + interactor.selected);
    gamemodel.objects[interactor.selected[0]].data = 7;
};


gm.init({players:["player"],modifiers: [], triggers:[trig], phases: [
        {name:"Moving phase", action: function*(gm) {
                gm.interact("player", "move", move);
                yield;

            }}
        ], startingPhase:0})
go = gm.createGameObject("o", {"data": 1});
go2 = gm.createGameObject("o2", {"data": 2});

//gm.start();
