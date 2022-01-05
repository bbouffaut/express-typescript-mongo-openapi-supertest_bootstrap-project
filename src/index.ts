import express, { Application } from "express";
import morgan from "morgan";
import http from 'http';
import { DEFAULT_LISTENING_PORT } from './constants';
import { router as massifs_v1 } from './routes/v1/massifs';
import { router as beras_v1 } from './routes/v1/beras';



const app: Application = express();

/** Logging */
app.use(morgan('dev'));

// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/** RULES OF OUR API */
app.use((req, res, next) => {
    // set the CORS policy
    res.header('Access-Control-Allow-Origin', '*');
    // set the CORS headers
    res.header('Access-Control-Allow-Headers', 'origin, X-Requested-With,Content-Type,Accept, Authorization');
    // set the CORS method headers
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET');
        return res.status(200).json({});
    }
    next();
});

/** Routes */
app.use('/v1/', massifs_v1);
app.use('/v1/', beras_v1);

/** Error handling */
app.use((req, res, next) => {
    const error = new Error('not found');
    return res.status(404).json({
        message: error.message
    });
});

try {
    /** Server */
    const httpServer = http.createServer(app);
    const port: number | undefined = (process.env.PORT != undefined) ? +process.env.PORT : undefined;
    const PORT: number | undefined = port ?? DEFAULT_LISTENING_PORT;
    httpServer.listen(PORT, () => console.log(`The server is running on port ${PORT}`));
} catch (e) {
    const error: Error = e as Error;
    console.error(`Error occured: ${error.message}`);
}

