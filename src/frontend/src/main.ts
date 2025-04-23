import App from './App.svelte';
import { mount } from 'svelte';
import './lib/styles/global.css';

const target = document.getElementById('app');

if (!target) {
    throw new Error("Target element with id 'app' not found");
}

const app = mount(App, {
    target,
});
