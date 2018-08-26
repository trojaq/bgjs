var util = require('util');


function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function cube_distance(a, b) {
    return (Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z)) / 2
}

function neighbour(a,b) {
   return cube_distance(a,b) == 1;
}

(function() {

    let core = require('./gamemodel.js');

    let claimPhase = function*(gm) {
      let firstClaimed = gm.players[gm.activePlayerIdx];
      let secondClaimed = gm.players[1-gm.activePlayerIdx];
      let interactorFn = function(player) { return function*(gm) {
          let interactor = yield {
            filter: object => object.type === "state" && object.claim === "grey",
            times: 1,
            txt: 'Select state to become ' + player
          };
          console.log("Step " + interactor.currentStep);
          console.log("Selected " + interactor.selected);
          gm.objects[interactor.selected[0]].claim = player;
        };
      }
      gm.interact(firstClaimed, "FirstClaim", interactorFn(firstClaimed));
      yield;
      gm.interact(secondClaimed, "SecondClaim", interactorFn(secondClaimed));
      yield;
      gm.interact(secondClaimed, "ThirdClaim", interactorFn(secondClaimed));
      yield;
      gm.interact(firstClaimed, "FourthClaim", interactorFn(firstClaimed));
      yield;
    }

    let activationInteractor = function(player) {
      return function*(gm) {
        let interactor = yield {
          filter: object => object.type === "char" && !object.activated,
          times: 1,
          txt: "Select character to activate"
        }
        console.log("Step " + interactor.currentStep);
        let activatedChar = gm.objects[interactor.selected[0]];
        console.log("Selected " + util.inspect(activatedChar.__view));
        activatedChar.activated = true;
        let location = gm.objects[activatedChar.state];
        console.log("current location " + location);
        interactor = yield {
          filter: o => o.type === "state" && neighbour(o, location),
          times: 1,
          txt: 'Select state to move to'
        }
        console.log("Step " + interactor.currentStep);
        console.log("Selected " + interactor.selected);
        let state = gm.objects[interactor.selected[0]];
        activatedChar.state = interactor.selected[0];
        if(state.claim === "dark") {
          activatedChar.mot = activatedChar.mot-1;
        } else if(state.claim === "light") {
          activatedChar.mot = activatedChar.mot+1;
        }
        console.log("moved " + util.inspect(activatedChar));
      }

    }
    let activationPhase = function*(gm) {
      let activatingPlayerIdx = gm.activePlayerIdx;
      //6 activations for 6 chars
      for(let i = 1; i<=6; i++) {
        let activatingPlayer = gm.players[activatingPlayerIdx];
        gm.interact(activatingPlayer, "Activate", activationInteractor(activatingPlayer));
        yield;
        activatingPlayerIdx = 1-activatingPlayerIdx;
      }

    };
    let cleanupPhase = function*(gm) {


    };

    class DualityGameModel extends core.GameModel {

        constructor() {
            super("Duality")
            console.log("Creating Duality");
            this.states = {};
            this.characters = {};
            this.turnCards = {};
            this.turnDeck = [];
            this.drawDeck = [];

        }

        startGame(triggers) {
            this.init({
                players:["dark","light"],
                startingPhase:0,
                phases: [
                    {
                        name:"StateClaim",
                        action: claimPhase
                    },
                    {
                        name:"CharActivation",
                        action: activationPhase
                    },
                    {
                        name:"Cleanup",
                        action: cleanupPhase
                    },
                ],
                modifiers: [],
                triggers:triggers
            });
            this.states["1"] = this.createGameObject("1", {type:"state", x:-3,y:0,z:3,name:"",img:"",claim:"grey"});
            this.states["2"] = this.createGameObject("2",{type:"state", x:0,y:3,z:-3,name:"",img:"",claim:"grey"});
            this.states["3"] = this.createGameObject("3",{type:"state", x:0,y:2,z:-2,name:"",img:"",claim:"grey"});
            this.states["4"] = this.createGameObject("4", {type:"state", x:0,y:1,z:-1,name:"",img:"",claim:"grey"});
            this.states["5"] = this.createGameObject("5", {type:"state", x:0,y:-1,z:1,name:"",img:"",claim:"grey"});
            this.states["6"] = this.createGameObject("6", {type:"state", x:0,y:-2,z:2,name:"",img:"",claim:"grey"});
            this.states["7"] = this.createGameObject("7", {type:"state", x:0,y:-3,z:3,name:"",img:"",claim:"grey"});
            this.states["8"] = this.createGameObject("8", {type:"state", x:1,y:2,z:-3,name:"",img:"",claim:"light"});
            this.states["9"] = this.createGameObject("9", {type:"state", x:1,y:1,z:-2,name:"",img:"",claim:"grey"});
            this.states["10"] = this.createGameObject("10", {type:"state", x:1,y:0,z:-1,name:"",img:"",claim:"grey"});
            this.states["11"] = this.createGameObject("11", {type:"state", x:1,y:-1,z:0,name:"",img:"",claim:"grey"});
            this.states["12"] = this.createGameObject("12", {type:"state", x:1,y:-2,z:1,name:"",img:"",claim:"grey"});
            this.states["13"] = this.createGameObject("13", {type:"state", x:1,y:-3,z:2,name:"",img:"",claim:"grey"});
            this.states["14"] = this.createGameObject("14", {type:"state", x:2,y:1,z:-3,name:"",img:"",claim:"grey"});
            this.states["15"] = this.createGameObject("15", {type:"state", x:2,y:0,z:-2,name:"",img:"",claim:"grey"});
            this.states["16"] = this.createGameObject("16", {type:"state", x:2,y:-1,z:-1,name:"",img:"",claim:"grey"});
            this.states["17"] = this.createGameObject("17", {type:"state", x:2,y:-2,z:0,name:"",img:"",claim:"grey"});
            this.states["18"] = this.createGameObject("18", {type:"state", x:2,y:-3,z:1,name:"",img:"",claim:"grey"});
            this.states["19"] = this.createGameObject("19", {type:"state", x:3,y:-3,z:0,name:"",img:"",claim:"grey"});
            this.states["20"] = this.createGameObject("20", {type:"state", x:3,y:-2,z:-1,name:"",img:"",claim:"grey"});
            this.states["21"] = this.createGameObject("21", {type:"state", x:3,y:-1,z:-2,name:"",img:"",claim:"grey"});
            this.states["22"] = this.createGameObject("22", {type:"state", x:3,y:0,z:-3,name:"",img:"",claim:"grey"});
            this.states["23"] = this.createGameObject("23", {type:"state", x:-1,y:-2,z:3,name:"",img:"",claim:"grey"});
            this.states["24"] = this.createGameObject("24", {type:"state", x:-1,y:-1,z:2,name:"",img:"",claim:"grey"});
            this.states["25"] = this.createGameObject("25", {type:"state", x:-1,y:0,z:1,name:"",img:"",claim:"grey"});
            this.states["26"] = this.createGameObject("26", {type:"state", x:-1,y:1,z:0,name:"",img:"",claim:"grey"});
            this.states["27"] = this.createGameObject("27", {type:"state", x:-1,y:2,z:-1,name:"",img:"",claim:"grey"});
            this.states["28"] = this.createGameObject("28", {type:"state", x:-1,y:3,z:-2,name:"",img:"",claim:"grey"});
            this.states["29"] = this.createGameObject("29", {type:"state", x:-2,y:-1,z:3,name:"",img:"",claim:"grey"});
            this.states["30"] = this.createGameObject("30", {type:"state", x:-2,y:0,z:2,name:"",img:"",claim:"grey"});
            this.states["31"] = this.createGameObject("31", {type:"state", x:-2,y:1,z:1,name:"",img:"",claim:"grey"});
            this.states["32"] = this.createGameObject("32", {type:"state", x:-2,y:2,z:0,name:"",img:"",claim:"grey"});
            this.states["33"] = this.createGameObject("33", {type:"state", x:-2,y:3,z:-1,name:"",img:"",claim:"grey"});
            this.states["34"] = this.createGameObject("34", {type:"state", x:-3,y:1,z:2,name:"",img:"",claim:"grey"});
            this.states["35"] = this.createGameObject("35", {type:"state", x:-3,y:3,z:0,name:"",img:"",claim:"grey"});
            this.states["36"] = this.createGameObject("36", {type:"state", x:-3,y:2,z:1,name:"",img:"",claim:"grey"});

            this.characters["Activist"] = this.createGameObject("Activist", {name:"Activist", type:"char", mot:1, drive:"E", supp:"I", state:"2_2"});
            this.characters["Psycho"] = this.createGameObject("Psycho", {name:"Psycho", type:"char", mot:-1, drive:"E", supp:"R", state:"8_8"});
            this.characters["Explorer"] = this.createGameObject("Explorer", {name:"Explorer", type:"char", mot:1, drive:"I", supp:"R", state:"13_13"});
            this.characters["Lawyer"] = this.createGameObject("Lawyer", {name:"Lawyer", type:"char", mot:-1, drive:"I", supp:"E", state:"20_20"});
            this.characters["Scientist"] = this.createGameObject("Scientist", {name:"Scientist", type:"char", mot:-1, drive:"R", supp:"E", state:"27_27"});
            this.characters["Policeman"] = this.createGameObject("Policeman", {name:"Policeman", type:"char", mot:1, drive:"R", supp:"I", state:"32_32"});

            this.start();
        }


    }


    exports.DualityGameModel = DualityGameModel;

}).call(this);
