# Framework Benchmark Results

Configuration: 5 iterations, 1 warmup, 1 suite(s). Timings measured in-browser with `performance.now()`.

## DOM Operations (Average ms)

| Test | DOThtml | React | Vue | Svelte |
| --- | --- | --- | --- | --- |
| Create 1,000 rows | 149.18ms | 129.04ms | 118.94ms | 132.20ms |
| Create 10,000 rows | 960.76ms | 1128.74ms | 691.48ms | 693.06ms |
| Append 1,000 rows | 159.40ms | 142.10ms | 137.88ms | 142.16ms |
| Update every 10th row | 65.56ms | 65.52ms | 65.64ms | 65.52ms |
| Swap Rows | 65.60ms | 65.66ms | 65.48ms | 65.00ms |
| Clear | 65.62ms | 65.56ms | 65.36ms | 65.54ms |

## Reactive Styling Performance

| Test | DOThtml | React | Vue | Svelte |
| --- | --- | --- | --- | --- |
| Bulk Style Update | 65.56ms | 82.34ms | 78.70ms | 65.46ms |

## Detailed Statistics

### DOM Operations

#### Create 1,000 rows

| Framework | Mean | Median | Std Dev | Min | Max |
| --- | --- | --- | --- | --- | --- |
| dothtml | 149.18ms | 149.00ms | 0.46ms | 148.90ms | 150.10ms |
| react | 129.04ms | 132.30ms | 6.52ms | 116.00ms | 132.50ms |
| vue | 118.94ms | 115.80ms | 12.39ms | 99.00ms | 132.30ms |
| svelte | 132.20ms | 131.90ms | 10.50ms | 115.80ms | 149.00ms |

#### Create 10,000 rows

| Framework | Mean | Median | Std Dev | Min | Max |
| --- | --- | --- | --- | --- | --- |
| dothtml | 960.76ms | 932.20ms | 97.89ms | 857.60ms | 1101.70ms |
| react | 1128.74ms | 1149.20ms | 167.66ms | 840.90ms | 1302.40ms |
| vue | 691.48ms | 682.10ms | 70.66ms | 599.80ms | 818.40ms |
| svelte | 693.06ms | 698.60ms | 79.19ms | 591.90ms | 786.00ms |

#### Append 1,000 rows

| Framework | Mean | Median | Std Dev | Min | Max |
| --- | --- | --- | --- | --- | --- |
| dothtml | 159.40ms | 157.70ms | 28.49ms | 132.00ms | 209.60ms |
| react | 142.10ms | 132.00ms | 31.13ms | 115.50ms | 199.60ms |
| vue | 137.88ms | 115.40ms | 37.41ms | 115.00ms | 211.50ms |
| svelte | 142.16ms | 132.10ms | 20.22ms | 131.90ms | 182.60ms |

#### Update every 10th row

| Framework | Mean | Median | Std Dev | Min | Max |
| --- | --- | --- | --- | --- | --- |
| dothtml | 65.56ms | 65.60ms | 0.29ms | 65.10ms | 65.90ms |
| react | 65.52ms | 65.50ms | 0.20ms | 65.30ms | 65.80ms |
| vue | 65.64ms | 65.70ms | 0.22ms | 65.30ms | 65.90ms |
| svelte | 65.52ms | 65.50ms | 0.18ms | 65.20ms | 65.70ms |

#### Swap Rows

| Framework | Mean | Median | Std Dev | Min | Max |
| --- | --- | --- | --- | --- | --- |
| dothtml | 65.60ms | 65.80ms | 0.30ms | 65.10ms | 65.90ms |
| react | 65.66ms | 65.80ms | 0.25ms | 65.20ms | 65.90ms |
| vue | 65.48ms | 65.60ms | 0.24ms | 65.10ms | 65.70ms |
| svelte | 65.00ms | 65.40ms | 1.11ms | 62.80ms | 65.70ms |

#### Clear

| Framework | Mean | Median | Std Dev | Min | Max |
| --- | --- | --- | --- | --- | --- |
| dothtml | 65.62ms | 65.70ms | 0.10ms | 65.50ms | 65.70ms |
| react | 65.56ms | 65.60ms | 0.29ms | 65.10ms | 65.90ms |
| vue | 65.36ms | 65.50ms | 0.47ms | 64.50ms | 65.90ms |
| svelte | 65.54ms | 65.60ms | 0.32ms | 65.00ms | 65.90ms |

### Styling

#### Bulk Style Update

| Framework | Mean | Median | Std Dev | Min | Max |
| --- | --- | --- | --- | --- | --- |
| dothtml | 65.56ms | 65.70ms | 0.44ms | 64.70ms | 65.90ms |
| react | 82.34ms | 82.40ms | 0.22ms | 81.90ms | 82.50ms |
| vue | 78.70ms | 81.90ms | 6.30ms | 66.10ms | 81.90ms |
| svelte | 65.46ms | 65.50ms | 0.23ms | 65.10ms | 65.70ms |

