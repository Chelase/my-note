<script setup>
import {ref, onBeforeMount, onBeforeUnmount} from 'vue'
import TipTapPlugin from '@/utils/tiptap/index.js'
import {useEditor, EditorContent, BubbleMenu, FloatingMenu} from '@tiptap/vue-3'


const article = ref({
  title: '',
  content: '',
})
const editor = useEditor(TipTapPlugin)

function testHtml() {
  console.log(editor.value.getHTML());
}

onBeforeUnmount(() => {
  editor.value.destroy();
})

</script>

<template>
  <div class="container">
    <div class="title">
      <div class="cover-photo">
        <img src="" alt="">
      </div>
      <div class="w-100 d-flex justify-content-between align-items-center">
        <textarea rows="4" cols="50" type="text" v-model="article.title" placeholder="请输入标题..." minlength="1" maxlength="50"></textarea>
        <div>{{article.title.length}}/50</div>
      </div>
    </div>

    <editor-content :editor="editor" />

    <div v-if="editor">
      <bubble-menu
          class="bubble-menu"
          :tippy-options="{ duration: 100 }"
          :editor="editor"
      >
        <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">
          加粗
        </button>
        <button @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }">
          斜体
        </button>
        <button @click="editor.chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }">
          删除线
        </button>
      </bubble-menu>

      <floating-menu
          class="floating-menu"
          :tippy-options="{ duration: 100 }"
          :editor="editor"
      >
        <button @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }">
          1级标题
        </button>
        <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }">
          2级标题
        </button>
        <button @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }">
          无序列表
        </button>
      </floating-menu>
    </div>

    <ElButton @click="testHtml">测试HTML</ElButton>
  </div>

</template>

<style scoped>

.title {
  min-height: 150px;
  padding-bottom: 10px;
  margin-bottom: 30px;
  border-bottom: 1px solid #ccc;
  color: #585858;

  .cover-photo {
    width: 100px;
    min-height: 100px;
    margin-bottom: 20px;

    img {
      width: 100px;
      height: 100px;
    }
  }

  textarea {
    width: 97%;
    min-height: 100px;
    border: none;
    outline: none;
    background: none;
    font-size: 28px;
    font-weight: bold;
    resize: none;
  }
}

.tiptap {
  :first-child {
    margin-top: 0;
  }

  /* Code and preformatted text styles */
  code {
    background-color: var(--purple-light);
    border-radius: 0.4rem;
    color: var(--black);
    font-size: 0.85rem;
    padding: 0.25em 0.3em;
  }

  /* Color swatches */
  .color {
    white-space: nowrap;

    &::before {
      background-color: var(--color);
      border: 1px solid rgba(128, 128, 128, 0.3);
      border-radius: 2px;
      content: " ";
      display: inline-block;
      height: 1em;
      margin-bottom: 0.15em;
      margin-right: 0.1em;
      vertical-align: middle;
      width: 1em;
    }
  }
}

</style>