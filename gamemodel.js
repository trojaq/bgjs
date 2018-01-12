(function() {

// this is a base class for game engine.
// Objects of this class will be handling actual games from start to finish
    class GameModel {

        constructor(name) {
            //unique name for this instance of the game
            this.name = name;
            //event queue which drives the engine
            this.events = [];
            //all the objects that exist in this game.
            //mapped by their unique name
            this.objects = {};
            //active modifiers list
            this.modifiers = [];
            //active triggers list
            this.triggers = [];
            //this list will hold the triggers activated by uninterrupted event chain
            this.fired = [];
            //this wam will hold interactor stacks per player
            this.interactors = {}
            //the list of players
            this.players = [];
            //the active player index
            this.activePlayerIdx = 0;
            //the go to integer for constructing unique game object names
            this.nextId = 1;
        }

        //initialize model with modifiers and triggers
        init(data) {
            for (let modifier of data.modifiers) {
                this.modifiers.push(modifier);
            }
            for (let trigger of data.triggers) {
                this.triggers.push(trigger);
            }
            // if(data.phases) {
            //     this.phases = data.phases;
            //     this.nextPhase = data.startingPhase;
            //     this.currentPhase = -1;
            //     this.nextPhase()
            // }
        }

        //pushes new event to the event queue
        postEvent(event, data) {
            this.events.push({event: event, data: data});
            console.log(` ${event} with data ${JSON.stringify(data)} posted`);
            //since now the event queue is not empty, schedule processing of the next event
            // (not necessary the one posted) on next tick
            process.nextTick(() => this.nextEvent());
        }

        //processes next event on the queue
        nextEvent() {
            //take first event from the queue
            const event = this.events.shift();
            console.log(`processing ${event.event} with data ${JSON.stringify(event.data)}`);

            //check if any of the triggers activates on this event
            for (let trigger of this.triggers) {
                if (trigger.triggered(event, this)) {
                    console.log(`Event ${event.event} triggered ${trigger.name}`);
                    //schedule the trigger along with the event for activation
                    //the triggers will be activated only after all events on the queue are processed
                    this.fired.push([trigger, event]);
                }
            }


            if (this.events.length === 0) {
                //all the events where processed, we now have a bag of activated triggers to fire
                //this may of course post new events on the queue and the loop will start over
                for (let fire of this.fired) {
                    fire[0].fired(fire[1], this);
                }
                //after we fired the triggers, clean the temporary list
                this.fired = [];
                //after we fired the triggers, some values may have changed
                //so make sure that object views are updated
                //this may post new PropetyChanged events on the queue
                for(let name in this.objects) {
                	this.modify(this.objects[name]);
				}
				//if we have no more events to process, post "allEventsResolved" event
                //to notify waiting for interaction or ending of phase
                //this may post new events on the queue
                if (this.events.length === 0) {
                    if (event.event !== "AllEventsResolved") {
                        this.postEvent("AllEventsResolved", {});
                    } else {
                        console.log("no more events");
                    }
                }
            }
        }

        //record and execute a number of steps for a player
        //stepIterator function accepts gameModel and player as parameters
        //stepIterator function provides consecutive steps in the form of
        //{ value:
        //  {  filter: filter function for clickable objects,
        //     times: how many times the object should be clicked
        //  },
        //  done: whether there is no more steps (value is undefined)
        //}

        interact(player, name, stepIterator) {
            if (!this.interactors[player]) {
                this.interactors[player] = [];
            }
            console.log(`Starting interaction ${player}, ${name}`);
            this.interactors[player].push(
                {
                    name: `${player}_${name}_${this.nextId++}`,
                    player: player,
                    gm: this,
                    steps: stepIterator,
                    currentStep: 0,
                    selected: [],
                    triggers: [],
                    modifiers: []

                }
            );
            this.nextStep(player);
        }


        //next step for an active iterator
        //next step will be pushed with AllEventsResolved by the global mechanism
        nextStep(player) {
            const interactor = this.interactors[player].pop();
            interactor.currentStep = interactor.currentStep + 1;
            const step = interactor.steps.next(interactor);
            if(!step.done) {
                //push interactor back on stack
                this.interactors[player].push(interactor);
                console.log(`Next step for ${interactor.name}: ${step.value.txt}`);

                const baseName = interactor.name + "_step" + interactor.currentStep;
                interactor.modifiers.push(
                    this.modifier(baseName + "_modifier", (view, gm) => {if(step.value.filter(view)) view.selectable = true}));
                interactor.triggers.push(
                    this.trigger(baseName + "_Trigger",
                        (ev, gm) => ev.event === 'click' && step.value.filter(gm.objects[ev.data.clicked]),
                        (ev, gm) => {
                            //add the clicked object to the list
                            console.log(`Adding ${ev.data.clicked} to selected`);
                            interactor.selected.push(ev.data.clicked);
                            //if last one, clean up this step's triggers and modifiers
                            if (interactor.selected.length >= step.value.times) {
                                console.log("All required objects selected for this step")
                                for (let modifier of interactor.modifiers) {
                                    gm.removeModifier(modifier.name);
                                }
                                for (let trigger of interactor.triggers) {
                                    gm.removeTrigger(trigger.name);
                                }
                                //clear the interactor
                                interactor.modifiers.splice(0, interactor.modifiers.length);
                                interactor.triggers.splice(0, interactor.triggers.length);
                            }
                            //schedule next step
                            gm.nextStep(interactor.player);
                        }
                    ));
            }
            //else interactor is off the stack, this chain is over
            //we have added or removed modifiers, refresh views now
            for(let name in this.objects) {
                this.modify(this.objects[name]);
            }
        }

        //update view of the object so it reflects latest changes and stack of modifiers
        modify(gameObject) {
            var newView, oldView;

            //store old view for comparison for PropertyChanged events
            oldView = gameObject.__view;
            //console.log("Old VIew " + (JSON.stringify(oldView)));

            //init new view with base properties
            newView = gameObject.__copy();
            //modify base view with active modifiers
            for (let modifier of this.modifiers) {
                modifier.modify(newView, this);
            }
            //check for PropertyChanged events
            for (let key in newView) {
                let value = newView[key];
                if (oldView[key] !== value) {
                    this.postEvent("PropertyChanged", {
                        object: gameObject.__name,
                        property: key,
                        oldValue: oldView[key],
                        newValue: value
                    });
                }
                //remove property from old view, so we have easy check for deleted properties
                delete oldView[key];
            }
            //only deleted properties are now left in oldView
            for (let key in oldView) {
                let value = oldView[key];
                this.postEvent("PropertyChanged", {
                    object: gameObject.__name,
                    property: key,
                    oldValue: oldView[key],
                    newValue: null
                });
            }
            //set the view to updated one
            gameObject.__view = newView;
            //console.log("New VIew " + (JSON.stringify(newView)));
        };

        trigger(name, triggered, fire) {
            const trigger = new Trigger(name, triggered, fire);
            this.triggers.push(trigger);
            return trigger;
        }

        //removes and returns named trigger if exist
        removeTrigger(name) {
            return this.triggers.splice(this.triggers.findIndex(tr => tr.name === name),1)[0];
        }

        modifier(name, modificator) {
            const modifier = new Modifier(name, modificator);
            this.modifiers.push(modifier);
            return modifier;
        }

        //removes and returns named modifier if exist
        removeModifier(name) {
            return this.modifiers.splice(this.modifiers.findIndex(tr => tr.name === name),1)[0];
        }

        createGameObject(name, properties) {
            //get unique name
            const goName = name + "_" + this.nextId;
            const go = new GameObject(goName, this);
            //store non-unique name for potential usage
            properties.baseName = name;
            //increase unique id
            this.nextId++;
            //copy provided properties to created object
            Object.assign(go.__props, properties);
            //populate initial view with unmodified properties
            Object.assign(go.__view, properties);
            //setup proxy for intercepting accessors to use view
            const proxy = new Proxy(go, proxyHandler);
            //store game object in model's storage
            this.objects[goName] = proxy;
            return proxy;
        }
    }

    //modifies the value of the property on game object
    class Modifier {

        constructor(name, modificator) {
            this.name = name;
            this.modificator = modificator;

        }
        //only game object's view is passed to modificator function, not the whole game object
        modify(gameObjectView, gameModel) {
        	this.modificator(gameObjectView, gameModel);
        }

    }

    //waits for event and condition to trigger
    //does 'a thing" one triggered
    class Trigger {

        constructor(name, trigger, fire) {
            this.name = name;
            this.trigger = trigger;
            this.fire = fire;
        }

        triggered(event, gameModel) {
            return this.trigger(event, gameModel);
        }

        fired(event, gameModel) {
        	return this.fire(event, gameModel);
        }
    }

    //proxy to intercept game object accessors
    var proxyHandler = {
        get: function (target, property, receiver) {
            //fallback to regular properties if property is not found in view
        	if(target.__view.hasOwnProperty(property)) {
                return target.__view[property];
			} else {
				return target[property];
			}
        },
        set: function (target, property, value, receiver) {
            //do not intercept setting of internal properties
        	if(['__view','__name','__gm','__props'].includes(property)) {
        		target[property] = value;
        		return true;
			}
            if (value === null) {
                delete target.__props[property];
            } else {
                target.__props[property] = value;
            }
            return true;
        }
    }

    class GameObject {

        constructor(name, gamemodel) {
            this.__name = name;
            this.__gm = gamemodel;
            this.__view = {};
            this.__props = {};
        }

        //copy and return base properties
        //used for view update
        __copy() {
            var copied = {};
            Object.assign(copied, this.__props);
            return copied;
        }


    }

    exports.GameModel = GameModel;

    exports.Modifier = Modifier;

    exports.Trigger = Trigger;
}).call(this);


