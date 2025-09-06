import type { ModuleOptions } from '../types';

export interface ValidationError {
	field: string;
	message: string;
}

export function validateModuleOptions(options: ModuleOptions): ValidationError[] {
	const errors: ValidationError[] = [];

	// Проверяем обязательные поля
	if (!options.clientId) {
		errors.push({
			field: 'clientId',
			message: 'clientId is required and must be a number'
		});
	} else if (typeof options.clientId !== 'number' || options.clientId <= 0) {
		errors.push({
			field: 'clientId',
			message: 'clientId must be a positive number'
		});
	}

	// Проверяем cookieName
	if (options.cookieName !== undefined) {
		if (typeof options.cookieName !== 'string' || options.cookieName.trim() === '') {
			errors.push({
				field: 'cookieName',
				message: 'cookieName must be a non-empty string'
			});
		}
	}

	// Проверяем mode
	if (options.mode !== undefined) {
		const validModes = ['all', 'server', 'client'];
		if (!validModes.includes(options.mode)) {
			errors.push({
				field: 'mode',
				message: `mode must be one of: ${validModes.join(', ')}`
			});
		}
	}

	// Проверяем clientFeatures
	if (options.clientFeatures !== undefined) {
		if (typeof options.clientFeatures !== 'object' || options.clientFeatures === null) {
			errors.push({
				field: 'clientFeatures',
				message: 'clientFeatures must be an object'
			});
		}
	}

	return errors;
}

export function logValidationErrors(errors: ValidationError[]): void {
	if (errors.length === 0) return;

	console.error('[Varioqub] Configuration validation failed:');
	errors.forEach(error => {
		console.error(`  - ${error.field}: ${error.message}`);
	});
}
