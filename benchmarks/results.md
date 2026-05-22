# Framework Benchmark Results

Configuration: 20 iterations, 1 warmup, 5 suite(s). Timings measured in-browser with `performance.now()`.

## Cold Start & Initialization (Median ms)

| Test | DOThtml | React | Vue | Svelte |
| --- | --- | --- | --- | --- |
| First Contentful Paint | 28.00ms | 28.00ms | 28.00ms | 28.00ms |
| DOM Interactive | 4.75ms | 4.70ms | 4.65ms | 4.80ms |
| Framework Ready | 14.35ms | 6.35ms | 7.85ms | 5.60ms |

## DOM Operations (Median ms)

| Test | DOThtml | React | Vue | Svelte |
| --- | --- | --- | --- | --- |
| Create 1,000 rows | 6.93ms | 6.69ms | 6.14ms | 5.93ms |
| Create 10,000 rows | 721.85ms | 624.95ms | 473.35ms | 465.85ms |
| Append 1,000 rows | 7.64ms | 70.08ms | 51.99ms | 50.07ms |
| Update every 10th row | 0.14ms | 0.14ms | 0.14ms | 0.15ms |
| Swap Rows | 0.14ms | 0.14ms | 0.14ms | 0.14ms |
| Clear | 1.45ms | 1.45ms | 1.45ms | 1.46ms |

## Reactive Styling Performance (Median ms)

| Test | DOThtml | React | Vue | Svelte |
| --- | --- | --- | --- | --- |
| Bulk Style Update | 0.15ms | 0.31ms | 0.21ms | 0.21ms |

## Detailed Statistics

### Cold Start

#### First Contentful Paint

| Framework | Mean | Median | Std Dev | Min | Max |
| --- | --- | --- | --- | --- | --- |
| dothtml | 29.60ms | 28.00ms | 12.33ms | 20.00ms | 100.00ms |
| react | 29.20ms | 28.00ms | 5.10ms | 20.00ms | 40.00ms |
| vue | 28.40ms | 28.00ms | 5.26ms | 20.00ms | 44.00ms |
| svelte | 28.60ms | 28.00ms | 5.21ms | 20.00ms | 40.00ms |

#### DOM Interactive

| Framework | Mean | Median | Std Dev | Min | Max |
| --- | --- | --- | --- | --- | --- |
| dothtml | 4.88ms | 4.75ms | 0.84ms | 4.10ms | 11.30ms |
| react | 4.88ms | 4.70ms | 0.62ms | 4.10ms | 7.80ms |
| vue | 4.85ms | 4.65ms | 0.69ms | 4.10ms | 9.60ms |
| svelte | 5.03ms | 4.80ms | 0.59ms | 4.20ms | 7.70ms |

#### Framework Ready

| Framework | Mean | Median | Std Dev | Min | Max |
| --- | --- | --- | --- | --- | --- |
| dothtml | 15.79ms | 14.35ms | 5.27ms | 12.30ms | 43.00ms |
| react | 7.03ms | 6.35ms | 2.34ms | 5.70ms | 20.60ms |
| vue | 8.71ms | 7.85ms | 4.07ms | 6.90ms | 28.00ms |
| svelte | 5.84ms | 5.60ms | 0.89ms | 4.80ms | 9.80ms |

### DOM Operations

#### Create 1,000 rows

| Framework | Mean | Median | Std Dev | Min | Max |
| --- | --- | --- | --- | --- | --- |
| dothtml | 7.13ms | 6.93ms | 0.68ms | 6.36ms | 10.01ms |
| react | 7.13ms | 6.69ms | 1.02ms | 6.06ms | 11.51ms |
| vue | 6.41ms | 6.14ms | 0.85ms | 5.46ms | 11.39ms |
| svelte | 6.14ms | 5.93ms | 1.04ms | 5.20ms | 11.03ms |

#### Create 10,000 rows

| Framework | Mean | Median | Std Dev | Min | Max |
| --- | --- | --- | --- | --- | --- |
| dothtml | 768.11ms | 721.85ms | 100.08ms | 665.70ms | 1301.80ms |
| react | 641.22ms | 624.95ms | 54.14ms | 582.60ms | 882.90ms |
| vue | 505.10ms | 473.35ms | 61.54ms | 439.20ms | 1012.80ms |
| svelte | 475.36ms | 465.85ms | 41.29ms | 435.60ms | 617.90ms |

#### Append 1,000 rows

| Framework | Mean | Median | Std Dev | Min | Max |
| --- | --- | --- | --- | --- | --- |
| dothtml | 7.79ms | 7.64ms | 0.66ms | 6.88ms | 11.25ms |
| react | 70.87ms | 70.08ms | 3.66ms | 63.88ms | 93.05ms |
| vue | 52.72ms | 51.99ms | 2.48ms | 49.85ms | 64.11ms |
| svelte | 50.89ms | 50.07ms | 4.56ms | 45.12ms | 88.97ms |

#### Update every 10th row

| Framework | Mean | Median | Std Dev | Min | Max |
| --- | --- | --- | --- | --- | --- |
| dothtml | 0.14ms | 0.14ms | 0.01ms | 0.06ms | 0.15ms |
| react | 0.14ms | 0.14ms | 0.00ms | 0.14ms | 0.15ms |
| vue | 0.15ms | 0.14ms | 0.00ms | 0.14ms | 0.15ms |
| svelte | 0.15ms | 0.15ms | 0.00ms | 0.14ms | 0.15ms |

#### Swap Rows

| Framework | Mean | Median | Std Dev | Min | Max |
| --- | --- | --- | --- | --- | --- |
| dothtml | 0.14ms | 0.14ms | 0.00ms | 0.14ms | 0.15ms |
| react | 0.14ms | 0.14ms | 0.00ms | 0.14ms | 0.15ms |
| vue | 0.14ms | 0.14ms | 0.00ms | 0.14ms | 0.15ms |
| svelte | 0.15ms | 0.14ms | 0.00ms | 0.09ms | 0.15ms |

#### Clear

| Framework | Mean | Median | Std Dev | Min | Max |
| --- | --- | --- | --- | --- | --- |
| dothtml | 1.45ms | 1.45ms | 0.02ms | 1.42ms | 1.50ms |
| react | 1.44ms | 1.45ms | 0.02ms | 1.33ms | 1.50ms |
| vue | 1.45ms | 1.45ms | 0.02ms | 1.42ms | 1.50ms |
| svelte | 1.46ms | 1.46ms | 0.03ms | 1.10ms | 1.50ms |

### Styling

#### Bulk Style Update

| Framework | Mean | Median | Std Dev | Min | Max |
| --- | --- | --- | --- | --- | --- |
| dothtml | 0.15ms | 0.15ms | 0.00ms | 0.14ms | 0.16ms |
| react | 0.31ms | 0.31ms | 0.07ms | 0.21ms | 0.51ms |
| vue | 0.21ms | 0.21ms | 0.02ms | 0.19ms | 0.30ms |
| svelte | 0.21ms | 0.21ms | 0.02ms | 0.19ms | 0.34ms |

