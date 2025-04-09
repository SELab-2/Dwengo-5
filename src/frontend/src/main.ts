import App from './App.svelte';
import { mount } from 'svelte';
import './lib/styles/global.css';

// Mount the App component
const app = mount(App, {
  target: document.getElementById('app'),
});