import pino from 'pino';

export const getLogger = (name: string, debugMode = true) => {
  return pino({
    name,
    transport: {
      target: 'pino-pretty',
    },
    level: debugMode ? 'debug' : 'silent',
  });
};
