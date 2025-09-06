<template>
	<div class="varioqub-devtools">
		<div class="header">
			<h2>Varioqub DevTools</h2>
			<div class="header-actions">
				<div class="status" :class="{ ready: isReady }">
					{{ isReady ? 'Ready' : 'Loading...' }}
				</div>
				<button 
					v-if="isDevMode" 
					@click="resetToOriginal" 
					class="reset-btn"
					title="Reset to original values"
				>
					🔄 Reset
				</button>
			</div>
		</div>

		<div v-if="!isReady" class="loading">
			<p>Loading experiments...</p>
		</div>

		<div v-else class="content">
			<!-- Flags Section -->
			<div class="section">
				<div class="section-header">
					<h3>Feature Flags</h3>
					<button 
						v-if="isDevMode" 
						@click="addNewFlag" 
						class="add-btn"
						title="Add new flag"
					>
						+ Add Flag
					</button>
				</div>
				<div v-if="Object.keys(flags).length === 0" class="empty">
					No flags available
				</div>
				<div v-else class="flags">
					<div 
						v-for="(value, flag) in flags" 
						:key="flag" 
						class="flag-item"
					>
						<div class="flag-header">
							<div class="flag-name">{{ flag }}</div>
							<div class="flag-actions" v-if="isDevMode">
								<button 
									@click="toggleFlag(flag)" 
									class="toggle-btn"
									:class="{ active: value && value.length > 0 }"
									:title="value && value.length > 0 ? 'Disable flag' : 'Enable flag'"
								>
									{{ value && value.length > 0 ? 'ON' : 'OFF' }}
								</button>
								<button 
									@click="removeFlag(flag)" 
									class="remove-btn"
									title="Remove flag"
								>
									×
								</button>
							</div>
						</div>
						<div class="flag-value">
							<input 
								v-if="isDevMode" 
								v-model="flagValues[flag]" 
								@blur="updateFlagValue(flag)"
								@keyup.enter="updateFlagValue(flag)"
								class="flag-input"
								placeholder="Enter flag values (comma separated)"
							/>
							<span v-else>{{ JSON.stringify(value) }}</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Experiments Section -->
			<div class="section">
				<div class="section-header">
					<h3>Active Experiments</h3>
					<button 
						v-if="isDevMode" 
						@click="addNewExperiment" 
						class="add-btn"
						title="Add new experiment"
					>
						+ Add Experiment
					</button>
				</div>
				<div v-if="activeExperiments.length === 0" class="empty">
					No active experiments
				</div>
				<div v-else class="experiments">
					<div 
						v-for="experiment in activeExperiments" 
						:key="experiment" 
						class="experiment-item"
					>
						<div class="experiment-name">{{ experiment }}</div>
						<button 
							v-if="isDevMode" 
							@click="toggleExperiment(experiment)" 
							class="toggle-btn active"
							title="Disable experiment"
						>
							ON
						</button>
					</div>
				</div>
			</div>

			<!-- Test IDs Section -->
			<div class="section">
				<div class="section-header">
					<h3>Test IDs</h3>
					<button 
						v-if="isDevMode" 
						@click="addNewTestId" 
						class="add-btn"
						title="Add new test ID"
					>
						+ Add Test ID
					</button>
				</div>
				<div v-if="testids.length === 0" class="empty">
					No test IDs
				</div>
				<div v-else class="test-ids">
					<div 
						v-for="testId in testids" 
						:key="testId" 
						class="test-id-item"
					>
						<div class="test-id-value">{{ testId }}</div>
						<button 
							v-if="isDevMode" 
							@click="toggleTestId(testId)" 
							class="toggle-btn active"
							title="Disable test ID"
						>
							ON
						</button>
					</div>
				</div>
			</div>

			<!-- Raw Data Section -->
			<div class="section">
				<h3>Raw Data</h3>
				<pre class="raw-data">{{ JSON.stringify(rawData, null, 2) }}</pre>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useVarioqub } from './composables/useVarioqub';

const { 
	flags, 
	experiments, 
	testids, 
	isReady, 
	isDevMode,
	getActiveExperiments,
	setFlag,
	setExperiment,
	setTestId,
	resetToOriginal
} = useVarioqub();

const activeExperiments = computed(() => getActiveExperiments());

// Локальные значения для редактирования флагов
const flagValues = ref<Record<string, string>>({});

// Инициализируем значения флагов для редактирования
watch(flags, (newFlags) => {
	flagValues.value = {};
	Object.keys(newFlags).forEach(flag => {
		flagValues.value[flag] = newFlags[flag].join(', ');
	});
}, { immediate: true });

const rawData = computed(() => ({
	flags: flags.value,
	experiments: experiments.value,
	testids: testids.value,
}));

