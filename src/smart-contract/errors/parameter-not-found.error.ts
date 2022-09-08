export class ParameterNotFoundError extends Error {
  constructor(parameterName: string) {
    super(`${parameterName} parameter is not set. Please add it to your env file.`);
  }
}
