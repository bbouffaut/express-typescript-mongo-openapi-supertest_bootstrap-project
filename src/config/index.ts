import { ENV_DEFAULTS_FILE, ENV_SCHEMA_FILE } from '@meteo-france-api/utils/constants';
import dotenvExtended from 'dotenv-extended';
import dotenvParseVariables from 'dotenv-parse-variables';

// Define log levels type (silent + Winston default npm)
type LogLevel = 'silent' | 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug' | 'silly'
 
const env = dotenvExtended.load({
  path: process.env.ENV_FILE,
  defaults: ENV_DEFAULTS_FILE,
  schema: ENV_SCHEMA_FILE,
  includeProcessEnv: false,
  silent: false,
  errorOnMissing: true,
  errorOnExtra: true,
});

const parsedEnv = dotenvParseVariables(env);
 
interface Config {
  morganLogger: boolean,
  morganBodyLogger: boolean,
  port: number,
  loggerLevel: LogLevel,
  localCacheTtl: number,
  mongo: {
    url: string,
    autoIndex: boolean
  },
}

const config: Config = {
  morganLogger: parsedEnv.MORGAN_LOGGER as boolean,
  morganBodyLogger: parsedEnv.MORGAN_BODY_LOGGER as boolean,
  port: parsedEnv.PORT as number,
  loggerLevel: parsedEnv.LOGGER_LEVEL as LogLevel,
  localCacheTtl: parsedEnv.LOCAL_CACHE_TTL as number,
  mongo: {
    url: parsedEnv.MONGO_URL as string,
    autoIndex: parsedEnv.MONGO_AUTO_INDEX as boolean
  },
};

export default config