// No retry handling needed for local mode
export async function retryOperation<T>(
  operation: () => Promise<T>
): Promise<T> {
  return operation();
}

export function isRetryableError(error: any): boolean {
  return false;
}

export function handleSupabaseError(error: any): string {
  return error.message || 'An error occurred';
}