// Методы для управления флагами
const toggleFlag = (flag: string) => {
	const currentValue = flags.value[flag];
	if (currentValue && currentValue.length > 0) {
		setFlag(flag, null); // Удаляем флаг
	} else {
		setFlag(flag, ['enabled']); // Добавляем флаг с дефолтным значением
	}
};

const removeFlag = (flag: string) => {
	setFlag(flag, null);
};

const updateFlagValue = (flag: string) => {
	const value = flagValues.value[flag];
	if (value.trim()) {
		const values = value.split(',').map(v => v.trim()).filter(Boolean);
		setFlag(flag, values);
	} else {
		setFlag(flag, null);
	}
};

const addNewFlag = () => {
	const flagName = prompt('Enter flag name:');
	if (flagName && flagName.trim()) {
		setFlag(flagName.trim(), ['enabled']);
	}
};

// Методы для управления экспериментами
const toggleExperiment = (experimentId: string) => {
	setExperiment(experimentId, false);
};

const addNewExperiment = () => {
	const experimentId = prompt('Enter experiment ID:');
	if (experimentId && experimentId.trim()) {
		setExperiment(experimentId.trim(), true);
	}
};

// Методы для управления тестовыми ID
const toggleTestId = (testId: number) => {
	setTestId(testId, false);
};

const addNewTestId = () => {
	const testIdStr = prompt('Enter test ID:');
	const testId = parseInt(testIdStr);
	if (!isNaN(testId)) {
		setTestId(testId, true);
	} else {
		alert('Please enter a valid number');
	}
};
</script>

<style scoped>
.varioqub-devtools {
	padding: 20px;
	font-family: ui-sans-serif, system-ui, sans-serif;
}

.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20px;
	padding-bottom: 10px;
	border-bottom: 1px solid #e5e7eb;
}

.header h2 {
	margin: 0;
	color: #1f2937;
}

.header-actions {
	display: flex;
	align-items: center;
	gap: 12px;
}

.status {
	padding: 4px 8px;
	border-radius: 4px;
	font-size: 12px;
	font-weight: 500;
	background: #f3f4f6;
	color: #6b7280;
}

.status.ready {
	background: #d1fae5;
	color: #065f46;
}

.reset-btn {
	padding: 6px 12px;
	background: #ef4444;
	color: white;
	border: none;
	border-radius: 4px;
	font-size: 12px;
	font-weight: 500;
	cursor: pointer;
	transition: background-color 0.2s;
}

.reset-btn:hover {
	background: #dc2626;
}

.loading {
	text-align: center;
	padding: 40px;
	color: #6b7280;
}

.section {
	margin-bottom: 24px;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 12px;
}

.section h3 {
	margin: 0;
	color: #374151;
	font-size: 16px;
	font-weight: 600;
}

.add-btn {
	padding: 4px 8px;
	background: #3b82f6;
	color: white;
	border: none;
	border-radius: 4px;
	font-size: 12px;
	font-weight: 500;
	cursor: pointer;
	transition: background-color 0.2s;
}

.add-btn:hover {
	background: #2563eb;
}

.empty {
	color: #6b7280;
	font-style: italic;
	padding: 12px;
	background: #f9fafb;
	border-radius: 6px;
}

.flags, .experiments, .test-ids {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.flag-item, .experiment-item, .test-id-item {
	padding: 12px;
	background: #f9fafb;
	border-radius: 6px;
	border: 1px solid #e5e7eb;
}

.flag-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 8px;
}

.flag-name, .experiment-name, .test-id-value {
	font-weight: 500;
	color: #1f2937;
}

.flag-actions {
	display: flex;
	gap: 8px;
}

.toggle-btn {
	padding: 4px 8px;
	border: none;
	border-radius: 4px;
	font-size: 11px;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s;
	background: #f3f4f6;
	color: #6b7280;
}

.toggle-btn.active {
	background: #10b981;
	color: white;
}

.toggle-btn:hover {
	opacity: 0.8;
}

.remove-btn {
	padding: 4px 6px;
	background: #ef4444;
	color: white;
	border: none;
	border-radius: 4px;
	font-size: 12px;
	font-weight: 500;
	cursor: pointer;
	transition: background-color 0.2s;
}

.remove-btn:hover {
	background: #dc2626;
}

.flag-value {
	margin-top: 4px;
}

.flag-input {
	width: 100%;
	padding: 6px 8px;
	border: 1px solid #d1d5db;
	border-radius: 4px;
	font-family: 'Monaco', 'Menlo', monospace;
	font-size: 12px;
	color: #374151;
	background: white;
}

.flag-input:focus {
	outline: none;
	border-color: #3b82f6;
	box-shadow: 0 0 0 1px #3b82f6;
}

.experiment-item, .test-id-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.raw-data {
	background: #1f2937;
	color: #f9fafb;
	padding: 16px;
	border-radius: 6px;
	font-family: 'Monaco', 'Menlo', monospace;
	font-size: 12px;
	overflow-x: auto;
	margin: 0;
}
</style>
