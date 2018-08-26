var DualityBoard = function() {
    this.states = {};
    this.characters = {};
    this.turnCards = {};
    this.turnDeck = [];
    this.drawDeck = [];

    this.states[""] = {x:0,y:3,z:-3,name:"",img:"",claim:"grey"};
    this.states[""] = {x:0,y:2,z:-2,name:"",img:"",claim:"grey"};
    this.states[""] = {x:0,y:1,z:-1,name:"",img:"",claim:"grey"};
    this.states[""] = {x:0,y:0,z:0,name:"",img:"",claim:"grey"};
    this.states[""] = {x:0,y:-1,z:1,name:"",img:"",claim:"grey"};
    this.states[""] = {x:0,y:-2,z:2,name:"",img:"",claim:"grey"};
    this.states[""] = {x:0,y:-3,z:3,name:"",img:"",claim:"grey"};
    this.states[""] = {x:1,y:2,z:-3,name:"",img:"",claim:"grey"};
    this.states[""] = {x:1,y:1,z:-2,name:"",img:"",claim:"grey"};
    this.states[""] = {x:1,y:0,z:-1,name:"",img:"",claim:"grey"};
    this.states[""] = {x:1,y:-1,z:0,name:"",img:"",claim:"grey"};
    this.states[""] = {x:1,y:-2,z:1,name:"",img:"",claim:"grey"};
    this.states[""] = {x:1,y:-3,z:2,name:"",img:"",claim:"grey"};
    this.states[""] = {x:2,y:1,z:-3,name:"",img:"",claim:"grey"};
    this.states[""] = {x:2,y:0,z:-2,name:"",img:"",claim:"grey"};
    this.states[""] = {x:2,y:-1,z:-1,name:"",img:"",claim:"grey"};
    this.states[""] = {x:2,y:-2,z:0,name:"",img:"",claim:"grey"};
    this.states[""] = {x:2,y:-3,z:1,name:"",img:"",claim:"grey"};
    this.states[""] = {x:3,y:-3,z:0,name:"",img:"",claim:"grey"};
    this.states[""] = {x:3,y:-2,z:-1,name:"",img:"",claim:"grey"};
    this.states[""] = {x:3,y:-1,z:-2,name:"",img:"",claim:"grey"};
    this.states[""] = {x:3,y:0,z:-3,name:"",img:"",claim:"grey"};
    this.states[""] = {x:-1,y:-2,z:3,name:"",img:"",claim:"grey"};
    this.states[""] = {x:-1,y:-1,z:2,name:"",img:"",claim:"grey"};
    this.states[""] = {x:-1,y:0,z:1,name:"",img:"",claim:"grey"};
    this.states[""] = {x:-1,y:1,z:0,name:"",img:"",claim:"grey"};
    this.states[""] = {x:-1,y:2,z:-1,name:"",img:"",claim:"grey"};
    this.states[""] = {x:-1,y:3,z:-2,name:"",img:"",claim:"grey"};
    this.states[""] = {x:-2,y:-1,z:3,name:"",img:"",claim:"grey"};
    this.states[""] = {x:-2,y:0,z:2,name:"",img:"",claim:"grey"};
    this.states[""] = {x:-2,y:1,z:1,name:"",img:"",claim:"grey"};
    this.states[""] = {x:-2,y:2,z:0,name:"",img:"",claim:"grey"};
    this.states[""] = {x:-2,y:3,z:-1,name:"",img:"",claim:"grey"};
    this.states[""] = {x:-3,y:3,z:0,name:"",img:"",claim:"grey"};
    this.states[""] = {x:-3,y:2,z:1,name:"",img:"",claim:"grey"};
    this.states[""] = {x:-3,y:1,z:2,name:"",img:"",claim:"grey"};
    this.states[""] = {x:-3,y:0,z:3,name:"",img:"",claim:"grey"};

    this.characters[""] = {name:"", mot:0, drive:"E", supp:"I"}
    this.characters[""] = {name:"", mot:0, drive:"E", supp:"I"}
    this.characters[""] = {name:"", mot:0, drive:"E", supp:"I"}
    this.characters[""] = {name:"", mot:0, drive:"E", supp:"R"}
    this.characters[""] = {name:"", mot:0, drive:"E", supp:"R"}
    this.characters[""] = {name:"", mot:0, drive:"E", supp:"R"}
    this.characters[""] = {name:"", mot:0, drive:"I", supp:"R"}
    this.characters[""] = {name:"", mot:0, drive:"I", supp:"R"}
    this.characters[""] = {name:"", mot:0, drive:"I", supp:"R"}
    this.characters[""] = {name:"", mot:0, drive:"I", supp:"E"}
    this.characters[""] = {name:"", mot:0, drive:"I", supp:"E"}
    this.characters[""] = {name:"", mot:0, drive:"I", supp:"E"}
    this.characters[""] = {name:"", mot:0, drive:"R", supp:"E"}
    this.characters[""] = {name:"", mot:0, drive:"R", supp:"E"}
    this.characters[""] = {name:"", mot:0, drive:"R", supp:"E"}
    this.characters[""] = {name:"", mot:0, drive:"R", supp:"I"}
    this.characters[""] = {name:"", mot:0, drive:"R", supp:"I"}
    this.characters[""] = {name:"", mot:0, drive:"R", supp:"I"}

}
