const EventEmitter = require("events");

class ReactiveSystem extends EventEmitter {
    constructor(name) {
        super();
        this.name = name;
        this.log = [];
    }

    sendMessage(target, message) {
        this.log.push({ type: "message", target, message, timestamp: new Date() });
        this.emit("message", { from: this.name, to: target.name, message });
    }

    sendError(error) {
        this.log.push({ type: "error", error, timestamp: new Date() });
        this.emit("error", { from: this.name, error });
    }

    getLog() {
        return this.log;
    }
}