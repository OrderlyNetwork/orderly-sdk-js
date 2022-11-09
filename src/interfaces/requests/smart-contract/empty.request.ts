import { CallMethodSignature } from '../../utils';

export type EmptyRequest = CallMethodSignature<Record<string, never>>;
