import { useState, computed } from '#imports';

export interface VarioqubState {
	flags: Record<string, string[]>;
	experiments: string;
	testids: Array<number>;
}

export interface VarioqubFlag {
	exists: boolean;
	value: string[] | undefined;
}

export interface VarioqubReturn {
	// Основные методы
	hasFlag: (flag: string) => VarioqubFlag;
	getFlagValue: (flag: string, defaultValue?: string[]) => string[] | undefined;
	getAllFlags: () => Record<string, string[]>;
	
	// Методы для экспериментов
	isExperimentActive: (experimentId: string) => boolean;
	getActiveExperiments: () => string[];
	
	// Методы для тестов
	hasTestId: (testId: number) => boolean;
	getAllTestIds: () => number[];
	
	// Методы для изменения состояния (DevTools)
	setFlag: (flag: string, value: string[] | null) => void;
	setExperiment: (experimentId: string, active: boolean) => void;
	setTestId: (testId: number, active: boolean) => void;
	resetToOriginal: () => void;
	
	// Реактивные свойства
	flags: Readonly<Record<string, string[]>>;
	experiments: Readonly<string>;
	testids: Readonly<number[]>;
	
	// Утилиты
	isReady: boolean;
	isDevMode: boolean;
}

export function useVarioqub(): VarioqubReturn {
	const state = useState<VarioqubState>('varioqubState', () => ({
		flags: {},
		experiments: '',
		testids: [],
	}));

	// Сохраняем оригинальные значения для сброса
	const originalState = useState<VarioqubState>('varioqubOriginalState', () => ({
		flags: {},
		experiments: '',
		testids: [],
	}));

	// Реактивные вычисляемые свойства
	const flags = computed(() => state.value.flags);
	const experiments = computed(() => state.value.experiments);
	const testids = computed(() => state.value.testids);
	const isReady = computed(() => Object.keys(state.value.flags).length > 0 || state.value.experiments !== '' || state.value.testids.length > 0);
	const isDevMode = computed(() => typeof process !== 'undefined' && process.dev);

	/**
	 * Проверяет существование флага и возвращает его значение
	 * @param flag - имя флага
	 * @returns объект с информацией о флаге
	 */
	const hasFlag = (flag: string): VarioqubFlag => {
		const value = state.value.flags[flag];
		return {
			exists: value !== undefined,
			value: value
		};
	};

	/**
	 * Получает значение флага с возможностью указать значение по умолчанию
	 * @param flag - имя флага
	 * @param defaultValue - значение по умолчанию
	 * @returns значение флага или значение по умолчанию
	 */
	const getFlagValue = (flag: string, defaultValue?: string[]): string[] | undefined => {
		const flagData = hasFlag(flag);
		return flagData.exists ? flagData.value : defaultValue;
	};

	/**
	 * Получает все флаги
	 * @returns объект со всеми флагами
	 */
	const getAllFlags = (): Record<string, string[]> => {
		return { ...state.value.flags };
	};

	/**
	 * Проверяет активность эксперимента
	 * @param experimentId - ID эксперимента
	 * @returns true если эксперимент активен
	 */
	const isExperimentActive = (experimentId: string): boolean => {
		return state.value.experiments.includes(experimentId);
	};

	/**
	 * Получает список активных экспериментов
	 * @returns массив ID активных экспериментов
	 */
	const getActiveExperiments = (): string[] => {
		return state.value.experiments ? state.value.experiments.split(',').filter(Boolean) : [];
	};

	/**
	 * Проверяет наличие тестового ID
	 * @param testId - ID теста
	 * @returns true если тест активен
	 */
	const hasTestId = (testId: number): boolean => {
		return state.value.testids.includes(testId);
	};

	/**
	 * Получает все тестовые ID
	 * @returns массив всех тестовых ID
	 */
	const getAllTestIds = (): number[] => {
		return [...state.value.testids];
	};

	/**
	 * Устанавливает значение флага (только в dev режиме)
	 * @param flag - имя флага
	 * @param value - новое значение или null для удаления
	 */
	const setFlag = (flag: string, value: string[] | null): void => {
		if (!isDevMode.value) {
			console.warn('[Varioqub] setFlag is only available in development mode');
			return;
		}

		if (value === null) {
			delete state.value.flags[flag];
		} else {
			state.value.flags[flag] = value;
		}

		// Сохраняем в localStorage для персистентности
		if (typeof window !== 'undefined') {
			localStorage.setItem('varioqub-dev-flags', JSON.stringify(state.value.flags));
		}
	};

	/**
	 * Устанавливает активность эксперимента (только в dev режиме)
	 * @param experimentId - ID эксперимента
	 * @param active - активен ли эксперимент
	 */
	const setExperiment = (experimentId: string, active: boolean): void => {
		if (!isDevMode.value) {
			console.warn('[Varioqub] setExperiment is only available in development mode');
			return;
		}

		const currentExperiments = state.value.experiments ? state.value.experiments.split(',').filter(Boolean) : [];
		
		if (active && currentExperiments.indexOf(experimentId) === -1) {
			currentExperiments.push(experimentId);
		} else if (!active) {
			const index = currentExperiments.indexOf(experimentId);
			if (index !== -1) {
				currentExperiments.splice(index, 1);
			}
		}

		state.value.experiments = currentExperiments.join(',');

		// Сохраняем в localStorage
		if (typeof window !== 'undefined') {
			localStorage.setItem('varioqub-dev-experiments', state.value.experiments);
		}
	};

	/**
	 * Устанавливает активность тестового ID (только в dev режиме)
	 * @param testId - ID теста
	 * @param active - активен ли тест
	 */
	const setTestId = (testId: number, active: boolean): void => {
		if (!isDevMode.value) {
			console.warn('[Varioqub] setTestId is only available in development mode');
			return;
		}

		const currentTestIds = [...state.value.testids];
		
		if (active && currentTestIds.indexOf(testId) === -1) {
			currentTestIds.push(testId);
		} else if (!active) {
			const index = currentTestIds.indexOf(testId);
			if (index !== -1) {
				currentTestIds.splice(index, 1);
			}
		}

		state.value.testids = currentTestIds;

		// Сохраняем в localStorage
		if (typeof window !== 'undefined') {
			localStorage.setItem('varioqub-dev-testids', JSON.stringify(state.value.testids));
		}
	};

	/**
	 * Сбрасывает состояние к оригинальным значениям (только в dev режиме)
	 */
	const resetToOriginal = (): void => {
		if (!isDevMode.value) {
			console.warn('[Varioqub] resetToOriginal is only available in development mode');
			return;
		}

		state.value.flags = { ...originalState.value.flags };
		state.value.experiments = originalState.value.experiments;
		state.value.testids = [...originalState.value.testids];

		// Очищаем localStorage
		if (typeof window !== 'undefined') {
			localStorage.removeItem('varioqub-dev-flags');
			localStorage.removeItem('varioqub-dev-experiments');
			localStorage.removeItem('varioqub-dev-testids');
		}
	};

	// Загружаем сохраненные значения при инициализации (только в dev режиме)
	if (isDevMode.value && typeof window !== 'undefined') {
		try {
			const savedFlags = localStorage.getItem('varioqub-dev-flags');
			if (savedFlags) {
				state.value.flags = { ...state.value.flags, ...JSON.parse(savedFlags) };
			}

			const savedExperiments = localStorage.getItem('varioqub-dev-experiments');
			if (savedExperiments) {
				state.value.experiments = savedExperiments;
			}

			const savedTestIds = localStorage.getItem('varioqub-dev-testids');
			if (savedTestIds) {
				state.value.testids = [...state.value.testids, ...JSON.parse(savedTestIds)];
			}
		} catch (error) {
			console.warn('[Varioqub] Failed to load saved dev values:', error);
		}
	}

	return {
		// Основные методы
		hasFlag,
		getFlagValue,
		getAllFlags,
		
		// Методы для экспериментов
		isExperimentActive,
		getActiveExperiments,
		
		// Методы для тестов
		hasTestId,
		getAllTestIds,
		
		// Методы для изменения состояния (DevTools)
		setFlag,
		setExperiment,
		setTestId,
		resetToOriginal,
		
		// Реактивные свойства
		flags,
		experiments,
		testids,
		
		// Утилиты
		isReady,
		isDevMode,
	};
}
