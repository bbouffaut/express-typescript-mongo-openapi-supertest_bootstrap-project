import { Server } from 'http';
import { DEFAULT_LISTENING_PORT } from '@meteo-france-api/utils/constants';
import { createServer } from '@meteo-france-api/utils/server';
import config from './config';

const main = async () => {
    try {
        /** Server */
        const httpServer: Server = await createServer();
        httpServer.listen(config.port, () => console.log(`The server is running on port ${config.port}`));
    } catch (e) {
        const error: Error = e as Error;
        console.error(`Error occured: ${error.message}`);
    }
}

main();





