# Framework Benchmark Results

Configuration: 5 iterations, 1 warmup, 1 suite(s). Timings measured in-browser with `performance.now()`.

## DOM Operations (Median ms)

| Test | DOThtml | React | Vue | Svelte |
| --- | --- | --- | --- | --- |
| Create 1,000 rows | 132.20ms | 115.80ms | 115.80ms | 115.80ms |
| Create 10,000 rows | 815.70ms | 1148.50ms | 599.00ms | 566.10ms |
| Append 1,000 rows | 165.70ms | 115.70ms | 99.10ms | 115.50ms |
| Update every 10th row | 65.80ms | 65.70ms | 65.70ms | 65.70ms |
| Swap Rows | 65.70ms | 65.70ms | 65.80ms | 65.80ms |
| Clear | 65.70ms | 65.70ms | 65.70ms | 65.80ms |

## Reactive Styling Performance (Median ms)

| Test | DOThtml | React | Vue | Svelte |
| --- | --- | --- | --- | --- |
| Bulk Style Update | 65.80ms | 65.80ms | 65.70ms | 65.90ms |

## Detailed Statistics

### DOM Operations

#### Create 1,000 rows

| Framework | Mean | Median | Std Dev | Min | Max |
| --- | --- | --- | --- | --- | --- |
| dothtml | 135.56ms | 132.20ms | 16.22ms | 115.80ms | 165.40ms |
| react | 119.04ms | 115.80ms | 6.58ms | 115.60ms | 132.20ms |
| vue | 115.76ms | 115.80ms | 10.57ms | 99.00ms | 132.40ms |
| svelte | 118.78ms | 115.80ms | 6.90ms | 113.90ms | 132.50ms |

#### Create 10,000 rows

| Framework | Mean | Median | Std Dev | Min | Max |
| --- | --- | --- | --- | --- | --- |
| dothtml | 840.36ms | 815.70ms | 54.69ms | 782.40ms | 932.30ms |
| react | 1069.10ms | 1148.50ms | 162.27ms | 782.40ms | 1215.80ms |
| vue | 595.86ms | 599.00ms | 42.10ms | 545.90ms | 669.50ms |
| svelte | 605.38ms | 566.10ms | 66.85ms | 548.90ms | 719.50ms |

#### Append 1,000 rows

| Framework | Mean | Median | Std Dev | Min | Max |
| --- | --- | --- | --- | --- | --- |
| dothtml | 155.74ms | 165.70ms | 20.05ms | 132.30ms | 182.50ms |
| react | 125.30ms | 115.70ms | 13.36ms | 115.10ms | 149.20ms |
| vue | 122.66ms | 99.10ms | 39.40ms | 98.50ms | 200.30ms |
| svelte | 124.52ms | 115.50ms | 26.40ms | 98.40ms | 165.80ms |

#### Update every 10th row

| Framework | Mean | Median | Std Dev | Min | Max |
| --- | --- | --- | --- | --- | --- |
| dothtml | 66.04ms | 65.80ms | 0.75ms | 65.50ms | 67.50ms |
| react | 65.62ms | 65.70ms | 0.26ms | 65.10ms | 65.80ms |
| vue | 65.56ms | 65.70ms | 0.54ms | 64.50ms | 66.00ms |
| svelte | 65.66ms | 65.70ms | 0.10ms | 65.50ms | 65.80ms |

#### Swap Rows

| Framework | Mean | Median | Std Dev | Min | Max |
| --- | --- | --- | --- | --- | --- |
| dothtml | 65.70ms | 65.70ms | 0.11ms | 65.50ms | 65.80ms |
| react | 65.72ms | 65.70ms | 0.07ms | 65.60ms | 65.80ms |
| vue | 65.80ms | 65.80ms | 0.06ms | 65.70ms | 65.90ms |
| svelte | 65.78ms | 65.80ms | 0.07ms | 65.70ms | 65.90ms |

#### Clear

| Framework | Mean | Median | Std Dev | Min | Max |
| --- | --- | --- | --- | --- | --- |
| dothtml | 65.68ms | 65.70ms | 0.07ms | 65.60ms | 65.80ms |
| react | 65.72ms | 65.70ms | 0.10ms | 65.60ms | 65.90ms |
| vue | 65.44ms | 65.70ms | 0.57ms | 64.30ms | 65.80ms |
| svelte | 65.80ms | 65.80ms | 0.06ms | 65.70ms | 65.90ms |

### Styling

#### Bulk Style Update

| Framework | Mean | Median | Std Dev | Min | Max |
| --- | --- | --- | --- | --- | --- |
| dothtml | 65.78ms | 65.80ms | 0.07ms | 65.70ms | 65.90ms |
| react | 72.48ms | 65.80ms | 8.22ms | 65.70ms | 82.60ms |
| vue | 65.76ms | 65.70ms | 0.08ms | 65.70ms | 65.90ms |
| svelte | 72.44ms | 65.90ms | 8.21ms | 65.60ms | 82.60ms |

