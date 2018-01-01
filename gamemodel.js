(function() {


    class GameModel {

        constructor(name) {
            this.name = name;
            this.events = [];
            this.objects = {};
            this.modifiers = [];
            this.triggers = [];
            this.fired = [];
            this.nextId = 1;
        }

        init(data) {
            for (let modifier of data.modifiers) {
                this.modifiers.push(modifier);
                modifier.gm = this;
            }
            for (let trigger of data.triggers) {
                this.triggers.push(trigger);
                trigger.gm = this;
            }
        }

        postEvent(event, data) {
            this.events.push({event: event, data: data});
            console.log(` ${event} with data ${JSON.stringify(data)} posted`);
            process.nextTick(() => this.nextEvent());
        }

        nextEvent() {
            const event = this.events.shift();
            console.log(`processing ${event.event} with data ${JSON.stringify(event.data)}`);

            for (let trigger of this.triggers) {
                if (trigger.triggered(event, this)) {
                    console.log(`Event ${event.event} triggered ${trigger.name}`);
                    this.fired.push([trigger, event]);
                }
            }

            if (this.events.length === 0) {
                for (let fire of this.fired) {
                    fire[0].fired(fire[1], this);
                }
                this.fired = [];
                for(let name in this.objects) {
                	this.modify(this.objects[name]);
				}
                if (this.events.length === 0) {
                    if (event.event !== "AllEventsResolved") {
                        this.postEvent("AllEventsResolved", {});
                    } else {
                        console.log("no more events");
                    }
                }
            }
        }

        modify(gameObject) {
            var key, modifier, newView, oldView, value, _i, _len, _ref;

            oldView = gameObject.view;
            console.log("Old VIew " + (JSON.stringify(oldView)));
            newView = gameObject.copy();
            _ref = this.modifiers;
            for (let modifier of this.modifiers) {
                modifier.modify(newView, this);
            }
            for (let key in newView) {
                value = newView[key];
                if (oldView[key] !== value) {
                    this.postEvent("PropertyChanged", {
                        object: gameObject.name,
                        property: key,
                        oldValue: oldView[key],
                        newValue: value
                    });
                }
                delete oldView[key];
            }
            for (key in oldView) {
                value = oldView[key];
                this.postEvent("PropertyChanged", {
                    object: gameObject.name,
                    property: key,
                    oldValue: oldView[key],
                    newValue: null
                });
            }
            gameObject.view = newView;
            return console.log("New VIew " + (JSON.stringify(newView)));
        };

        createGameObject(name, properties) {
            const goName = name + "_" + this.nextId;
            const go = new GameObject(goName, this);
            go.baseName = name;
            this.nextId++;
            Object.assign(go.props, properties);
            Object.assign(go.view, properties);
            const proxy = new Proxy(go, proxyHandler);
            this.objects[goName] = proxy;
            return proxy;
        }
    }

    class Modifier {

        constructor(name, modificator) {
            this.name = name;
            this.modificator = modificator;

        }

        modify(gameObject, gameModel) {
        	this.modificator(gameObject, gameModel);
        }

    }

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

    var proxyHandler = {
        get: function (target, property, receiver) {
        	if(target.view.hasOwnProperty(property)) {
                return target.view[property];
			} else {
				return target[property];
			}
        },
        set: function (target, property, value, receiver) {
        	if(['view','name','gm','props'].includes(property)) {
        		target[property] = value;
        		return true;
			}
            if (value === null) {
                delete target.props[property];
            } else {
                target.props[property] = value;
            }
            return true;
        }
    }

    class GameObject {

        constructor(name, gamemodel) {
            this.name = name;
            this.gm = gamemodel;
            this.view = {};
            this.props = {};
        }

        copy() {
            var copied = {};
            Object.assign(copied, this.props);
            return copied;
        }


    }

    exports.GameModel = GameModel;

    exports.Modifier = Modifier;

    exports.Trigger = Trigger;
}).call(this);


