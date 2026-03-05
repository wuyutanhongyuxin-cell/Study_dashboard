export function getAIErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

export function isAIAuthError(error: unknown): boolean {
  if (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    (error as { status?: unknown }).status === 401
  ) {
    return true;
  }

  const message = getAIErrorMessage(error).toLowerCase();
  return (
    message.includes('authentication_error') ||
    message.includes('invalid x-api-key') ||
    message.includes('invalid api key') ||
    message.includes('invalid api-key') ||
    message.includes('unauthorized') ||
    message.includes('status code 401')
  );
}
