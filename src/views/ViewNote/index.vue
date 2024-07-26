<script setup>
import { useRouter } from "vue-router";
import {useNoteStore} from "@/stores/note.js";
import {onMounted, ref} from "vue";
import {storeToRefs} from "pinia";
import { marked } from "marked";
import { preview } from 'vue3-image-preview'

import "github-markdown-css"

const router = useRouter()
const noteStore = useNoteStore()
const NoteList = ref([])

const noteId = router.currentRoute.value.query.id

async function getNotes() {
  await noteStore.getNoteList(noteId)
  const { NoteData } = storeToRefs(noteStore)
  NoteList.value = NoteData.value.list
  NoteList.value.createTime = NoteList.value.createTime.slice(0,10)
  if (NoteList.value.upDateTime)
    NoteList.value.upDateTime = NoteList.value.upDateTime.slice(0,10)
  NoteList.value.content = marked(NoteList.value.content)
}
getNotes()

onMounted(() => {

  // 等待 DOM 渲染完成后，检查并调整 iframe 高度
  const adjustIframes = () => {
    const iframes = document.querySelectorAll("iframe");
    iframes.forEach(iframe => {
      if (!iframe.getAttribute("height")) {
        iframe.style.height = "500px"; // 设置默认高度
      }
    });
  };

  // 为所有图片添加预览
  const addPhotoPreview = () => {
    // 获取所有的 img 元素
    const imgElements = document.querySelectorAll('img');

    // 遍历 imgElements 数组并输出每个 img 元素的 src 属性
    imgElements.forEach(imgElement => {
      imgElement.addEventListener('click',() => {
        preview({
          images: imgElement.src
        })
      })
    });
  }

  // 使用 MutationObserver 观察 DOM 变化
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        adjustIframes()
        addPhotoPreview()
      }
    }
  });

  const contentElement = document.querySelector(".content");
  if (contentElement) {
    observer.observe(contentElement, { childList: true, subtree: true });
    adjustIframes()
    addPhotoPreview()
  }
});
</script>

<template>
<div class="box">
  <div class="container">
    <button class="btn btn-link" @click="$router.go(-1)">
      <i class="bi bi-arrow-left"></i>
      返回
    </button>
    <h1>{{ NoteList.title }}</h1>
    <div class="time-box">
      <p>{{ NoteList.createTime }}</p>
      <p v-if="NoteList.upDateTime" style="text-align: right"> 于{{ NoteList.upDateTime }}修改 </p>
    </div>
    <hr>
    <div class="content" v-html="NoteList.content"></div>
  </div>
</div>
</template>

<style scoped>
.box {
  width: 100%;
  min-height: 100vh;
  --color: #E1E1E1;
  background-color: #F3F3F3;
  background-image: linear-gradient(0deg, transparent 24%, var(--color) 25%, var(--color) 26%, transparent 27%,transparent 74%, var(--color) 75%, var(--color) 76%, transparent 77%,transparent),
  linear-gradient(90deg, transparent 24%, var(--color) 25%, var(--color) 26%, transparent 27%,transparent 74%, var(--color) 75%, var(--color) 76%, transparent 77%,transparent);
  background-size: 55px 55px;
  padding-bottom: 10px;
}

.time-box {
  width: 100%;
  height: 25px;
  display: flex;
  justify-content: space-between;
}

.content {
  width: auto;
  margin-top: 20px;
}

:deep(img) {
  width: 100%;
  height: auto;
}

:deep(iframe) {
  width: 100%;
  max-height: 500px;
}

@media (min-width: 1000px) {
  .container {
    width: 950px;
  }
}
</style>