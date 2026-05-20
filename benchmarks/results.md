# Framework Benchmark Results

Configuration: 5 iterations, 1 warmup, 1 suite(s). Timings measured in-browser with `performance.now()`.

## DOM Operations (Median ms)

| Test | DOThtml | React | Vue | Svelte |
| --- | --- | --- | --- | --- |
| Create 1,000 rows | 7.92ms | 7.95ms | 7.18ms | 6.35ms |
| Create 10,000 rows | 726.30ms | 685.80ms | 521.00ms | 529.70ms |
| Append 1,000 rows | 7.01ms | 73.50ms | 56.89ms | 51.43ms |
| Update every 10th row | 0.14ms | 0.14ms | 0.14ms | 0.14ms |
| Swap Rows | 0.14ms | 0.14ms | 0.14ms | 0.14ms |
| Clear | 1.44ms | 1.44ms | 1.44ms | 1.43ms |

## Reactive Styling Performance (Median ms)

| Test | DOThtml | React | Vue | Svelte |
| --- | --- | --- | --- | --- |
| Bulk Style Update | 0.15ms | 0.38ms | 0.23ms | 0.21ms |

## Detailed Statistics

### DOM Operations

#### Create 1,000 rows

| Framework | Mean | Median | Std Dev | Min | Max |
| --- | --- | --- | --- | --- | --- |
| dothtml | 7.66ms | 7.92ms | 0.70ms | 6.33ms | 8.31ms |
| react | 10.10ms | 7.95ms | 4.20ms | 7.47ms | 18.46ms |
| vue | 7.86ms | 7.18ms | 1.45ms | 6.89ms | 10.74ms |
| svelte | 6.70ms | 6.35ms | 0.91ms | 5.92ms | 8.48ms |

#### Create 10,000 rows

| Framework | Mean | Median | Std Dev | Min | Max |
| --- | --- | --- | --- | --- | --- |
| dothtml | 750.08ms | 726.30ms | 67.72ms | 680.40ms | 875.90ms |
| react | 702.82ms | 685.80ms | 40.35ms | 654.70ms | 771.80ms |
| vue | 527.36ms | 521.00ms | 23.65ms | 501.70ms | 568.80ms |
| svelte | 520.56ms | 529.70ms | 33.80ms | 471.10ms | 567.70ms |

#### Append 1,000 rows

| Framework | Mean | Median | Std Dev | Min | Max |
| --- | --- | --- | --- | --- | --- |
| dothtml | 7.57ms | 7.01ms | 1.08ms | 6.97ms | 9.73ms |
| react | 74.22ms | 73.50ms | 1.86ms | 72.53ms | 77.71ms |
| vue | 58.65ms | 56.89ms | 4.71ms | 52.71ms | 65.32ms |
| svelte | 53.19ms | 51.43ms | 2.93ms | 50.44ms | 58.10ms |

#### Update every 10th row

| Framework | Mean | Median | Std Dev | Min | Max |
| --- | --- | --- | --- | --- | --- |
| dothtml | 0.14ms | 0.14ms | 0.00ms | 0.14ms | 0.15ms |
| react | 0.14ms | 0.14ms | 0.00ms | 0.14ms | 0.14ms |
| vue | 0.14ms | 0.14ms | 0.00ms | 0.14ms | 0.15ms |
| svelte | 0.14ms | 0.14ms | 0.00ms | 0.14ms | 0.14ms |

#### Swap Rows

| Framework | Mean | Median | Std Dev | Min | Max |
| --- | --- | --- | --- | --- | --- |
| dothtml | 0.14ms | 0.14ms | 0.01ms | 0.12ms | 0.14ms |
| react | 0.14ms | 0.14ms | 0.00ms | 0.14ms | 0.15ms |
| vue | 0.14ms | 0.14ms | 0.00ms | 0.14ms | 0.15ms |
| svelte | 0.14ms | 0.14ms | 0.00ms | 0.14ms | 0.15ms |

#### Clear

| Framework | Mean | Median | Std Dev | Min | Max |
| --- | --- | --- | --- | --- | --- |
| dothtml | 1.43ms | 1.44ms | 0.03ms | 1.37ms | 1.47ms |
| react | 1.44ms | 1.44ms | 0.02ms | 1.41ms | 1.46ms |
| vue | 1.44ms | 1.44ms | 0.02ms | 1.41ms | 1.48ms |
| svelte | 1.43ms | 1.43ms | 0.01ms | 1.41ms | 1.45ms |

### Styling

#### Bulk Style Update

| Framework | Mean | Median | Std Dev | Min | Max |
| --- | --- | --- | --- | --- | --- |
| dothtml | 0.15ms | 0.15ms | 0.00ms | 0.15ms | 0.15ms |
| react | 0.35ms | 0.38ms | 0.09ms | 0.23ms | 0.48ms |
| vue | 0.23ms | 0.23ms | 0.02ms | 0.21ms | 0.26ms |
| svelte | 0.22ms | 0.21ms | 0.01ms | 0.21ms | 0.24ms |

