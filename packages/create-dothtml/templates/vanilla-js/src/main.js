import { dot } from 'dothtml';
import './style.css';
import { Counter } from './components/Counter';

dot('#app')
  .h1('Welcome to DOThtml!')
  .p('The fastest, lightest way to build reactive web apps.')
  .mount(new Counter())
  .p({ style: 'margin-top: 2rem; opacity: 0.8;' }, 
    'Edit ', dot.code('src/main.js'), ' to get started!'
  );
