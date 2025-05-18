<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import Quill from 'quill';
  import 'quill/dist/quill.snow.css';
  import { apiRequest } from '../../../../lib/api';

  export let learningobjectMetadata: {
    title: string;
    link: string;
    contentLink: string;
  } = null;

  export let onUpdate: (html: string) => void;

  let content: string = '';
  let editorContainer: HTMLDivElement;
  let quill: Quill;

  // Watch for changes to learningobjectMetadata
  $: if (learningobjectMetadata?.contentLink) {
    fetchContent(learningobjectMetadata.contentLink);
  }

  async function fetchContent(url: string) {
    try {
      const response = await apiRequest(url, 'GET');
      content = response.htmlContent || '';
      if (quill) {
        quill.root.innerHTML = content;
      }
    } catch (error) {
      console.error('Failed to load content:', error);
    }
  }

  onMount(() => {
    const toolbarOptions = [
      [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['bold', 'italic', 'underline'],
      [{ 'color': [] }, { 'background': [] }],
      ['link'],
    ];

    quill = new Quill(editorContainer, {
      theme: 'snow',
      modules: {
        toolbar: toolbarOptions,
      },
    });

    quill.root.innerHTML = content;

    quill.on('text-change', () => {
      content = quill.root.innerHTML;
      onUpdate?.(content);
    });
  });

  onDestroy(() => {
    quill?.off('text-change');
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
