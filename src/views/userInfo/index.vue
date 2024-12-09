<script setup>
import { ref } from 'vue'

import useUserStore from '@/stores/user.js'
import userApi from '@/api/modules/user.js'
import router from "@/router/index.js"

const userStore = useUserStore()

const userId = Number(router.currentRoute.value.query.id) || userStore.UserId

const UserInfo = ref({})

async function getUserInfo() {
  const { userInfo } = await userApi.userInfo(userId)
  UserInfo.value = userInfo
}

getUserInfo()

</script>

<template>
  <div class="container">
    <button class="btn btn-link" @click="$router.go(-1)">
      <i class="bi bi-arrow-left"></i>
      返回
    </button>

<!--      <div class="cover-img">-->
<!--        <img src="https://bing.img.run/1920x1080.php" alt="">-->
<!--      </div>-->

    <div class="top w-100">
      <div>
        <el-image
            style="width: 100px; height: 100px;border-radius: 50%"
            :src="UserInfo.avatar"
            :zoom-rate="1.2"
            :max-scale="7"
            :min-scale="0.2"
            :preview-src-list="[UserInfo.avatar]"
            :initial-index="4"
            fit="cover"
        />
      </div>
      <div class="">
        <span>{{UserInfo.userName}}</span> &nbsp
        <span>{{UserInfo.gender === 0 ? '未知性别' : UserInfo.gender === 1 ? '男' : '女'}}</span>
      </div>
      <div>
        邮箱：{{UserInfo.email ? UserInfo.email : '暂无'}}
      </div>
      <div>
        访问量： {{UserInfo.pageViews}}
      </div>
      <div>
        注册时间：{{UserInfo.createdAt.slice(0,10)}}
      </div>
    </div>

    <div class="button-box" v-if="UserInfo.userId === userStore.UserId">
      <button class="btn btn-primary" @click="$router.push('/user-edit')">编辑</button>
    </div>

  </div>
</template>

<style scoped>
  .cover-img {
    width: 100%;
    max-height: 300px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .top {

  }
</style>