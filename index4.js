async function* processLargeData(dataSource, batchSize, processCallback) {
    let batch = [];
    for await (const item of dataSource) {
        batch.push(item);
        if (batch.length >= batchSize) {
            yield await processCallback(batch);
            batch = [];
        }
    }
    if (batch.length > 0) {
        yield await processCallback(batch);
    }
}

async function* simulateLargeDataSource(total, delay = 50) {
    for (let i = 1; i <= total; i++) {
        await new Promise(resolve => setTimeout(resolve, delay));
        yield i;
    }
}

async function processBatch(batch) {
    console.log(`Processing batch: [${batch.join(", ")}]`);
    await new Promise(resolve => setTimeout(resolve, 500));
    return `Processed ${batch.length} items`;
}

(async () => {
    const totalItems = 25;
    const batchSize = 5;

    console.log("Start processing large dataset...");
    const dataSource = simulateLargeDataSource(totalItems);

    for await (const result of processLargeData(dataSource, batchSize, processBatch)) {
        console.log(result);
    }

    console.log("All data processed.");
})();