"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressDevLogger = void 0;
const expressDevLogger = (req, res, next) => {
    const startHrTime = process.hrtime();
    console.log(`Request: ${req.method} ${req.url} at ${new Date().toUTCString()}, User-Agent: ${req.get('User-Agent')}`);
    console.log(`Request Body: ${JSON.stringify(req.body)}`);
    const [oldWrite, oldEnd] = [res.write, res.end];
    const chunks = [];
    res.write = (chunk, ...args) => {
        chunks.push(Buffer.from(chunk));
        // eslint-disable-next-line @typescript-eslint/ban-types
        oldWrite.apply(res, args);
    };
    res.end = (chunk, ...args) => {
        if (chunk) {
            chunks.push(Buffer.from(chunk));
        }
        const elapsedHrTime = process.hrtime(startHrTime);
        const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
        console.log(`Response ${res.statusCode} ${elapsedTimeInMs.toFixed(3)} ms`);
        const body = Buffer.concat(chunks).toString('utf8');
        console.log(`Response Body: ${body}`);
        // eslint-disable-next-line @typescript-eslint/ban-types
        oldEnd.apply(res, args);
    };
    next();
};
exports.expressDevLogger = expressDevLogger;
