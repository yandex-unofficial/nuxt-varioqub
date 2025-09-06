import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useVarioqub } from '../src/runtime/composables/useVarioqub';

// Мокаем useState для тестирования
const mockState = {
	flags: { 'test-flag': ['value1', 'value2'] },
	experiments: 'exp1,exp2',
	testids: [123, 456]
};

// Мокаем useState
vi.mock('#imports', () => ({
	useState: vi.fn((key: string, defaultValue: () => any) => ({
		value: mockState
	})),
	computed: vi.fn((fn: () => any) => ({
		value: fn()
	}))
}));

describe('useVarioqub composable', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it('should return correct flag information', () => {
		const { hasFlag } = useVarioqub();
		
		const flag = hasFlag('test-flag');
		expect(flag.exists).toBe(true);
		expect(flag.value).toEqual(['value1', 'value2']);
	});

	it('should return false for non-existent flag', () => {
		const { hasFlag } = useVarioqub();
		
		const flag = hasFlag('non-existent');
		expect(flag.exists).toBe(false);
		expect(flag.value).toBeUndefined();
	});

	it('should get flag value with default', () => {
		const { getFlagValue } = useVarioqub();
		
		const value = getFlagValue('test-flag', ['default']);
		expect(value).toEqual(['value1', 'value2']);
		
		const defaultValue = getFlagValue('non-existent', ['default']);
		expect(defaultValue).toEqual(['default']);
	});

	it('should get all flags', () => {
		const { getAllFlags } = useVarioqub();
		
		const flags = getAllFlags();
		expect(flags).toEqual({ 'test-flag': ['value1', 'value2'] });
	});

	it('should check experiment activity', () => {
		const { isExperimentActive } = useVarioqub();
		
		expect(isExperimentActive('exp1')).toBe(true);
		expect(isExperimentActive('exp2')).toBe(true);
		expect(isExperimentActive('exp3')).toBe(false);
	});

	it('should get active experiments', () => {
		const { getActiveExperiments } = useVarioqub();
		
		const experiments = getActiveExperiments();
		expect(experiments).toEqual(['exp1', 'exp2']);
	});

	it('should check test ID existence', () => {
		const { hasTestId } = useVarioqub();
		
		expect(hasTestId(123)).toBe(true);
		expect(hasTestId(456)).toBe(true);
		expect(hasTestId(789)).toBe(false);
	});

	it('should get all test IDs', () => {
		const { getAllTestIds } = useVarioqub();
		
		const testIds = getAllTestIds();
		expect(testIds).toEqual([123, 456]);
	});

	it('should have reactive properties', () => {
		const { flags, experiments, testids, isReady } = useVarioqub();
		
		expect(flags.value).toEqual({ 'test-flag': ['value1', 'value2'] });
		expect(experiments.value).toBe('exp1,exp2');
		expect(testids.value).toEqual([123, 456]);
		expect(isReady.value).toBe(true);
	});
});
