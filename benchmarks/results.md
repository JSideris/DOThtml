# Framework Benchmark Results

Configuration: 5 iterations, 1 warmup, 1 suite(s). Timings measured in-browser with `performance.now()`.

## DOM Operations (Average ms)

| Test | DOThtml | React | Vue | Svelte |
| --- | --- | --- | --- | --- |
| Create 1,000 rows | 136.74ms | 112.34ms | 109.04ms | 115.70ms |
| Create 10,000 rows | 793.18ms | 1206.62ms | 619.80ms | 629.16ms |
| Append 1,000 rows | 155.82ms | 139.34ms | 108.78ms | 122.50ms |
| Update every 10th row | 65.68ms | 65.70ms | 65.64ms | 65.64ms |
| Swap Rows | 65.68ms | 65.64ms | 64.96ms | 65.68ms |
| Clear | 65.64ms | 65.68ms | 65.58ms | 65.62ms |

## Reactive Styling Performance

| Test | DOThtml | React | Vue | Svelte |
| --- | --- | --- | --- | --- |
| Bulk Style Update | 65.70ms | 75.62ms | 82.14ms | 68.98ms |

## Detailed Statistics

### DOM Operations

#### Create 1,000 rows

| Framework | Mean | Median | Std Dev | Min | Max |
| --- | --- | --- | --- | --- | --- |
| dothtml | 136.74ms | 132.40ms | 7.97ms | 132.10ms | 152.60ms |
| react | 112.34ms | 115.60ms | 6.67ms | 99.00ms | 115.80ms |
| vue | 109.04ms | 115.30ms | 8.08ms | 99.00ms | 115.80ms |
| svelte | 115.70ms | 115.70ms | 0.06ms | 115.60ms | 115.80ms |

#### Create 10,000 rows

| Framework | Mean | Median | Std Dev | Min | Max |
| --- | --- | --- | --- | --- | --- |
| dothtml | 793.18ms | 798.80ms | 60.68ms | 700.40ms | 885.40ms |
| react | 1206.62ms | 1199.10ms | 95.03ms | 1067.20ms | 1335.30ms |
| vue | 619.80ms | 599.10ms | 68.79ms | 548.90ms | 702.90ms |
| svelte | 629.16ms | 582.10ms | 72.24ms | 565.50ms | 734.70ms |

#### Append 1,000 rows

| Framework | Mean | Median | Std Dev | Min | Max |
| --- | --- | --- | --- | --- | --- |
| dothtml | 155.82ms | 132.30ms | 46.99ms | 132.20ms | 249.80ms |
| react | 139.34ms | 132.30ms | 31.57ms | 115.60ms | 200.70ms |
| vue | 108.78ms | 115.00ms | 8.15ms | 98.60ms | 115.80ms |
| svelte | 122.50ms | 115.60ms | 24.95ms | 98.60ms | 165.90ms |

#### Update every 10th row

| Framework | Mean | Median | Std Dev | Min | Max |
| --- | --- | --- | --- | --- | --- |
| dothtml | 65.68ms | 65.60ms | 0.10ms | 65.60ms | 65.80ms |
| react | 65.70ms | 65.70ms | 0.09ms | 65.60ms | 65.80ms |
| vue | 65.64ms | 65.70ms | 0.14ms | 65.40ms | 65.80ms |
| svelte | 65.64ms | 65.70ms | 0.19ms | 65.30ms | 65.80ms |

#### Swap Rows

| Framework | Mean | Median | Std Dev | Min | Max |
| --- | --- | --- | --- | --- | --- |
| dothtml | 65.68ms | 65.70ms | 0.07ms | 65.60ms | 65.80ms |
| react | 65.64ms | 65.60ms | 0.10ms | 65.50ms | 65.80ms |
| vue | 64.96ms | 65.30ms | 1.05ms | 62.90ms | 65.70ms |
| svelte | 65.68ms | 65.70ms | 0.20ms | 65.30ms | 65.90ms |

#### Clear

| Framework | Mean | Median | Std Dev | Min | Max |
| --- | --- | --- | --- | --- | --- |
| dothtml | 65.64ms | 65.70ms | 0.24ms | 65.20ms | 65.90ms |
| react | 65.68ms | 65.70ms | 0.20ms | 65.30ms | 65.90ms |
| vue | 65.58ms | 65.70ms | 0.32ms | 65.20ms | 66.00ms |
| svelte | 65.62ms | 65.70ms | 0.22ms | 65.20ms | 65.80ms |

### Styling

#### Bulk Style Update

| Framework | Mean | Median | Std Dev | Min | Max |
| --- | --- | --- | --- | --- | --- |
| dothtml | 65.70ms | 65.80ms | 0.27ms | 65.20ms | 66.00ms |
| react | 75.62ms | 65.70ms | 13.54ms | 65.00ms | 99.20ms |
| vue | 82.14ms | 82.10ms | 0.22ms | 81.90ms | 82.40ms |
| svelte | 68.98ms | 65.60ms | 6.81ms | 65.50ms | 82.60ms |

