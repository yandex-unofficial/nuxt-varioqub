export default defineNuxtConfig({
	modules: ['../src/module'],
	devtools: { enabled: true },

	compatibilityDate: '2025-01-13',

	varioqub: {
		clientId: 34625640,
		mode: 'all', // Демонстрируем поддержку всех режимов
		cookieName: '_ymab_param',
		clientFeatures: {
			// Пример дополнительных функций клиента
			feature1: true,
			feature2: 'test'
		}
	},
});
