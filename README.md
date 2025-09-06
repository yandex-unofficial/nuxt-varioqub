# Nuxt Varioqub

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

A Nuxt module for seamless integration with Yandex Varioqub, enabling A/B testing in your application.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)
<!-- - [🏀 Online playground](https://stackblitz.com/github/your-org/my-module?file=playground%2Fapp.vue) -->
<!-- - [📖 &nbsp;Documentation](https://example.com) -->

## Features

- 🚀 **Server & Client Support** - Works in both server-side and client-side modes
- 🎯 **Feature Flags** - Easy access to Yandex Varioqub feature flags
- 🧪 **A/B Testing** - Built-in support for experiments and test IDs
- 📱 **Reactive** - Fully reactive composable with Vue 3 Composition API
- 🔧 **TypeScript** - Full TypeScript support with type definitions
- 🛠️ **DevTools** - Built-in Nuxt DevTools integration for debugging
- ⚡ **Performance** - Optimized for performance with smart caching
- 🎨 **Developer Experience** - Intuitive API with comprehensive documentation

## Quick Setup

Install the module to your Nuxt application with one command:

```bash
npx nuxi module add @yandex-unofficial/nuxt-varioqub
```

That's it! You can now use Nuxt Varioqub in your Nuxt app ✨

## Configuration

Add the module to your `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  modules: ['@yandex-unofficial/nuxt-varioqub'],
  
  varioqub: {
    clientId: 12345678, // Required: Your Yandex Metrika client ID
    mode: 'all', // Optional: 'server' | 'client' | 'all' (default: 'server')
    cookieName: '_ymab_param', // Optional: Cookie name for tracking (default: '_ymab_param')
    clientFeatures: { // Optional: Additional client features
      feature1: true,
      feature2: 'test'
    }
  }
})
```

## Usage

### Basic Usage

```vue
<template>
  <div>
    <h1 v-if="isNewFeatureEnabled">New Feature is Active!</h1>
    <p>Active experiments: {{ activeExperiments.join(', ') }}</p>
  </div>
</template>

<script setup>
const { 
  hasFlag, 
  isExperimentActive, 
  getActiveExperiments,
  isReady 
} = useVarioqub()

// Check if a feature flag exists
const { exists, value } = hasFlag('new-feature')
const isNewFeatureEnabled = exists

// Check if an experiment is active
const isExperimentRunning = isExperimentActive('exp-123')

// Get all active experiments
const activeExperiments = getActiveExperiments()

// Check if Varioqub is ready
if (isReady) {
  console.log('Varioqub is ready!')
}
</script>
```

### Advanced Usage

```vue
<script setup>
const { 
  getFlagValue,
  getAllFlags,
  hasTestId,
  getAllTestIds,
  flags,
  experiments,
  testids
} = useVarioqub()

// Get flag value with default
const flagValue = getFlagValue('my-flag', ['default-value'])

// Get all flags
const allFlags = getAllFlags()

// Check test ID
const hasTest = hasTestId(12345)

// Get all test IDs
const allTestIds = getAllTestIds()

// Reactive properties
watch(flags, (newFlags) => {
  console.log('Flags updated:', newFlags)
})
</script>
```

## API Reference

### `useVarioqub()`

Returns a composable with the following methods and properties:

#### Methods

- **`hasFlag(flag: string)`** - Check if a flag exists and get its value
- **`getFlagValue(flag: string, defaultValue?: string[])`** - Get flag value with optional default
- **`getAllFlags()`** - Get all available flags
- **`isExperimentActive(experimentId: string)`** - Check if an experiment is active
- **`getActiveExperiments()`** - Get all active experiment IDs
- **`hasTestId(testId: number)`** - Check if a test ID is active
- **`getAllTestIds()`** - Get all active test IDs

#### Reactive Properties

- **`flags`** - Reactive object with all flags
- **`experiments`** - Reactive string with active experiments
- **`testids`** - Reactive array with active test IDs
- **`isReady`** - Boolean indicating if Varioqub is ready

## Modes

The module supports three different modes:

- **`server`** (default) - Only runs on the server side
- **`client`** - Only runs on the client side  
- **`all`** - Runs on both server and client side

## DevTools

In development mode, the module automatically integrates with Nuxt DevTools, providing a dedicated tab to inspect:

- Current feature flags
- Active experiments
- Test IDs
- Raw data from Varioqub API

Access it through the Nuxt DevTools panel in your browser.


## Contribution

<details>
  <summary>Local development</summary>
  
  ```bash
  # Install dependencies
  pnpm install
  
  # Generate type stubs
  pnpm run dev:prepare
  
  # Develop with the playground
  pnpm run dev
  
  # Build the playground
  pnpm run dev:build
  
  # Run ESLint
  pnpm run lint
  
  # Run Vitest
  pnpm run test
  pnpm run test:watch
  
  # Release new version
  pnpm run release
  ```

</details>


<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@yandex-unofficial/nuxt-varioqub/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/@yandex-unofficial/nuxt-varioqub

[npm-downloads-src]: https://img.shields.io/npm/dm/@yandex-unofficial/nuxt-varioqub.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/@yandex-unofficial/nuxt-varioqub

[license-src]: https://img.shields.io/npm/l/@yandex-unofficial/nuxt-varioqub.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/@yandex-unofficial/nuxt-varioqub

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com
