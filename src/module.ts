import { defineNuxtModule, createResolver, addPlugin, addImports, addServerHandler } from '@nuxt/kit';
import defu from 'defu';
import type { ModuleOptions } from './types';
import { validateModuleOptions, logValidationErrors } from './utils/validation';

// Экспортируем типы для использования в приложениях
export type { ModuleOptions, VarioqubState, VarioqubFlag, VarioqubReturn } from './types';

export default defineNuxtModule<ModuleOptions>({
	meta: {
		name: 'nuxt-varioqub',
		configKey: 'varioqub',
	},
	defaults: {
		cookieName: '_ymab_param',
		clientFeatures: {},
		mode: 'server',
	},
	setup(options, nuxt) {
		const resolver = createResolver(import.meta.url);

		// Валидация конфигурации
		const validationErrors = validateModuleOptions(options);
		if (validationErrors.length > 0) {
			logValidationErrors(validationErrors);
			return;
		}

		nuxt.options.runtimeConfig.public.varioqub = defu(
			nuxt.options.runtimeConfig.public.varioqub,
			options,
		);

		// Добавляем плагины в зависимости от режима
		if (options.mode === 'server' || options.mode === 'all') {
			addPlugin({
				src: resolver.resolve('./runtime/plugin.server.ts'),
				mode: 'server',
			});
		}

		if (options.mode === 'client' || options.mode === 'all') {
			addPlugin({
				src: resolver.resolve('./runtime/plugin.client.ts'),
				mode: 'client',
			});
		}

		addImports({
			name: 'useVarioqub',
			from: resolver.resolve('./runtime/composables/useVarioqub'),
		});

		// DevTools интеграция (только в dev режиме)
		if (nuxt.options.dev) {
			// Добавляем DevTools плагин
			addPlugin({
				src: resolver.resolve('./runtime/devtools.ts'),
				mode: 'client',
			});

			// Добавляем серверный обработчик для DevTools
			addServerHandler({
				route: '/__varioqub_devtools',
				handler: resolver.resolve('./runtime/devtools.vue'),
			});
		}
	},
});
