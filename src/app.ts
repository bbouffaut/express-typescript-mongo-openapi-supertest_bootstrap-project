import { Server } from 'http';
import { DEFAULT_LISTENING_PORT } from './utils/constants';
import { createServer } from './utils/server';

const main = async () => {
    try {
        /** Server */
        const httpServer: Server = await createServer();
        const port: number | undefined = (process.env.PORT != undefined) ? +process.env.PORT : undefined;
        const PORT: number | undefined = port ?? DEFAULT_LISTENING_PORT;
        httpServer.listen(PORT, () => console.log(`The server is running on port ${PORT}`));
    } catch (e) {
        const error: Error = e as Error;
        console.error(`Error occured: ${error.message}`);
    }
}

main();





