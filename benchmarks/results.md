# Framework Benchmark Results

Configuration: 20 iterations, 1 warmup, 1 suite(s). Timings measured in-browser with `performance.now()`.

## DOM Operations (Median ms)

| Test | DOThtml | React | Vue | Svelte |
| --- | --- | --- | --- | --- |
| Create 1,000 rows | 6.88ms | 6.94ms | 6.98ms | 6.19ms |
| Create 10,000 rows | 706.80ms | 693.40ms | 493.35ms | 472.25ms |
| Append 1,000 rows | 7.39ms | 75.97ms | 54.02ms | 53.45ms |
| Update every 10th row | 0.14ms | 0.14ms | 0.14ms | 0.14ms |
| Swap Rows | 0.14ms | 0.14ms | 0.14ms | 0.14ms |
| Clear | 1.46ms | 1.45ms | 1.44ms | 1.45ms |

## Reactive Styling Performance (Median ms)

| Test | DOThtml | React | Vue | Svelte |
| --- | --- | --- | --- | --- |
| Bulk Style Update | 0.15ms | 0.33ms | 0.22ms | 0.23ms |

## Detailed Statistics

### DOM Operations

#### Create 1,000 rows

| Framework | Mean | Median | Std Dev | Min | Max |
| --- | --- | --- | --- | --- | --- |
| dothtml | 7.12ms | 6.88ms | 0.92ms | 6.23ms | 10.40ms |
| react | 7.19ms | 6.94ms | 0.79ms | 6.59ms | 10.17ms |
| vue | 7.35ms | 6.98ms | 1.02ms | 6.11ms | 9.72ms |
| svelte | 6.36ms | 6.19ms | 0.75ms | 5.66ms | 9.08ms |

#### Create 10,000 rows

| Framework | Mean | Median | Std Dev | Min | Max |
| --- | --- | --- | --- | --- | --- |
| dothtml | 739.83ms | 706.80ms | 80.70ms | 650.20ms | 954.00ms |
| react | 702.80ms | 693.40ms | 41.71ms | 658.10ms | 819.40ms |
| vue | 512.55ms | 493.35ms | 52.29ms | 462.40ms | 640.00ms |
| svelte | 479.73ms | 472.25ms | 35.12ms | 451.20ms | 617.90ms |

#### Append 1,000 rows

| Framework | Mean | Median | Std Dev | Min | Max |
| --- | --- | --- | --- | --- | --- |
| dothtml | 7.52ms | 7.39ms | 0.63ms | 6.57ms | 8.49ms |
| react | 77.76ms | 75.97ms | 5.88ms | 70.26ms | 96.56ms |
| vue | 54.84ms | 54.02ms | 3.48ms | 51.58ms | 68.46ms |
| svelte | 53.75ms | 53.45ms | 3.61ms | 48.57ms | 61.59ms |

#### Update every 10th row

| Framework | Mean | Median | Std Dev | Min | Max |
| --- | --- | --- | --- | --- | --- |
| dothtml | 0.14ms | 0.14ms | 0.01ms | 0.12ms | 0.15ms |
| react | 0.14ms | 0.14ms | 0.00ms | 0.14ms | 0.15ms |
| vue | 0.14ms | 0.14ms | 0.00ms | 0.14ms | 0.15ms |
| svelte | 0.14ms | 0.14ms | 0.00ms | 0.14ms | 0.15ms |

#### Swap Rows

| Framework | Mean | Median | Std Dev | Min | Max |
| --- | --- | --- | --- | --- | --- |
| dothtml | 0.14ms | 0.14ms | 0.00ms | 0.14ms | 0.15ms |
| react | 0.14ms | 0.14ms | 0.00ms | 0.14ms | 0.15ms |
| vue | 0.14ms | 0.14ms | 0.00ms | 0.14ms | 0.15ms |
| svelte | 0.14ms | 0.14ms | 0.00ms | 0.14ms | 0.15ms |

#### Clear

| Framework | Mean | Median | Std Dev | Min | Max |
| --- | --- | --- | --- | --- | --- |
| dothtml | 1.45ms | 1.46ms | 0.03ms | 1.37ms | 1.49ms |
| react | 1.45ms | 1.45ms | 0.02ms | 1.40ms | 1.49ms |
| vue | 1.44ms | 1.44ms | 0.02ms | 1.40ms | 1.49ms |
| svelte | 1.45ms | 1.45ms | 0.02ms | 1.41ms | 1.49ms |

### Styling

#### Bulk Style Update

| Framework | Mean | Median | Std Dev | Min | Max |
| --- | --- | --- | --- | --- | --- |
| dothtml | 0.15ms | 0.15ms | 0.00ms | 0.15ms | 0.16ms |
| react | 0.34ms | 0.33ms | 0.07ms | 0.23ms | 0.53ms |
| vue | 0.23ms | 0.22ms | 0.03ms | 0.20ms | 0.29ms |
| svelte | 0.24ms | 0.23ms | 0.03ms | 0.20ms | 0.33ms |

