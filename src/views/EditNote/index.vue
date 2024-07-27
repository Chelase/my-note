<script setup>
import Vditor from 'vditor'
import 'vditor/dist/index.css'
import {ref, onMounted, onActivated} from 'vue'
import { useNoteStore } from '@/stores/note.js'
import {ElMessage} from "element-plus";
import router from "@/router/index.js";
import {storeToRefs} from "pinia";

const vditor = ref()
const NoteContent = ref({
  title: '',
  content: ''
})
const noteStore = useNoteStore()
const noteId = router.currentRoute.value.query.id

async function editNote() {
  if (noteId) {
    await noteStore.getNoteList(noteId)
    const { NoteData } = storeToRefs(noteStore)
    NoteContent.value = NoteData.value.list
  }
}

onMounted(async () => {
  await editNote();
  initializeVditor();
});

onActivated(() => {
  if (vditor.value) {
    vditor.value.setValue(NoteContent.value.content);
  }
});

function initializeVditor() {
  vditor.value = new Vditor('vditor', {
    "minHeight": 500,
    toolbarConfig: {
      "pin": true
    },
    counter: {
      enable: true,
    },
    cache: {
      enable: false
    },
    toolbar: [
      "emoji",
      "headings",
      "bold",
      "italic",
      "strike",
      "link",
      "|",
      "list",
      "ordered-list",
      "check",
      "outdent",
      "indent",
      "|",
      "quote",
      "line",
      "code",
      "inline-code",
      "insert-before",
      "insert-after",
      "|",
      "upload",
      "record",
      "table",
      "|",
      "undo",
      "redo",
      "|",
      "fullscreen",
      "edit-mode",
      {
        name: "more",
        toolbar: [
          "both",
          "code-theme",
          "content-theme",
          "export",
          "outline",
          "preview",
          "devtools",
          "info",
          "help",
        ],
      },
    ],
    after() {
      vditor.value.setValue(NoteContent.value.content);
    }
  });
}

async function saveNote () {
  if (NoteContent.value.title === '')
    ElMessage.error('标题为空')
  else {
    NoteContent.value.content = vditor.value.getValue()
    await noteStore.addNoteList(NoteContent.value)
    ElMessage.success('保存成功')
    router.go(-1)
  }
}
</script>

<template>
  <div class="container border" style="padding-bottom: 20px">
    <div class="top-nav">
      <button class="btn btn-link" @click="$router.go(-1)">
        <i class="bi bi-arrow-left"></i>
        返回
      </button>
      <button class="btn btn-success" @click="saveNote">保存</button>
    </div>
    <input type="text" v-model="NoteContent.title" placeholder="请输入标题..." minlength="1" maxlength="50">
    <div id="vditor" style="margin-top: 20px;"></div>
  </div>
</template>

<style scoped>
.top-nav {
  width: 100%;
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
input {
  width: 100%;
  outline: none;
  border: none;
  text-align: center;
}

:deep(iframe) {
  display: none;
}
</style>