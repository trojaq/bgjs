var core = require('./gamemodel.js')

const express = require('express')
const app = express()


app.use(express.static('public'))

app.listen(80)


gm = new core.GameModel("chess");
mod = new core.Modifier('Modifier', function(props, model) {
    console.log(`modyfing ${JSON.stringify(props.view)}`)
    if (props["data"]) { props["data"] = props["data"] + 1};
});
trig = new core.Trigger('Trigger', function(event, model) {
    if(event.event != "Click") {
        return false;
    }
    if(this.player != event.data.player) {
        return false;
    }
    if(!(event.data.id in gm.objects)) {
        return false;
    }
    var target = gm.objects[event.data.id];

    if(event.event == "AllEventsResolved") {
        console.log("Triggered")
        return true
    }
    return false
}, function(event, model) {
    model.objects.o_1.data = 3
    console.log("Fired")
});




gm.init({modifiers: [mod], triggers:[trig]})
go = gm.createGameObject("o", {"data": 1});

gm.postEvent("Event1", {data1: "data1", data2:"data2"});
