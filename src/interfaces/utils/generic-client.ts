import { BaseLogger } from 'pino';

import { getLogger } from '../../logger';

export class GenericClient {
  logger: BaseLogger;

  constructor(name: string, debug: boolean) {
    this.logger = getLogger(name, debug);
  }
}
