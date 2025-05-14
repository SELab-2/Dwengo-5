<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import Quill from 'quill';
  import 'quill/dist/quill.snow.css';

  export let content = '';
  export let onUpdate: (html: string) => void;

  let editorContainer: HTMLDivElement;
  let quill: Quill;

  onMount(() => {
    const toolbarOptions = [
      [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['bold', 'italic', 'underline'],
      [{ 'color': [] }, { 'background': [] }],
      ['link'],
    ];

    // Initialize Quill with a toolbar
    quill = new Quill(editorContainer, {
      theme: 'snow',
      modules: {
        toolbar: toolbarOptions,
      },
    });

    quill.root.innerHTML = content;

    quill.on('text-change', () => {
      onUpdate?.(quill.root.innerHTML);
    });
  });

  onDestroy(() => {
    quill.off('text-change');
  });
</script>

<!-- Toolbar and editor -->
<div class="quill-toolbar"></div> <!-- This will be rendered by Quill itself -->
<div bind:this={editorContainer} class="quill-editor"></div>

<style>
  .quill-editor {
    height: 200px;
    border: 2px solid #ddd;
    border-radius: 4px;
    padding: 10px;
  }

  .quill-toolbar {
    margin-bottom: 10px;
  }
</style>
