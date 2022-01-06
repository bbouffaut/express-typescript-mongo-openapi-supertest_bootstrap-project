import { Server } from 'http';
import { createServer } from '@meteo-france-api/utils/server';
import config from '@meteo-france-api/config';
import logger from '@meteo-france-api/utils/logger';

const main = async () => {
    try {
        /** Server */
        const httpServer: Server = await createServer();
        httpServer.listen(config.port, () => logger.http(`The server is running on port ${config.port}`));
    } catch (e) {
        const error: Error = e as Error;
        logger.error(`Error occured: ${error.message}`);
    }
}

main();





