import { CallMethodSignature } from '../utils/call-method-signature';

export type EmptyRequest = CallMethodSignature<Record<string, never>>;
