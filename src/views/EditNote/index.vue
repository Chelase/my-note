<script setup>
import Vditor from 'vditor'
import 'vditor/dist/index.css'
import {ref, onMounted, onActivated} from 'vue'
import {ElMessage} from "element-plus";
import router from "@/router/index.js";
import noteApi from '@/api/modules/note.js'
import useUserStore from '@/stores/user.js'

const userStore = useUserStore()

const vditor = ref()
const NoteContent = ref({
  title: '',
  content: ''
})
const noteId = router.currentRoute.value.query.id

async function editNote() {
  if (noteId) {
    await noteApi.GetNote({id: noteId}).then(res => {
      NoteContent.value = res.note
    })
  }
  initializeVditor();
}

onMounted(async () => {
  await editNote();
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
    model: 'ir',
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
    NoteContent.value.userInfoId = userStore.UserId
    await noteApi.AddNote(NoteContent.value).then( () => {
      ElMessage.success('保存成功')
      router.go(-1)
    })
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
