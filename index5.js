const EventEmitter = require("events");

class ReactiveSystem extends EventEmitter {
    constructor(name) {
        super();
        this.name = name;
        this.log = [];
    }

    getLog() {
        return this.log;
    }
}