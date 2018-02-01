(function() {

    let core = require('./gamemodel.js');

    let claimPhase = function*(gm) {




    };

    let activationPhase = function*(gm) {


    };
    let cleanupPhase = function*(gm) {


    };

    class DualityGameModel extends core.GameModel {

        constructor() {
            super("Duality")
        }

        startGame() {
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
                ]
            });


        }


    }


    exports.DualityGameModel = DualityGameModel;

}).call(this);
