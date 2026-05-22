import App from './App.svelte';

const app = new App({
    target: document.getElementById('app')
});
performance.mark('framework-ready');

export default app;
