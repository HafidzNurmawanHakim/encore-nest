import { plainToInstance, ClassConstructor } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { APIError } from 'encore.dev/api';

/**
 * Validates a plain object against a DTO class using class-validator.
 * Throws Encore APIError.InvalidArgument if validation fails.
 */
export async function validateDto<T extends object>(
  cls: ClassConstructor<T>,
  plain: unknown,
): Promise<T> {
  const instance = plainToInstance(cls, plain);
  const errors = await validate(instance);

  if (errors.length > 0) {
    const messages = formatValidationErrors(errors);
    throw APIError.invalidArgument(messages.join('; '));
  }

  return instance;
}

function formatValidationErrors(errors: ValidationError[]): string[] {
  const messages: string[] = [];
  for (const error of errors) {
    if (error.constraints) {
      messages.push(...Object.values(error.constraints));
    }
    if (error.children && error.children.length > 0) {
      messages.push(...formatValidationErrors(error.children));
    }
  }
  return messages;
}
