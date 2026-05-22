# Framework Benchmark Results

Configuration: 5 iterations, 1 warmup, 1 suite(s). Timings measured in-browser with `performance.now()`.

## Cold Start & Initialization (Median ms)

| Test | DOThtml | React | Vue | Svelte |
| --- | --- | --- | --- | --- |
| First Contentful Paint | 28.00ms | 28.00ms | 28.00ms | 28.00ms |
| DOM Interactive | 5.20ms | 5.30ms | 4.90ms | 5.10ms |
| Framework Ready | 18.80ms | 8.20ms | 7.90ms | 5.80ms |

## DOM Operations (Median ms)

| Test | DOThtml | React | Vue | Svelte |
| --- | --- | --- | --- | --- |
| Create 1,000 rows | 7.05ms | 7.40ms | 6.77ms | 5.91ms |
| Create 10,000 rows | 675.10ms | 662.30ms | 508.20ms | 458.10ms |
| Append 1,000 rows | 7.26ms | 72.78ms | 51.65ms | 49.94ms |
| Update every 10th row | 0.14ms | 0.14ms | 0.14ms | 0.14ms |
| Swap Rows | 0.14ms | 0.14ms | 0.14ms | 0.14ms |
| Clear | 1.45ms | 1.44ms | 1.43ms | 1.44ms |

## Reactive Styling Performance (Median ms)

| Test | DOThtml | React | Vue | Svelte |
| --- | --- | --- | --- | --- |
| Bulk Style Update | 0.15ms | 0.40ms | 0.25ms | 0.21ms |

## Detailed Statistics

### Cold Start

#### First Contentful Paint

| Framework | Mean | Median | Std Dev | Min | Max |
| --- | --- | --- | --- | --- | --- |
| dothtml | 37.60ms | 28.00ms | 18.17ms | 24.00ms | 72.00ms |
| react | 28.80ms | 28.00ms | 6.88ms | 20.00ms | 40.00ms |
| vue | 28.80ms | 28.00ms | 2.99ms | 24.00ms | 32.00ms |
| svelte | 27.20ms | 28.00ms | 4.66ms | 20.00ms | 32.00ms |

#### DOM Interactive

| Framework | Mean | Median | Std Dev | Min | Max |
| --- | --- | --- | --- | --- | --- |
| dothtml | 6.60ms | 5.20ms | 2.53ms | 4.60ms | 11.40ms |
| react | 6.32ms | 5.30ms | 1.33ms | 5.10ms | 8.00ms |
| vue | 4.98ms | 4.90ms | 0.33ms | 4.50ms | 5.40ms |
| svelte | 5.32ms | 5.10ms | 0.53ms | 4.70ms | 6.20ms |

#### Framework Ready

| Framework | Mean | Median | Std Dev | Min | Max |
| --- | --- | --- | --- | --- | --- |
| dothtml | 22.64ms | 18.80ms | 9.16ms | 15.40ms | 40.40ms |
| react | 9.90ms | 8.20ms | 4.15ms | 6.90ms | 18.00ms |
| vue | 11.38ms | 7.90ms | 6.86ms | 7.80ms | 25.10ms |
| svelte | 6.68ms | 5.80ms | 1.68ms | 5.50ms | 10.00ms |

### DOM Operations

#### Create 1,000 rows

| Framework | Mean | Median | Std Dev | Min | Max |
| --- | --- | --- | --- | --- | --- |
| dothtml | 7.14ms | 7.05ms | 0.33ms | 6.88ms | 7.78ms |
| react | 7.61ms | 7.40ms | 0.99ms | 6.55ms | 9.48ms |
| vue | 7.23ms | 6.77ms | 1.17ms | 6.01ms | 9.35ms |
| svelte | 6.02ms | 5.91ms | 0.47ms | 5.35ms | 6.79ms |

#### Create 10,000 rows

| Framework | Mean | Median | Std Dev | Min | Max |
| --- | --- | --- | --- | --- | --- |
| dothtml | 692.84ms | 675.10ms | 34.56ms | 658.10ms | 748.50ms |
| react | 680.00ms | 662.30ms | 34.10ms | 655.20ms | 745.40ms |
| vue | 511.18ms | 508.20ms | 41.97ms | 459.20ms | 584.80ms |
| svelte | 480.56ms | 458.10ms | 58.10ms | 433.00ms | 594.90ms |

#### Append 1,000 rows

| Framework | Mean | Median | Std Dev | Min | Max |
| --- | --- | --- | --- | --- | --- |
| dothtml | 7.27ms | 7.26ms | 0.49ms | 6.68ms | 8.04ms |
| react | 74.44ms | 72.78ms | 5.05ms | 69.86ms | 84.23ms |
| vue | 53.76ms | 51.65ms | 3.68ms | 51.23ms | 60.99ms |
| svelte | 50.17ms | 49.94ms | 2.65ms | 47.49ms | 55.06ms |

#### Update every 10th row

| Framework | Mean | Median | Std Dev | Min | Max |
| --- | --- | --- | --- | --- | --- |
| dothtml | 0.14ms | 0.14ms | 0.00ms | 0.14ms | 0.14ms |
| react | 0.14ms | 0.14ms | 0.00ms | 0.14ms | 0.14ms |
| vue | 0.14ms | 0.14ms | 0.00ms | 0.14ms | 0.14ms |
| svelte | 0.14ms | 0.14ms | 0.00ms | 0.14ms | 0.14ms |

#### Swap Rows

| Framework | Mean | Median | Std Dev | Min | Max |
| --- | --- | --- | --- | --- | --- |
| dothtml | 0.14ms | 0.14ms | 0.01ms | 0.13ms | 0.15ms |
| react | 0.14ms | 0.14ms | 0.00ms | 0.14ms | 0.14ms |
| vue | 0.14ms | 0.14ms | 0.00ms | 0.14ms | 0.15ms |
| svelte | 0.14ms | 0.14ms | 0.00ms | 0.14ms | 0.15ms |

#### Clear

| Framework | Mean | Median | Std Dev | Min | Max |
| --- | --- | --- | --- | --- | --- |
| dothtml | 1.45ms | 1.45ms | 0.01ms | 1.43ms | 1.46ms |
| react | 1.43ms | 1.44ms | 0.01ms | 1.41ms | 1.44ms |
| vue | 1.44ms | 1.43ms | 0.01ms | 1.42ms | 1.46ms |
| svelte | 1.44ms | 1.44ms | 0.03ms | 1.38ms | 1.48ms |

### Styling

#### Bulk Style Update

| Framework | Mean | Median | Std Dev | Min | Max |
| --- | --- | --- | --- | --- | --- |
| dothtml | 0.15ms | 0.15ms | 0.00ms | 0.15ms | 0.15ms |
| react | 0.35ms | 0.40ms | 0.09ms | 0.22ms | 0.47ms |
| vue | 0.25ms | 0.25ms | 0.01ms | 0.23ms | 0.27ms |
| svelte | 0.22ms | 0.21ms | 0.01ms | 0.21ms | 0.24ms |

