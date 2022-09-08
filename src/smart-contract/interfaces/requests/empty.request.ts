import { CallMethodSignature } from '../call-method-signature';

export type EmptyRequest = CallMethodSignature<Record<string, never>>;
