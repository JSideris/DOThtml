# Framework Benchmark Results

## DOM Operations (Average ms)

| Test | DOThtml | React | Vue | Svelte |
| --- | --- | --- | --- | --- |
| Create 1,000 rows | 130.20ms | 95.40ms | 93.40ms | 100.20ms |
| Create 10,000 rows | 988.40ms | 1235.40ms | 705.80ms | 697.40ms |
| Append 1,000 rows | 131.80ms | 100.80ms | 89.60ms | 102.80ms |
| Update every 10th row | 47.20ms | 47.00ms | 47.40ms | 47.60ms |
| Swap Rows | 48.00ms | 45.60ms | 49.60ms | 46.80ms |
| Clear | 48.20ms | 49.40ms | 48.80ms | 49.60ms |

## Reactive Styling Performance

| Test | DOThtml | React | Vue | Svelte |
| --- | --- | --- | --- | --- |
| Bulk Style Update | 59.60ms | 65.80ms | 56.80ms | 62.40ms |
