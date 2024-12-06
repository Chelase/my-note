<script setup>
import {ref} from 'vue'
import {ElMessage} from 'element-plus'

import commentApi from '@/api/modules/comment.js'
import useUserStore from '@/stores/user.js'

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
    default: false
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

const list = ref([])
const total = ref(0)
const content = ref('')

const reviews = ref(['留下你精彩的评论吧','新的风暴已经出现、你的评论何时再现'])
const reviewsIndex = Math.floor(Math.random()*reviews.value.length)

// content.value = reviews.value[reviewsIndex]

async function sendComment() {
  await commentApi.AddComment({noteId: props.noteId,userInfoId: userStore.UserId,content: content.value}).then(() => {
    ElMessage.success('发送成功')
    content.value = ''
  })
  await getComment()
}

async function getComment() {
  const {data, totalCount} = await commentApi.GetComment({id:props.noteId})
  list.value = data
  total.value = totalCount
}

getComment()

const emit = defineEmits(['upClose'])

function close () {
  emit('upClose',false)
}

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
    <div class="row m-auto">
      <div class="comment" v-for="item in list" :key="item.id">
        <div class="comment-list">
          <div class="avatar d-flex align-items-end pb-1 ">
            <el-avatar :size="50" :src="item.userAvatar" />
            <div class="ms-2">{{ item.userName }}</div>
          </div>
          <div class="content p-l-17">
            {{item.content}}
          </div>
          <div class="content-bottom d-flex p-l-17">
            <div class="operation-box d-flex color-58">
              <div class="operation">
                <i class="bi bi-hand-thumbs-up"></i>
                <i v-if="false" class="bi bi-hand-thumbs-up-fill"></i>
                {{ item.likes }}
              </div>
              <div class="operation">
                <i class="bi bi-chat"></i>
              </div>
            </div>
            <div class="time color-58">{{item.createTime.substring(0,10)}}</div>
          </div>
          <div class="unfold p-l-17 color-58">
            —— 展开 {{ item.replyNum }} 条回复
          </div>
        </div>
        <div class="comment-child"></div>
      </div>
    </div>
    <div class="footer d-flex justify-content-center">
      <el-input
          v-model="content"
          style="width: 240px"
          :placeholder="reviews[reviewsIndex]"
      />
      <button class="btn btn-primary" @click="sendComment">发送</button>
    </div>
  </div>
</template>

<style scoped>

.p-l-17 {
  padding-left: 17%;
}

.color-58 {
  color: #585858;
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
    .toolbar {
      .box-bi {
        width: 20px;
        height: 20px;
        cursor: pointer;
      }
    }
  }
  .comment {
    width: 100%;
    position: relative;
    .comment-list {
      .avatar {
        width: 100%;
      }
      .content {
        width: 100%;
      }
      .content-bottom {
        width: 100%;
        .operation-box {
          flex: 3;
          .operation {
          }
        }
        .time {
          flex: 7;
        }
      }
      .unfold {

      }
    }

  }

}
</style>