const http = require('http');

const endpoints = [
    '/',
    '/about',
    '/communities',
    '/server-admin/overview',
    '/server-admin/users',
    '/login',
    '/signup',
    '/server-admin/messages' // New page
];

const checkEndpoint = (path) => {
    return new Promise((resolve) => {
        http.get({
            hostname: 'localhost',
            port: 3000,
            path: path,
            agent: false
        }, (res) => {
            // Consume response to free memory
            res.resume();
            if (res.statusCode >= 200 && res.statusCode < 400) {
                console.log(`✅ [${res.statusCode}] ${path}`);
                resolve(true);
            } else {
                console.log(`❌ [${res.statusCode}] ${path}`);
                resolve(false);
            }
        }).on('error', (e) => {
            console.log(`❌ [ERROR] ${path}: ${e.message}`);
            resolve(false);
        });
    });
};

async function run() {
    console.log('Starting Smoke Test on localhost:3000...\n');

    // Wait a bit for server to be ready if just started
    // await new Promise(r => setTimeout(r, 2000));

    let success = true;
    for (const path of endpoints) {
        const result = await checkEndpoint(path);
        if (!result) success = false;
    }

    if (success) {
        console.log('\nAll endpoints reachable!');
        process.exit(0);
    } else {
        console.log('\nSome endpoints failed. Please check server logs.');
        process.exit(1);
    }
}

run();
