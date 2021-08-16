
> dothtml@4.7.1 test C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml
> webpack & jest "components"

assets by status 2.86 MiB [1m[32m[cached][39m[22m 1 asset
867 modules

[1m[33mWARNING[39m[22m in [1m./node_modules/jest-worker/build/WorkerPool.js[39m[22m [1m[32m22:4-29[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'worker_threads' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\jest-worker\build'[39m[22m
 @ ./node_modules/jest-worker/build/index.js 38:41-64
 @ ./node_modules/terser-webpack-plugin/dist/index.js 22:18-40
 @ ./node_modules/terser-webpack-plugin/dist/cjs.js 3:15-33
 @ ./node_modules/webpack/lib/config/defaults.js 1021:25-57
 @ ./node_modules/webpack/lib/index.js 328:10-66
 @ ./src/index.js 7:0-39

[1m[33mWARNING[39m[22m in [1m./node_modules/jest-worker/build/base/BaseWorkerPool.js[39m[22m [1m[32m119:19-46[39m[22m
[1mCritical dependency: the request of a dependency is an expression[39m[22m
 @ ./node_modules/jest-worker/build/WorkerPool.js 8:45-77
 @ ./node_modules/jest-worker/build/index.js 38:41-64
 @ ./node_modules/terser-webpack-plugin/dist/index.js 22:18-40
 @ ./node_modules/terser-webpack-plugin/dist/cjs.js 3:15-33
 @ ./node_modules/webpack/lib/config/defaults.js 1021:25-57
 @ ./node_modules/webpack/lib/index.js 328:10-66
 @ ./src/index.js 7:0-39

[1m[33mWARNING[39m[22m in [1m./node_modules/jest-worker/build/index.js[39m[22m [1m[32m68:19-38[39m[22m
[1mCritical dependency: the request of a dependency is an expression[39m[22m
 @ ./node_modules/terser-webpack-plugin/dist/index.js 22:18-40
 @ ./node_modules/terser-webpack-plugin/dist/cjs.js 3:15-33
 @ ./node_modules/webpack/lib/config/defaults.js 1021:25-57
 @ ./node_modules/webpack/lib/index.js 328:10-66
 @ ./src/index.js 7:0-39

[1m[33mWARNING[39m[22m in [1m./node_modules/jest-worker/build/workers/processChild.js[39m[22m [1m[32m97:15-28[39m[22m
[1mCritical dependency: the request of a dependency is an expression[39m[22m
 @ ./node_modules/jest-worker/build/workers/ChildProcessWorker.js 142:6-39
 @ ./node_modules/jest-worker/build/WorkerPool.js 41:15-62
 @ ./node_modules/jest-worker/build/index.js 38:41-64
 @ ./node_modules/terser-webpack-plugin/dist/index.js 22:18-40
 @ ./node_modules/terser-webpack-plugin/dist/cjs.js 3:15-33
 @ ./node_modules/webpack/lib/config/defaults.js 1021:25-57
 @ ./node_modules/webpack/lib/index.js 328:10-66
 @ ./src/index.js 7:0-39

[1m[33mWARNING[39m[22m in [1m./node_modules/jest-worker/build/workers/processChild.js[39m[22m [1m[32m113:15-28[39m[22m
[1mCritical dependency: the request of a dependency is an expression[39m[22m
 @ ./node_modules/jest-worker/build/workers/ChildProcessWorker.js 142:6-39
 @ ./node_modules/jest-worker/build/WorkerPool.js 41:15-62
 @ ./node_modules/jest-worker/build/index.js 38:41-64
 @ ./node_modules/terser-webpack-plugin/dist/index.js 22:18-40
 @ ./node_modules/terser-webpack-plugin/dist/cjs.js 3:15-33
 @ ./node_modules/webpack/lib/config/defaults.js 1021:25-57
 @ ./node_modules/webpack/lib/index.js 328:10-66
 @ ./src/index.js 7:0-39

[1m[33mWARNING[39m[22m in [1m./node_modules/loader-runner/lib/loadLoader.js[39m[22m [1m[32m7:31-45[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'url' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\loader-runner\lib'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "url": require.resolve("url/") }'
	- install 'url'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "url": false }[39m[22m
 @ ./node_modules/loader-runner/lib/LoaderRunner.js 7:17-40
 @ ./node_modules/webpack/lib/NormalModule.js 9:35-59
 @ ./node_modules/webpack/lib/index.js 248:9-34
 @ ./src/index.js 7:0-39

[1m[33mWARNING[39m[22m in [1m./node_modules/loader-runner/lib/loadLoader.js[39m[22m [1m[32m19:16-36[39m[22m
[1mCritical dependency: the request of a dependency is an expression[39m[22m
 @ ./node_modules/loader-runner/lib/LoaderRunner.js 7:17-40
 @ ./node_modules/webpack/lib/NormalModule.js 9:35-59
 @ ./node_modules/webpack/lib/index.js 248:9-34
 @ ./src/index.js 7:0-39

[1m[33mWARNING[39m[22m in [1m./node_modules/terser-webpack-plugin/dist/minify.js[39m[22m [1m[32m279:118-125[39m[22m
[1mCritical dependency: require function is used in a way in which dependencies cannot be statically extracted[39m[22m
 @ ./node_modules/terser-webpack-plugin/dist/index.js 26:14-33 288:31-58
 @ ./node_modules/terser-webpack-plugin/dist/cjs.js 3:15-33
 @ ./node_modules/webpack/lib/config/defaults.js 1021:25-57
 @ ./node_modules/webpack/lib/index.js 328:10-66
 @ ./src/index.js 7:0-39

[1m[33mWARNING[39m[22m in [1m./node_modules/webpack/lib/debug/ProfilingPlugin.js[39m[22m [1m[32m26:13-33[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'inspector' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\webpack\lib\debug'[39m[22m
 @ ./node_modules/webpack/lib/index.js 527:10-44
 @ ./src/index.js 7:0-39

[1m[33mWARNING[39m[22m in [1m./node_modules/webpack/lib/serialization/ObjectMiddleware.js[39m[22m [1m[32m636:9-25[39m[22m
[1mCritical dependency: the request of a dependency is an expression[39m[22m
 @ ./node_modules/webpack/lib/util/serialization.js 19:1-45
 @ ./node_modules/webpack/lib/index.js 539:10-41
 @ ./src/index.js 7:0-39

10 warnings have detailed information that is not shown.
Use 'stats.errorDetails: true' resp. '--stats-error-details' to show it.

[1m[31mERROR[39m[22m in [1m./node_modules/chrome-trace-event/dist/trace-event.js[39m[22m [1m[32m10:17-34[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'stream' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\chrome-trace-event\dist'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "stream": require.resolve("stream-browserify") }'
	- install 'stream-browserify'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "stream": false }[39m[22m
 @ ./node_modules/webpack/lib/debug/ProfilingPlugin.js 7:19-48
 @ ./node_modules/webpack/lib/index.js 527:10-44
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/enhanced-resolve/lib/ExportsFieldPlugin.js[39m[22m [1m[32m8:13-28[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'path' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\enhanced-resolve\lib'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "path": require.resolve("path-browserify") }'
	- install 'path-browserify'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "path": false }[39m[22m
 @ ./node_modules/enhanced-resolve/lib/ResolverFactory.js 20:27-58
 @ ./node_modules/enhanced-resolve/lib/index.js 10:24-52
 @ ./node_modules/webpack/lib/ResolverFactory.js 8:16-59
 @ ./node_modules/webpack/lib/Compiler.js 27:24-52
 @ ./node_modules/webpack/lib/index.js 147:9-30
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/enhanced-resolve/lib/ImportsFieldPlugin.js[39m[22m [1m[32m8:13-28[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'path' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\enhanced-resolve\lib'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "path": require.resolve("path-browserify") }'
	- install 'path-browserify'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "path": false }[39m[22m
 @ ./node_modules/enhanced-resolve/lib/ResolverFactory.js 22:27-58
 @ ./node_modules/enhanced-resolve/lib/index.js 10:24-52
 @ ./node_modules/webpack/lib/ResolverFactory.js 8:16-59
 @ ./node_modules/webpack/lib/Compiler.js 27:24-52
 @ ./node_modules/webpack/lib/index.js 147:9-30
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/enhanced-resolve/lib/MainFieldPlugin.js[39m[22m [1m[32m8:13-28[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'path' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\enhanced-resolve\lib'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "path": require.resolve("path-browserify") }'
	- install 'path-browserify'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "path": false }[39m[22m
 @ ./node_modules/enhanced-resolve/lib/ResolverFactory.js 25:24-52
 @ ./node_modules/enhanced-resolve/lib/index.js 10:24-52
 @ ./node_modules/webpack/lib/ResolverFactory.js 8:16-59
 @ ./node_modules/webpack/lib/Compiler.js 27:24-52
 @ ./node_modules/webpack/lib/index.js 147:9-30
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/enhanced-resolve/lib/util/path.js[39m[22m [1m[32m8:13-28[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'path' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\enhanced-resolve\lib\util'
[1m[32mDid you mean './path'?[39m[22m[1m
Requests that should resolve in the current directory need to start with './'.
Requests that start with a name are treated as module requests and resolve within module directories (node_modules).
If changing the source code is not an option there is also a resolve options called 'preferRelative' which tries to resolve these kind of requests in the current directory too.

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "path": require.resolve("path-browserify") }'
	- install 'path-browserify'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "path": false }[39m[22m
 @ ./node_modules/enhanced-resolve/lib/ResolverFactory.js 10:30-52
 @ ./node_modules/enhanced-resolve/lib/index.js 10:24-52
 @ ./node_modules/webpack/lib/ResolverFactory.js 8:16-59
 @ ./node_modules/webpack/lib/Compiler.js 27:24-52
 @ ./node_modules/webpack/lib/index.js 147:9-30
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/eslint-scope/lib/index.js[39m[22m [1m[32m52:15-32[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'assert' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\eslint-scope\lib'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "assert": require.resolve("assert/") }'
	- install 'assert'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "assert": false }[39m[22m
 @ ./node_modules/webpack/lib/optimize/ConcatenatedModule.js 8:20-43
 @ ./node_modules/webpack/lib/EvalSourceMapDevToolPlugin.js 13:27-67
 @ ./node_modules/webpack/lib/index.js 189:9-48
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/eslint-scope/lib/referencer.js[39m[22m [1m[32m35:15-32[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'assert' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\eslint-scope\lib'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "assert": require.resolve("assert/") }'
	- install 'assert'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "assert": false }[39m[22m
 @ ./node_modules/webpack/lib/optimize/ConcatenatedModule.js 9:19-57
 @ ./node_modules/webpack/lib/EvalSourceMapDevToolPlugin.js 13:27-67
 @ ./node_modules/webpack/lib/index.js 189:9-48
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/eslint-scope/lib/scope-manager.js[39m[22m [1m[32m29:15-32[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'assert' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\eslint-scope\lib'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "assert": require.resolve("assert/") }'
	- install 'assert'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "assert": false }[39m[22m
 @ ./node_modules/eslint-scope/lib/index.js 54:21-47
 @ ./node_modules/webpack/lib/optimize/ConcatenatedModule.js 8:20-43
 @ ./node_modules/webpack/lib/EvalSourceMapDevToolPlugin.js 13:27-67
 @ ./node_modules/webpack/lib/index.js 189:9-48
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/eslint-scope/lib/scope.js[39m[22m [1m[32m34:15-32[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'assert' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\eslint-scope\lib'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "assert": require.resolve("assert/") }'
	- install 'assert'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "assert": false }[39m[22m
 @ ./node_modules/eslint-scope/lib/index.js 58:14-38
 @ ./node_modules/webpack/lib/optimize/ConcatenatedModule.js 8:20-43
 @ ./node_modules/webpack/lib/EvalSourceMapDevToolPlugin.js 13:27-67
 @ ./node_modules/webpack/lib/index.js 189:9-48
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/graceful-fs/graceful-fs.js[39m[22m [1m[32m1:9-22[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'fs' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\graceful-fs'[39m[22m
 @ ./node_modules/webpack/lib/node/NodeEnvironmentPlugin.js 9:11-33
 @ ./node_modules/webpack/lib/index.js 458:10-49
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/graceful-fs/graceful-fs.js[39m[22m [1m[32m6:11-26[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'util' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\graceful-fs'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "util": require.resolve("util/") }'
	- install 'util'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "util": false }[39m[22m
 @ ./node_modules/webpack/lib/node/NodeEnvironmentPlugin.js 9:11-33
 @ ./node_modules/webpack/lib/index.js 458:10-49
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/graceful-fs/graceful-fs.js[39m[22m [1m[32m87:6-29[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'assert' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\graceful-fs'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "assert": require.resolve("assert/") }'
	- install 'assert'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "assert": false }[39m[22m
 @ ./node_modules/webpack/lib/node/NodeEnvironmentPlugin.js 9:11-33
 @ ./node_modules/webpack/lib/index.js 458:10-49
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/graceful-fs/legacy-streams.js[39m[22m [1m[32m1:13-37[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'stream' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\graceful-fs'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "stream": require.resolve("stream-browserify") }'
	- install 'stream-browserify'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "stream": false }[39m[22m
 @ ./node_modules/graceful-fs/graceful-fs.js 3:13-43
 @ ./node_modules/webpack/lib/node/NodeEnvironmentPlugin.js 9:11-33
 @ ./node_modules/webpack/lib/index.js 458:10-49
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/graceful-fs/polyfills.js[39m[22m [1m[32m1:16-36[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'constants' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\graceful-fs'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "constants": require.resolve("constants-browserify") }'
	- install 'constants-browserify'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "constants": false }[39m[22m
 @ ./node_modules/graceful-fs/graceful-fs.js 2:16-41
 @ ./node_modules/webpack/lib/node/NodeEnvironmentPlugin.js 9:11-33
 @ ./node_modules/webpack/lib/index.js 458:10-49
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/jest-worker/build/base/BaseWorkerPool.js[39m[22m [1m[32m9:39-54[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'path' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\jest-worker\build\base'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "path": require.resolve("path-browserify") }'
	- install 'path-browserify'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "path": false }[39m[22m
 @ ./node_modules/jest-worker/build/WorkerPool.js 8:45-77
 @ ./node_modules/jest-worker/build/index.js 38:41-64
 @ ./node_modules/terser-webpack-plugin/dist/index.js 22:18-40
 @ ./node_modules/terser-webpack-plugin/dist/cjs.js 3:15-33
 @ ./node_modules/webpack/lib/config/defaults.js 1021:25-57
 @ ./node_modules/webpack/lib/index.js 328:10-66
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/jest-worker/build/index.js[39m[22m [1m[32m27:15-28[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'os' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\jest-worker\build'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "os": require.resolve("os-browserify/browser") }'
	- install 'os-browserify'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "os": false }[39m[22m
 @ ./node_modules/terser-webpack-plugin/dist/index.js 22:18-40
 @ ./node_modules/terser-webpack-plugin/dist/cjs.js 3:15-33
 @ ./node_modules/webpack/lib/config/defaults.js 1021:25-57
 @ ./node_modules/webpack/lib/index.js 328:10-66
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/jest-worker/build/workers/ChildProcessWorker.js[39m[22m [1m[32m9:15-39[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'child_process' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\jest-worker\build\workers'[39m[22m
 @ ./node_modules/jest-worker/build/WorkerPool.js 41:15-62
 @ ./node_modules/jest-worker/build/index.js 38:41-64
 @ ./node_modules/terser-webpack-plugin/dist/index.js 22:18-40
 @ ./node_modules/terser-webpack-plugin/dist/cjs.js 3:15-33
 @ ./node_modules/webpack/lib/config/defaults.js 1021:25-57
 @ ./node_modules/webpack/lib/index.js 328:10-66
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/jest-worker/build/workers/ChildProcessWorker.js[39m[22m [1m[32m19:15-32[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'stream' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\jest-worker\build\workers'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "stream": require.resolve("stream-browserify") }'
	- install 'stream-browserify'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "stream": false }[39m[22m
 @ ./node_modules/jest-worker/build/WorkerPool.js 41:15-62
 @ ./node_modules/jest-worker/build/index.js 38:41-64
 @ ./node_modules/terser-webpack-plugin/dist/index.js 22:18-40
 @ ./node_modules/terser-webpack-plugin/dist/cjs.js 3:15-33
 @ ./node_modules/webpack/lib/config/defaults.js 1021:25-57
 @ ./node_modules/webpack/lib/index.js 328:10-66
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/jest-worker/build/workers/NodeThreadsWorker.js[39m[22m [1m[32m9:39-54[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'path' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\jest-worker\build\workers'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "path": require.resolve("path-browserify") }'
	- install 'path-browserify'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "path": false }[39m[22m
 @ ./node_modules/jest-worker/build/WorkerPool.js 39:15-61
 @ ./node_modules/jest-worker/build/index.js 38:41-64
 @ ./node_modules/terser-webpack-plugin/dist/index.js 22:18-40
 @ ./node_modules/terser-webpack-plugin/dist/cjs.js 3:15-33
 @ ./node_modules/webpack/lib/config/defaults.js 1021:25-57
 @ ./node_modules/webpack/lib/index.js 328:10-66
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/jest-worker/build/workers/NodeThreadsWorker.js[39m[22m [1m[32m19:15-32[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'stream' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\jest-worker\build\workers'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "stream": require.resolve("stream-browserify") }'
	- install 'stream-browserify'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "stream": false }[39m[22m
 @ ./node_modules/jest-worker/build/WorkerPool.js 39:15-61
 @ ./node_modules/jest-worker/build/index.js 38:41-64
 @ ./node_modules/terser-webpack-plugin/dist/index.js 22:18-40
 @ ./node_modules/terser-webpack-plugin/dist/cjs.js 3:15-33
 @ ./node_modules/webpack/lib/config/defaults.js 1021:25-57
 @ ./node_modules/webpack/lib/index.js 328:10-66
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/jest-worker/build/workers/NodeThreadsWorker.js[39m[22m [1m[32m29:15-40[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'worker_threads' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\jest-worker\build\workers'[39m[22m
 @ ./node_modules/jest-worker/build/WorkerPool.js 39:15-61
 @ ./node_modules/jest-worker/build/index.js 38:41-64
 @ ./node_modules/terser-webpack-plugin/dist/index.js 22:18-40
 @ ./node_modules/terser-webpack-plugin/dist/cjs.js 3:15-33
 @ ./node_modules/webpack/lib/config/defaults.js 1021:25-57
 @ ./node_modules/webpack/lib/index.js 328:10-66
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/jest-worker/build/workers/messageParent.js[39m[22m [1m[32m27:39-64[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'worker_threads' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\jest-worker\build\workers'[39m[22m
 @ ./node_modules/jest-worker/build/index.js 44:44-78
 @ ./node_modules/terser-webpack-plugin/dist/index.js 22:18-40
 @ ./node_modules/terser-webpack-plugin/dist/cjs.js 3:15-33
 @ ./node_modules/webpack/lib/config/defaults.js 1021:25-57
 @ ./node_modules/webpack/lib/index.js 328:10-66
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/loader-runner/lib/LoaderRunner.js[39m[22m [1m[32m5:9-22[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'fs' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\loader-runner\lib'[39m[22m
 @ ./node_modules/webpack/lib/NormalModule.js 9:35-59
 @ ./node_modules/webpack/lib/index.js 248:9-34
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/merge-stream/index.js[39m[22m [1m[32m3:24-41[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'stream' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\merge-stream'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "stream": require.resolve("stream-browserify") }'
	- install 'stream-browserify'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "stream": false }[39m[22m
 @ ./node_modules/jest-worker/build/workers/NodeThreadsWorker.js 39:38-61
 @ ./node_modules/jest-worker/build/WorkerPool.js 39:15-61
 @ ./node_modules/jest-worker/build/index.js 38:41-64
 @ ./node_modules/terser-webpack-plugin/dist/index.js 22:18-40
 @ ./node_modules/terser-webpack-plugin/dist/cjs.js 3:15-33
 @ ./node_modules/webpack/lib/config/defaults.js 1021:25-57
 @ ./node_modules/webpack/lib/index.js 328:10-66
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/mime-types/index.js[39m[22m [1m[32m16:14-37[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'path' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\mime-types'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "path": require.resolve("path-browserify") }'
	- install 'path-browserify'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "path": false }[39m[22m
 @ ./node_modules/webpack/lib/asset/AssetGenerator.js 8:18-39
 @ ./node_modules/webpack/lib/asset/AssetModulesPlugin.js 57:40-67
 @ ./node_modules/webpack/lib/WebpackOptionsApply.js 10:27-64
 @ ./node_modules/webpack/lib/index.js 300:9-41
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/safe-buffer/index.js[39m[22m [1m[32m2:13-30[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'buffer' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\safe-buffer'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "buffer": require.resolve("buffer/") }'
	- install 'buffer'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "buffer": false }[39m[22m
 @ ./node_modules/randombytes/browser.js 15:13-42
 @ ./node_modules/serialize-javascript/index.js 9:18-40
 @ ./node_modules/terser-webpack-plugin/dist/index.js 16:50-81
 @ ./node_modules/terser-webpack-plugin/dist/cjs.js 3:15-33
 @ ./node_modules/webpack/lib/config/defaults.js 1021:25-57
 @ ./node_modules/webpack/lib/index.js 328:10-66
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/terser-webpack-plugin/dist/index.js[39m[22m [1m[32m8:35-50[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'path' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\terser-webpack-plugin\dist'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "path": require.resolve("path-browserify") }'
	- install 'path-browserify'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "path": false }[39m[22m
 @ ./node_modules/terser-webpack-plugin/dist/cjs.js 3:15-33
 @ ./node_modules/webpack/lib/config/defaults.js 1021:25-57
 @ ./node_modules/webpack/lib/index.js 328:10-66
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/terser-webpack-plugin/dist/index.js[39m[22m [1m[32m10:33-46[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'os' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\terser-webpack-plugin\dist'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "os": require.resolve("os-browserify/browser") }'
	- install 'os-browserify'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "os": false }[39m[22m
 @ ./node_modules/terser-webpack-plugin/dist/cjs.js 3:15-33
 @ ./node_modules/webpack/lib/config/defaults.js 1021:25-57
 @ ./node_modules/webpack/lib/index.js 328:10-66
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/terser/node_modules/source-map/lib/read-wasm.js[39m[22m [1m[32m20:13-26[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'fs' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\terser\node_modules\source-map\lib'[39m[22m
 @ ./node_modules/terser/node_modules/source-map/lib/source-map-consumer.js 12:17-44
 @ ./node_modules/terser/node_modules/source-map/source-map.js 7:0-82
 @ ./node_modules/terser/dist/bundle.min.js 2:80-101
 @ ./node_modules/terser-webpack-plugin/dist/minify.js 5:4-21
 @ ./node_modules/terser-webpack-plugin/dist/index.js 26:14-33 288:31-58
 @ ./node_modules/terser-webpack-plugin/dist/cjs.js 3:15-33
 @ ./node_modules/webpack/lib/config/defaults.js 1021:25-57
 @ ./node_modules/webpack/lib/index.js 328:10-66
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/terser/node_modules/source-map/lib/read-wasm.js[39m[22m [1m[32m21:15-30[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'path' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\terser\node_modules\source-map\lib'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "path": require.resolve("path-browserify") }'
	- install 'path-browserify'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "path": false }[39m[22m
 @ ./node_modules/terser/node_modules/source-map/lib/source-map-consumer.js 12:17-44
 @ ./node_modules/terser/node_modules/source-map/source-map.js 7:0-82
 @ ./node_modules/terser/dist/bundle.min.js 2:80-101
 @ ./node_modules/terser-webpack-plugin/dist/minify.js 5:4-21
 @ ./node_modules/terser-webpack-plugin/dist/index.js 26:14-33 288:31-58
 @ ./node_modules/terser-webpack-plugin/dist/cjs.js 3:15-33
 @ ./node_modules/webpack/lib/config/defaults.js 1021:25-57
 @ ./node_modules/webpack/lib/index.js 328:10-66
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/watchpack/lib/DirectoryWatcher.js[39m[22m [1m[32m9:13-28[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'path' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\watchpack\lib'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "path": require.resolve("path-browserify") }'
	- install 'path-browserify'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "path": false }[39m[22m
 @ ./node_modules/watchpack/lib/watchpack.js 280:31-281:30
 @ ./node_modules/webpack/lib/config/defaults.js 346:5-33 354:4-32 366:5-33 374:5-33
 @ ./node_modules/webpack/lib/index.js 328:10-66
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/watchpack/lib/DirectoryWatcher.js[39m[22m [1m[32m17:15-37[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'os' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\watchpack\lib'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "os": require.resolve("os-browserify/browser") }'
	- install 'os-browserify'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "os": false }[39m[22m
 @ ./node_modules/watchpack/lib/watchpack.js 280:31-281:30
 @ ./node_modules/webpack/lib/config/defaults.js 346:5-33 354:4-32 366:5-33 374:5-33
 @ ./node_modules/webpack/lib/index.js 328:10-66
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/watchpack/lib/LinkResolver.js[39m[22m [1m[32m7:11-24[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'fs' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\watchpack\lib'[39m[22m
 @ ./node_modules/watchpack/lib/watchpack.js 8:21-46
 @ ./node_modules/webpack/lib/config/defaults.js 346:5-33 354:4-32 366:5-33 374:5-33
 @ ./node_modules/webpack/lib/index.js 328:10-66
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/watchpack/lib/LinkResolver.js[39m[22m [1m[32m8:13-28[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'path' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\watchpack\lib'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "path": require.resolve("path-browserify") }'
	- install 'path-browserify'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "path": false }[39m[22m
 @ ./node_modules/watchpack/lib/watchpack.js 8:21-46
 @ ./node_modules/webpack/lib/config/defaults.js 346:5-33 354:4-32 366:5-33 374:5-33
 @ ./node_modules/webpack/lib/index.js 328:10-66
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/watchpack/lib/getWatcherManager.js[39m[22m [1m[32m7:13-28[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'path' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\watchpack\lib'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "path": require.resolve("path-browserify") }'
	- install 'path-browserify'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "path": false }[39m[22m
 @ ./node_modules/watchpack/lib/watchpack.js 7:26-56
 @ ./node_modules/webpack/lib/config/defaults.js 346:5-33 354:4-32 366:5-33 374:5-33
 @ ./node_modules/webpack/lib/index.js 328:10-66
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/watchpack/lib/reducePlan.js[39m[22m [1m[32m7:13-28[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'path' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\watchpack\lib'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "path": require.resolve("path-browserify") }'
	- install 'path-browserify'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "path": false }[39m[22m
 @ ./node_modules/watchpack/lib/watchEventSource.js 10:19-42
 @ ./node_modules/watchpack/lib/watchpack.js 11:25-54
 @ ./node_modules/webpack/lib/config/defaults.js 346:5-33 354:4-32 366:5-33 374:5-33
 @ ./node_modules/webpack/lib/index.js 328:10-66
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/watchpack/lib/watchEventSource.js[39m[22m [1m[32m7:11-24[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'fs' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\watchpack\lib'[39m[22m
 @ ./node_modules/watchpack/lib/watchpack.js 11:25-54
 @ ./node_modules/webpack/lib/config/defaults.js 346:5-33 354:4-32 366:5-33 374:5-33
 @ ./node_modules/webpack/lib/index.js 328:10-66
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/watchpack/lib/watchEventSource.js[39m[22m [1m[32m8:13-28[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'path' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\watchpack\lib'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "path": require.resolve("path-browserify") }'
	- install 'path-browserify'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "path": false }[39m[22m
 @ ./node_modules/watchpack/lib/watchpack.js 11:25-54
 @ ./node_modules/webpack/lib/config/defaults.js 346:5-33 354:4-32 366:5-33 374:5-33
 @ ./node_modules/webpack/lib/index.js 328:10-66
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/watchpack/lib/watchEventSource.js[39m[22m [1m[32m12:15-37[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'os' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\watchpack\lib'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "os": require.resolve("os-browserify/browser") }'
	- install 'os-browserify'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "os": false }[39m[22m
 @ ./node_modules/watchpack/lib/watchpack.js 11:25-54
 @ ./node_modules/webpack/lib/config/defaults.js 346:5-33 354:4-32 366:5-33 374:5-33
 @ ./node_modules/webpack/lib/index.js 328:10-66
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/webpack/hot/lazy-compilation-node.js[39m[22m [1m[32m12:15-38[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'http' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\webpack\hot'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "http": require.resolve("stream-http") }'
	- install 'stream-http'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "http": false }[39m[22m
 @ ./node_modules/webpack/hot/ sync ^\.\/lazy\-compilation\-.*\.js$ ./lazy-compilation-node.js
 @ ./node_modules/webpack/lib/WebpackOptionsApply.js 268:5-272:6
 @ ./node_modules/webpack/lib/index.js 300:9-41
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/webpack/lib/ChunkGraph.js[39m[22m [1m[32m8:13-28[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'util' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\webpack\lib'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "util": require.resolve("util/") }'
	- install 'util'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "util": false }[39m[22m
 @ ./node_modules/webpack/lib/index.js 138:9-32
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/webpack/lib/ChunkGroup.js[39m[22m [1m[32m8:13-28[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'util' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\webpack\lib'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "util": require.resolve("util/") }'
	- install 'util'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "util": false }[39m[22m
 @ ./node_modules/webpack/lib/Compilation.js 23:19-42
 @ ./node_modules/webpack/lib/index.js 144:9-33
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/webpack/lib/ChunkTemplate.js[39m[22m [1m[32m8:13-28[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'util' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\webpack\lib'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "util": require.resolve("util/") }'
	- install 'util'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "util": false }[39m[22m
 @ ./node_modules/webpack/lib/Compilation.js 25:22-48
 @ ./node_modules/webpack/lib/index.js 144:9-33
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/webpack/lib/Compilation.js[39m[22m [1m[32m18:13-28[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'util' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\webpack\lib'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "util": require.resolve("util/") }'
	- install 'util'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "util": false }[39m[22m
 @ ./node_modules/webpack/lib/index.js 144:9-33
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/webpack/lib/ExternalModuleFactoryPlugin.js[39m[22m [1m[32m8:13-28[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'util' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\webpack\lib'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "util": require.resolve("util/") }'
	- install 'util'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "util": false }[39m[22m
 @ ./node_modules/webpack/lib/DllReferencePlugin.js 10:36-76
 @ ./node_modules/webpack/lib/index.js 171:9-40
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/webpack/lib/MainTemplate.js[39m[22m [1m[32m9:13-28[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'util' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\webpack\lib'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "util": require.resolve("util/") }'
	- install 'util'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "util": false }[39m[22m
 @ ./node_modules/webpack/lib/Compilation.js 40:21-46
 @ ./node_modules/webpack/lib/index.js 144:9-33
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/webpack/lib/Module.js[39m[22m [1m[32m8:13-28[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'util' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\webpack\lib'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "util": require.resolve("util/") }'
	- install 'util'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "util": false }[39m[22m
 @ ./node_modules/webpack/lib/index.js 233:9-28
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/webpack/lib/ModuleGraph.js[39m[22m [1m[32m8:13-28[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'util' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\webpack\lib'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "util": require.resolve("util/") }'
	- install 'util'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "util": false }[39m[22m
 @ ./node_modules/webpack/lib/index.js 239:9-33
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/webpack/lib/ModuleTemplate.js[39m[22m [1m[32m8:13-28[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'util' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\webpack\lib'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "util": require.resolve("util/") }'
	- install 'util'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "util": false }[39m[22m
 @ ./node_modules/webpack/lib/Compilation.js 49:23-50
 @ ./node_modules/webpack/lib/index.js 144:9-33
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/webpack/lib/NormalModule.js[39m[22m [1m[32m10:20-42[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'querystring' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\webpack\lib'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "querystring": require.resolve("querystring-es3") }'
	- install 'querystring-es3'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "querystring": false }[39m[22m
 @ ./node_modules/webpack/lib/index.js 248:9-34
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/webpack/lib/TemplatedPathPlugin.js[39m[22m [1m[32m8:30-45[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'path' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\webpack\lib'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "path": require.resolve("path-browserify") }'
	- install 'path-browserify'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "path": false }[39m[22m
 @ ./node_modules/webpack/lib/WebpackOptionsApply.js 27:28-60
 @ ./node_modules/webpack/lib/index.js 300:9-41
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/webpack/lib/TemplatedPathPlugin.js[39m[22m [1m[32m9:13-28[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'util' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\webpack\lib'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "util": require.resolve("util/") }'
	- install 'util'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "util": false }[39m[22m
 @ ./node_modules/webpack/lib/WebpackOptionsApply.js 27:28-60
 @ ./node_modules/webpack/lib/index.js 300:9-41
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/webpack/lib/WebpackError.js[39m[22m [1m[32m8:16-46[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'util' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\webpack\lib'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "util": require.resolve("util/") }'
	- install 'util'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "util": false }[39m[22m
 @ ./node_modules/webpack/lib/index.js 297:9-34
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/webpack/lib/asset/AssetGenerator.js[39m[22m [1m[32m9:13-28[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'path' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\webpack\lib\asset'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "path": require.resolve("path-browserify") }'
	- install 'path-browserify'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "path": false }[39m[22m
 @ ./node_modules/webpack/lib/asset/AssetModulesPlugin.js 57:40-67
 @ ./node_modules/webpack/lib/WebpackOptionsApply.js 10:27-64
 @ ./node_modules/webpack/lib/index.js 300:9-41
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/webpack/lib/cli.js[39m[22m [1m[32m8:13-28[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'path' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\webpack\lib'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "path": require.resolve("path-browserify") }'
	- install 'path-browserify'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "path": false }[39m[22m
 @ ./node_modules/webpack/lib/index.js 120:9-25
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/webpack/lib/config/browserslistTargetHandler.js[39m[22m [1m[32m9:13-28[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'path' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\webpack\lib\config'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "path": require.resolve("path-browserify") }'
	- install 'path-browserify'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "path": false }[39m[22m
 @ ./node_modules/webpack/lib/config/target.js 11:1-39
 @ ./node_modules/webpack/lib/config/defaults.js 16:4-23
 @ ./node_modules/webpack/lib/index.js 328:10-66
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/webpack/lib/config/defaults.js[39m[22m [1m[32m8:11-24[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'fs' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\webpack\lib\config'[39m[22m
 @ ./node_modules/webpack/lib/index.js 328:10-66
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/webpack/lib/config/defaults.js[39m[22m [1m[32m9:13-28[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'path' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\webpack\lib\config'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "path": require.resolve("path-browserify") }'
	- install 'path-browserify'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "path": false }[39m[22m
 @ ./node_modules/webpack/lib/index.js 328:10-66
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/webpack/lib/config/normalization.js[39m[22m [1m[32m8:13-28[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'util' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\webpack\lib\config'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "util": require.resolve("util/") }'
	- install 'util'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "util": false }[39m[22m
 @ ./node_modules/webpack/lib/index.js 325:10-71
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/webpack/lib/dependencies/ImportMetaPlugin.js[39m[22m [1m[32m8:26-40[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'url' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\webpack\lib\dependencies'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "url": require.resolve("url/") }'
	- install 'url'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "url": false }[39m[22m
 @ ./node_modules/webpack/lib/WebpackOptionsApply.js 38:25-67
 @ ./node_modules/webpack/lib/index.js 300:9-41
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/webpack/lib/dependencies/WorkerPlugin.js[39m[22m [1m[32m8:26-40[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'url' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\webpack\lib\dependencies'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "url": require.resolve("url/") }'
	- install 'url'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "url": false }[39m[22m
 @ ./node_modules/webpack/lib/WebpackOptionsApply.js 46:21-59
 @ ./node_modules/webpack/lib/index.js 300:9-41
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/webpack/lib/hmr/lazyCompilationBackend.js[39m[22m [1m[32m8:13-28[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'http' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\webpack\lib\hmr'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "http": require.resolve("stream-http") }'
	- install 'stream-http'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "http": false }[39m[22m
 @ ./node_modules/webpack/lib/WebpackOptionsApply.js 265:5-44
 @ ./node_modules/webpack/lib/index.js 300:9-41
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/webpack/lib/index.js[39m[22m [1m[32m8:13-28[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'util' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\webpack\lib'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "util": require.resolve("util/") }'
	- install 'util'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "util": false }[39m[22m
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/webpack/lib/javascript/JavascriptGenerator.js[39m[22m [1m[32m8:13-28[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'util' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\webpack\lib\javascript'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "util": require.resolve("util/") }'
	- install 'util'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "util": false }[39m[22m
 @ ./node_modules/webpack/lib/javascript/JavascriptModulesPlugin.js 28:28-60
 @ ./node_modules/webpack/lib/index.js 211:9-56 379:10-57
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/webpack/lib/javascript/JavascriptModulesPlugin.js[39m[22m [1m[32m9:11-24[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'vm' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\webpack\lib\javascript'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "vm": require.resolve("vm-browserify") }'
	- install 'vm-browserify'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "vm": false }[39m[22m
 @ ./node_modules/webpack/lib/index.js 211:9-56 379:10-57
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/webpack/lib/javascript/JavascriptParser.js[39m[22m [1m[32m11:11-24[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'vm' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\webpack\lib\javascript'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "vm": require.resolve("vm-browserify") }'
	- install 'vm-browserify'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "vm": false }[39m[22m
 @ ./node_modules/webpack/lib/index.js 382:10-50
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/webpack/lib/node/nodeConsole.js[39m[22m [1m[32m8:13-28[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'util' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\webpack\lib\node'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "util": require.resolve("util/") }'
	- install 'util'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "util": false }[39m[22m
 @ ./node_modules/webpack/lib/node/NodeEnvironmentPlugin.js 12:20-44
 @ ./node_modules/webpack/lib/index.js 458:10-49
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/webpack/lib/rules/UseEffectRulePlugin.js[39m[22m [1m[32m8:13-28[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'util' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\webpack\lib\rules'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "util": require.resolve("util/") }'
	- install 'util'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "util": false }[39m[22m
 @ ./node_modules/webpack/lib/NormalModuleFactory.js 26:28-66
 @ ./node_modules/webpack/lib/Compiler.js 25:28-60
 @ ./node_modules/webpack/lib/index.js 147:9-30
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/webpack/lib/schemes/FileUriPlugin.js[39m[22m [1m[32m8:31-45[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'url' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\webpack\lib\schemes'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "url": require.resolve("url/") }'
	- install 'url'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "url": false }[39m[22m
 @ ./node_modules/webpack/lib/WebpackOptionsApply.js 32:22-56
 @ ./node_modules/webpack/lib/index.js 300:9-41
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/webpack/lib/schemes/HttpUriPlugin.js[39m[22m [1m[32m8:38-53[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'path' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\webpack\lib\schemes'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "path": require.resolve("path-browserify") }'
	- install 'path-browserify'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "path": false }[39m[22m
 @ ./node_modules/webpack/lib/index.js 556:11-45
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/webpack/lib/schemes/HttpUriPlugin.js[39m[22m [1m[32m9:16-30[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'url' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\webpack\lib\schemes'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "url": require.resolve("url/") }'
	- install 'url'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "url": false }[39m[22m
 @ ./node_modules/webpack/lib/index.js 556:11-45
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/webpack/lib/schemes/HttpUriPlugin.js[39m[22m [1m[32m10:64-79[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'zlib' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\webpack\lib\schemes'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "zlib": require.resolve("browserify-zlib") }'
	- install 'browserify-zlib'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "zlib": false }[39m[22m
 @ ./node_modules/webpack/lib/index.js 556:11-45
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/webpack/lib/schemes/HttpUriPlugin.js[39m[22m [1m[32m19:30-45[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'http' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\webpack\lib\schemes'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "http": require.resolve("stream-http") }'
	- install 'stream-http'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "http": false }[39m[22m
 @ ./node_modules/webpack/lib/index.js 556:11-45
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/webpack/lib/schemes/HttpUriPlugin.js[39m[22m [1m[32m20:31-47[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'https' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\webpack\lib\schemes'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "https": require.resolve("https-browserify") }'
	- install 'https-browserify'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "https": false }[39m[22m
 @ ./node_modules/webpack/lib/index.js 556:11-45
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/webpack/lib/serialization/FileMiddleware.js[39m[22m [1m[32m7:22-39[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'buffer' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\webpack\lib\serialization'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "buffer": require.resolve("buffer/") }'
	- install 'buffer'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "buffer": false }[39m[22m
 @ ./node_modules/webpack/lib/util/serialization.js 99:25-67
 @ ./node_modules/webpack/lib/index.js 539:10-41
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/webpack/lib/serialization/FileMiddleware.js[39m[22m [1m[32m8:21-38[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'stream' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\webpack\lib\serialization'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "stream": require.resolve("stream-browserify") }'
	- install 'stream-browserify'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "stream": false }[39m[22m
 @ ./node_modules/webpack/lib/util/serialization.js 99:25-67
 @ ./node_modules/webpack/lib/index.js 539:10-41
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/webpack/lib/serialization/FileMiddleware.js[39m[22m [1m[32m15:4-19[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'zlib' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\webpack\lib\serialization'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "zlib": require.resolve("browserify-zlib") }'
	- install 'browserify-zlib'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "zlib": false }[39m[22m
 @ ./node_modules/webpack/lib/util/serialization.js 99:25-67
 @ ./node_modules/webpack/lib/index.js 539:10-41
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/webpack/lib/stats/DefaultStatsFactoryPlugin.js[39m[22m [1m[32m8:13-28[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'util' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\webpack\lib\stats'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "util": require.resolve("util/") }'
	- install 'util'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "util": false }[39m[22m
 @ ./node_modules/webpack/lib/WebpackOptionsApply.js 51:34-78
 @ ./node_modules/webpack/lib/index.js 300:9-41
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/webpack/lib/util/createHash.js[39m[22m [1m[32m143:38-55[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'crypto' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\webpack\lib\util'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "crypto": require.resolve("crypto-browserify") }'
	- install 'crypto-browserify'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "crypto": false }[39m[22m
 @ ./node_modules/webpack/lib/index.js 533:10-38
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/webpack/lib/util/deprecation.js[39m[22m [1m[32m8:13-28[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'util' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\webpack\lib\util'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "util": require.resolve("util/") }'
	- install 'util'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "util": false }[39m[22m
 @ ./node_modules/webpack/lib/Chunk.js 18:43-72
 @ ./node_modules/webpack/lib/index.js 135:9-27
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/webpack/lib/util/fs.js[39m[22m [1m[32m8:13-28[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'path' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\webpack\lib\util'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "path": require.resolve("path-browserify") }'
	- install 'path-browserify'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "path": false }[39m[22m
 @ ./node_modules/webpack/lib/CleanPlugin.js 12:17-37
 @ ./node_modules/webpack/lib/index.js 141:9-33
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/webpack/lib/util/identifier.js[39m[22m [1m[32m7:13-28[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'path' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\webpack\lib\util'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "path": require.resolve("path-browserify") }'
	- install 'path-browserify'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "path": false }[39m[22m
 @ ./node_modules/webpack/lib/Compiler.js 33:30-58
 @ ./node_modules/webpack/lib/index.js 147:9-30
 @ ./src/index.js 7:0-39

[1m[31mERROR[39m[22m in [1m./node_modules/webpack/lib/webpack.js[39m[22m [1m[32m8:13-28[39m[22m
[1mModule [1m[31mnot found[39m[22m[1m: [1m[31mError[39m[22m[1m: Can't resolve 'util' in 'C:\Users\josh_\OneDrive\Desktop\PROJECTS\GITHUB\DOThtml\node_modules\webpack\lib'

[1m[31mBREAKING CHANGE[39m[22m[1m: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
	- add a fallback 'resolve.fallback: { "util": require.resolve("util/") }'
	- install 'util'
If you don't want to include a polyfill, you can use an empty module like this:
	resolve.fallback: { "util": false }[39m[22m
 @ ./node_modules/webpack/lib/index.js 95:30-50 98:9-29
 @ ./src/index.js 7:0-39

[1m[33m83 errors have detailed information that is not shown.
Use 'stats.errorDetails: true' resp. '--stats-error-details' to show it.[39m[22m

webpack 5.50.0 compiled with [1m[31m83 errors[39m[22m and [1m[33m10 warnings[39m[22m in 17231 ms
