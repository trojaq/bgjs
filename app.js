var core = require('./gamemodel.js')

const express = require('express')
const app = express()


app.use(express.static('public'))

app.listen(80)
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


gm.init({modifiers: [], triggers:[trig], phases: [
        {name:"Moving phase", action: move}




    ]})
go = gm.createGameObject("o", {"data": 1});
go2 = gm.createGameObject("o2", {"data": 2});

gm.interact("player", "move", move);

