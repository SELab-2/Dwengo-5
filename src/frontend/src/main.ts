import App from './App.svelte';
import { mount } from 'svelte';

// Mount the App component
const app = mount(App, {
  target: document.getElementById('app'),
});