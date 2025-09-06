export interface ModuleOptions {
	clientId: number;
	cookieName?: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	clientFeatures?: any;
	mode?: 'all' | 'server' | 'client';
}

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

// Экспорт типов для использования в приложениях
export type { VarioqubState, VarioqubFlag, VarioqubReturn, ModuleOptions };
