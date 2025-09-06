<template>
	<div class="playground">
		<h1>Nuxt Varioqub Module Playground</h1>
		
		<div class="status">
			<h2>Status</h2>
			<p>Ready: {{ isReady ? 'Yes' : 'No' }}</p>
		</div>

		<div class="flags">
			<h2>Feature Flags</h2>
			<div v-if="Object.keys(flags).length === 0" class="empty">
				No flags available
			</div>
			<div v-else class="flags-list">
				<div 
					v-for="(value, flag) in flags" 
					:key="flag" 
					class="flag-item"
				>
					<strong>{{ flag }}:</strong> {{ JSON.stringify(value) }}
				</div>
			</div>
		</div>

		<div class="experiments">
			<h2>Active Experiments</h2>
			<div v-if="activeExperiments.length === 0" class="empty">
				No active experiments
			</div>
			<div v-else class="experiments-list">
				<div 
					v-for="experiment in activeExperiments" 
					:key="experiment" 
					class="experiment-item"
				>
					{{ experiment }}
				</div>
			</div>
		</div>

		<div class="test-ids">
			<h2>Test IDs</h2>
			<div v-if="testids.length === 0" class="empty">
				No test IDs
			</div>
			<div v-else class="test-ids-list">
				<div 
					v-for="testId in testids" 
					:key="testId" 
					class="test-id-item"
				>
					{{ testId }}
				</div>
			</div>
		</div>

		<div class="examples">
			<h2>Usage Examples</h2>
			<div class="example">
				<h3>Check if flag exists:</h3>
				<code>const { hasFlag } = useVarioqub();<br>
				const flag = hasFlag('my-flag');<br>
				console.log(flag.exists, flag.value);</code>
			</div>
			<div class="example">
				<h3>Get flag value with default:</h3>
				<code>const { getFlagValue } = useVarioqub();<br>
				const value = getFlagValue('my-flag', ['default']);</code>
			</div>
			<div class="example">
				<h3>Check experiment:</h3>
				<code>const { isExperimentActive } = useVarioqub();<br>
				const isActive = isExperimentActive('exp-123');</code>
			</div>
		</div>

		<div class="devtools-info" v-if="isDevMode">
			<h2>🛠️ DevTools</h2>
			<p>В режиме разработки доступны интерактивные DevTools:</p>
			<ul>
				<li>Переключение флагов в реальном времени</li>
				<li>Управление экспериментами</li>
				<li>Добавление/удаление тестовых ID</li>
				<li>Сброс к оригинальным значениям</li>
			</ul>
			<p>Откройте DevTools через <code>/__varioqub_devtools</code> или через панель Nuxt DevTools</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useVarioqub } from '#imports';

const { 
	flags, 
	experiments, 
	testids, 
	isReady, 
	isDevMode,
	getActiveExperiments 
} = useVarioqub();

const activeExperiments = computed(() => getActiveExperiments());
</script>

<style scoped>
.playground {
	max-width: 800px;
	margin: 0 auto;
	padding: 20px;
	font-family: ui-sans-serif, system-ui, sans-serif;
}

h1 {
	color: #1f2937;
	margin-bottom: 30px;
}

h2 {
	color: #374151;
	margin: 20px 0 10px 0;
	font-size: 18px;
}

h3 {
	color: #4b5563;
	margin: 15px 0 5px 0;
	font-size: 14px;
}

.status, .flags, .experiments, .test-ids, .examples, .devtools-info {
	margin-bottom: 30px;
	padding: 20px;
	background: #f9fafb;
	border-radius: 8px;
	border: 1px solid #e5e7eb;
}

.devtools-info {
	background: #fef3c7;
	border-color: #f59e0b;
}

.devtools-info h2 {
	color: #92400e;
	margin-bottom: 12px;
}

.devtools-info ul {
	margin: 12px 0;
	padding-left: 20px;
}

.devtools-info li {
	margin-bottom: 4px;
	color: #92400e;
}

.devtools-info code {
	background: #fbbf24;
	color: #92400e;
	padding: 2px 6px;
	border-radius: 4px;
	font-size: 12px;
}

.empty {
	color: #6b7280;
	font-style: italic;
}

.flags-list, .experiments-list, .test-ids-list {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.flag-item, .experiment-item, .test-id-item {
	padding: 8px 12px;
	background: white;
	border-radius: 4px;
	border: 1px solid #d1d5db;
}

.example {
	margin-bottom: 15px;
	padding: 12px;
	background: white;
	border-radius: 4px;
	border: 1px solid #d1d5db;
}

.example code {
	display: block;
	font-family: 'Monaco', 'Menlo', monospace;
	font-size: 12px;
	color: #374151;
	white-space: pre-line;
}
</style>
