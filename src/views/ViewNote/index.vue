<script setup>
import { useRouter } from "vue-router";
import {onMounted, ref, computed} from "vue";
import { marked } from "marked";
import { preview } from 'vue3-image-preview'

import noteApi from "@/api/modules/note.js";
import commentApi from "@/api/modules/comment.js";
import publicApi from "@/api/modules/public.js";
import useUserStore from '@/stores/user.js'

import Drawer from "@/components/drawer.vue";

import "github-markdown-css"
const router = useRouter()
const userStore = useUserStore()

const NoteList = ref({})
const noteId = Number(router.currentRoute.value.query.id)

const openComment = ref(false)
const CommentList = ref([])
const Total = ref(0)

const likes = ref([])

async function getNotes() {
  await noteApi.GetNote({id: noteId}).then(res => {
    NoteList.value = res.data
  })
  NoteList.value.createTime = NoteList.value.createTime.slice(0,10)
  if (NoteList.value.upDateTime)
    NoteList.value.upDateTime = NoteList.value.upDateTime.slice(0,10)
  NoteList.value.content = marked(NoteList.value.content)
}
getNotes()

async function getComment() {
  const {data, total} = await commentApi.GetComment({id:noteId})
  CommentList.value = data
  Total.value = total
}

getComment()

onMounted(() => {

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
      if (mutation.type === "childList") { addPhotoPreview() }
    }
  });

  const contentElement = document.querySelector(".content");
  if (contentElement) {
    observer.observe(contentElement, { childList: true, subtree: true });
    addPhotoPreview()
  }
});

function upClose(row) {
  openComment.value = row
}

async function likeArticle() {
  await publicApi.likes({
    userInfoId: userStore.UserId,
    contentType: 'Article',
    likeId: noteId
  })
  await getNotes()
  await getLikes()
}

async function getLikes() {
  const { data } = await publicApi.GetLikes({
    userInfoId: userStore.UserId,
    contentType: 'Article'
  })
  likes.value = data
}

if (userStore.isLogin) getLikes()

const isLike = computed(() => {
  return likes.value.find(item => item.likeId === noteId);
})

</script>

<template>
<div class="box">
  <div class="suspension-bar d-flex justify-content-around flex-column">
    <div class="box-bi d-flex flex-column align-items-center" @click="openComment = true">
      <i class="bi bi-chat-left"></i>
      <p>{{Total}}</p>
    </div>
    <div class="box-bi d-flex flex-column align-items-center">
      <i v-if="!isLike" class="bi bi-hand-thumbs-up" @click="likeArticle"></i>
      <i v-else class="bi bi-hand-thumbs-up-fill" @click="likeArticle"></i>
      <p>{{NoteList.likes}}</p>
    </div>
  </div>
  <div class="container">
    <button class="btn btn-link" @click="$router.go(-1)">
      <i class="bi bi-arrow-left"></i>
      返回
    </button>
    <h1>{{ NoteList.title }}</h1>
    <div class="time-box">
      <p>{{ NoteList.createTime }}</p>
      <p v-if="NoteList.upDateTime" style="text-align: right"> 于 {{ NoteList.upDateTime }} 修改 </p>
    </div>
    <div
      class="
        user-box
        w-auto
        mt-1
        d-flex
        align-items-center
        justify-content-around"
      @click="$router.push({path: '/user-info',query:{id:NoteList.userInfoId}})"
      >
      <el-avatar
        size="50"
        :src="NoteList.userAvatar"
      />
      <div>{{ NoteList.userName }}</div>
    </div>
    <hr>
    <div class="content" v-html="NoteList.content"></div>
  </div>
</div>
  <transition>
    <drawer
        v-if="openComment"
        :open="openComment"
        :list="CommentList"
        :note-id="noteId"
        @upClose="upClose"
        @getComment="getComment"
    />
  </transition>
</template>

<style scoped>

.v-enter-active,.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,.v-leave-to {
  opacity: 0;
}

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

.user-box {
  max-width: 8rem;
  cursor: pointer;
}

.content {
  width: auto;
  margin-top: 20px;
}

:deep(img) {
  width: 100%;
  height: auto;
  margin: 20px 0;
}

:deep(iframe) {
  width: 100%;
  aspect-ratio: 16 / 9; /* 设定宽高比为16:9 */
  max-height: 450px;
  margin: 20px 0;
}

.suspension-bar {
  width: 50px;
  height: 300px;
  position: fixed;
  top: 200px;
  left: 250px;
  .box-bi {
    width: 100%;
    height: 40px;
    cursor: pointer;
    p {
      font-size: .7rem;
    }
  }
}

@media (min-width: 1000px) {
  .container {
    width: 700px;
  }
}

@media (max-width: 800px) {
  .suspension-bar {
    display: none !important;
  }
}
</style>
