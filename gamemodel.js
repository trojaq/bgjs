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

        //update view of the object so it reflects latest changes and stack of modifiers
        modify(gameObject) {
            var newView, oldView;

            //store old view for comparison for PropertyChanged events
            oldView = gameObject.__view;
            console.log("Old VIew " + (JSON.stringify(oldView)));
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
            return console.log("New VIew " + (JSON.stringify(newView)));
        };

        createGameObject(name, properties) {
            //get unique name
            const goName = name + "_" + this.nextId;
            const go = new GameObject(goName, this);
            //store non-unique name for potential usage
            go.baseName = name;
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


