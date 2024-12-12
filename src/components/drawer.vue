<script setup>
import {ref} from 'vue'
import {ElMessage} from 'element-plus'

import commentApi from '@/api/modules/comment.js'
import publicApi from '@/api/modules/public.js'
import useUserStore from '@/stores/user.js'

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
    default: false
  },
  list: {
    type: Array,
    required: true,
    default: function () {
      return [];
    }
  },
  noteId: {
    type: Number,
    required: true,
    default: 0
  },
  isMask: {
    type: Boolean,
    default: false
  },
  direction: {
    type: String,
    default: 'left',
  }
})

const userStore = useUserStore()

const content = ref('')

const reviews = ref(['留下你精彩的评论吧','新的风暴已经出现、你的评论何时再现',
  '你猜我的评论区在等待谁？',])
const reviewsIndex = Math.floor(Math.random()*reviews.value.length)

const emit = defineEmits(['upClose','getComment'])

async function sendComment() {
  await commentApi.AddComment({noteId: props.noteId,userInfoId: userStore.UserId,content: content.value}).then(() => {
    ElMessage.success('发送成功')
    content.value = ''
  })
  emit('getComment')
}

async function likeComment(id) {
  await publicApi.likes({
    userInfoId: userStore.UserId,
    contentType: 'Comment',
    likeId: id
  })
  emit('getComment')
}

function close () {
  emit('upClose',false)
}
// TODO 评论点赞、编辑、回复
</script>

<template>
  <div class="drawer" >
    <div class="header">
      <div class="toolbar d-flex justify-content-end align-items-center">
        <div class="box-bi d-flex justify-content-center align-items-center" @click="close">
          <i class="bi bi-x"></i>
        </div>
      </div>
    </div>
    <div class="center row m-auto">
      <div class="comment" v-for="item in list" :key="item.id">
        <div class="comment-list">
          <div class="avatar d-flex align-items-end pb-1 ">
            <el-avatar :size="50" :src="item.userAvatar" />
            <div class="ms-2">{{ item.userName }}</div>
          </div>
          <div class="content p-l-17">
            {{item.content}}
          </div>
          <div class="content-bottom d-flex justify-content-around ">
            <div class="operation-box d-flex color-58">
              <div class="operation d-flex justify-content-around">
                <i v-if="item.likeStatus" class="bi bi-hand-thumbs-up-fill" @click="likeComment(item.id)"></i>
                <i v-else class="bi bi-hand-thumbs-up" @click="likeComment(item.id)"></i>
                {{ item.likes }}
              </div>
              <div class="operation d-flex justify-content-around">
                <i class="bi bi-chat me-1"></i>
                回复
              </div>
            </div>
            <div class="time color-58">{{item.createTime.substring(0,10)}}</div>
          </div>
          <div v-if="item.replyNum > 0" class="unfold p-l-17 color-58">
            —— 展开 {{ item.replyNum }} 条回复
          </div>
        </div>
        <div class="comment-child"></div>
      </div>
    </div>
    <div class="footer d-flex justify-content-center align-items-center">
      <div class="footer-input">
        <el-input
            v-model="content"
            style="width: 240px;"
            :placeholder="reviews[reviewsIndex]"
        />
        <button class="btn btn-primary" @click="sendComment">发送</button>
      </div>
    </div>
  </div>
</template>

<style scoped>

.border-red {
  border: 1px solid red;
  &.blue {
    border: 1px solid blue;
  }
  &.green {
    border: 1px solid green;
  }
  &.yellow {
    border: 1px solid yellow;
  }
}

.drawer {
  width: 27%;
  height: 100vh;
  background: #fff;
  position: fixed;
  top: 0;
  &.left {
    left: 0;
  }
  &.bottom {
    bottom: 0;
  }
  .header {
    width: 100%;
    height: 30px;
    .toolbar {
      .box-bi {
        width: 30px;
        height: 30px;
        .bi-x {
          transform: scale(1.45);
        }
      }
    }
  }
  .center {
    overflow-y: scroll;
    height: 100vh;
    .comment {
      width: 100%;
      position: relative;
      .comment-list {
        padding: 5px;
        .avatar {
          width: 100%;
        }
        .content {
          width: 100%;
          padding-top: 5px;
          padding-bottom: 5px;
        }
        .content-bottom {
          width: 100%;
          .operation-box {
            .operation {
              min-width: 40px;
            }
          }
          .time {}
        }
        .unfold {
          padding-top: 5px;
          padding-bottom: 5px;
        }
      }

      .comment:last-child {
        margin-bottom: 50px;
        border: 1px solid red;
      }

    }
  }
  .footer {
    width: 100%;
    height: 50px;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(11px);
    -webkit-backdrop-filter: blur(11px);
    border: 0.8px solid rgba(255, 255, 255, 0.18);
    color: rgba(255, 255, 255, 0.6);
    .footer-input {}
  }
}
</style>