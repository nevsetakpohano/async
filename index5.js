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

function setupListeners(system) {
    system.on("message", (data) => {
        console.log(`[${data.from} -> ${data.to}]: ${data.message}`);
    });

    system.on("error", (data) => {
        console.error(`[${data.from}]: Error occurred: ${data.error}`);
    });
}

(async () => {
    const systemA = new ReactiveSystem("System A");
    const systemB = new ReactiveSystem("System B");

    setupListeners(systemA);
    setupListeners(systemB);

    systemA.sendMessage(systemB, "Hello from A");
    systemB.sendMessage(systemA, "Hello from B");

    await new Promise((resolve) => setTimeout(resolve, 3000));

    systemA.sendError("An error occurred in A");

    console.log("\nSystem A Log:", systemA.getLog());
    console.log("System B Log:", systemB.getLog());
})();