document.getElementById('startTest').addEventListener('click', function () {
    document.getElementById('results').innerHTML = 'Testing...';
    performPingTest();
});

const url = `${window.location.protocol}//${window.location.host}`;

function performPingTest() {
    const startTime = new Date();
    fetch(`${url}/ping`)
        .then(response => response.json())
        .then(data => {
            const endTime = new Date();
            const ping = endTime - startTime;
            document.getElementById('results').innerHTML = 'Ping: ' + ping + 'ms<br>';
            performDownloadTest();
        });
}

function performDownloadTest() {
    const startTime = new Date();
    let totalSize = 0;

    fetch(`${url}/download`)
        .then(response => {
            const reader = response.body.getReader();

            return reader.read().then(function processResult(result) {
                if (result.done) {
                    const endTime = new Date();
                    const duration = (endTime - startTime) / 1000; // Convert to seconds
                    const speed = totalSize / duration / 1024 / 1024 * 8; // Convert to Mbps
                    console.log(totalSize);
                    console.log(duration);
                    console.log(speed);

                    document.getElementById('results').innerHTML += 'Download Speed: ' + speed.toFixed(2) + ' Mbps<br>';
                    document.getElementById('results').innerHTML += 'Total Downloaded Data: ' + formatData(totalSize) + '<br>';
                    performUploadTest();
                    return;
                }

                totalSize += result.value.length;
                return reader.read().then(processResult);
            });
        })
        .catch(error => {
            console.error('Error during download test:', error);
            document.getElementById('results').innerHTML += 'Error during download test. Please try again.<br>';
        });
}



function performUploadTest() {
    const largeString = 'a'.repeat(1 * 1024 * 1024);
    const encoder = new TextEncoder();
    const dataToSend = new Blob([encoder.encode(largeString)]);

    const startTime = new Date();
    fetch(`${url}/upload`, {
        method: 'POST',
        body: dataToSend
    })
        .then(response => response.json())
        .then(data => {
            const endTime = new Date();
            const duration = (endTime - startTime) / 1000; // Convert to seconds
            const size = dataToSend.size; // Size in bytes
            const speed = size / duration / 1024 / 1024 * 8; // Convert to Mbps

            document.getElementById('results').innerHTML += 'Upload Speed: ' + speed.toFixed(2) + ' Mbps<br>';
            document.getElementById('results').innerHTML += 'Total Uploaded Data: ' + formatData(size) + '<br>';
        });
}

function formatData(dataSize) {
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    let sizeIndex = 0;

    while (dataSize > 1024 && sizeIndex < sizes.length - 1) {
        dataSize /= 1024;
        sizeIndex++;
    }

    return dataSize.toFixed(2) + ' ' + sizes[sizeIndex];
}
