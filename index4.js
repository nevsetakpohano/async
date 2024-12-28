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
