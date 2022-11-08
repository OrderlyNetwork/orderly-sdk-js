import { BaseLogger } from 'pino';

import { getLogger } from '../../logger';

export class GenericClient {
  protected logger: BaseLogger;

  constructor(name: string, debug: boolean) {
    this.logger = getLogger(name, debug);
  }
}
