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