<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

import useUserStore from '@/stores/user.js'
import userApi from '@/api/modules/user.js'
import publicApi from '@/api/modules/public.js'
import {ElMessage} from "element-plus";

const userStore = useUserStore()
const url = import.meta.env.VITE_APP_API_BASEURL

const { UserInfo } = storeToRefs(userStore)
const fileList = ref([])
const avatar = ref('')
const headers = ref({
      Authorization: "Bearer " + userStore.Token
    })

// const userInfoForm = ref({
//   userName: '',
//   userAvatar: '',
//   email: '',
//   gender: 0
// })

async function updateUserInfo() {
  await userApi.userEdit(UserInfo.value)
  await userStore.GetUserInfo(userStore.UserId)
  ElMessage.success('保存成功')
}

function updateAvatar(uploadFile) {
  console.log(uploadFile);
  avatar.value = uploadFile.data[0]
  UserInfo.value.avatar = avatar.value
}

const handleExceed = () => {
  fileList.value = []
}

function upload(param) {
  const formData = new FormData()
  formData.append('file', param.file)
  publicApi.uploadPhoto(formData).then(res => {
    updateAvatar(res)
  }).catch(error => {
    console.log(error);
  })
}

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
      <el-upload
          v-model:file-list="fileList"
          class="upload-demo"
          :action="url+'/Public/UploadPhoto'"
          :limit="1"
          name="file"
          :headers="headers"
          :show-file-list="false"
          :on-success="updateAvatar"
          :on-change="handleExceed"
      >
        <div class="avatar-box">
          <el-avatar
              style="cursor: pointer"
              v-if="avatar"
              :size="100"
              :src="avatar"
          />
          <el-avatar
              style="cursor: pointer"
              v-else
              :size="100"
              :src="UserInfo.avatar"
          />
          <i class="bi bi-camera"></i>
        </div>
      </el-upload>

<!--      <el-upload-->
<!--          class="avatar-uploader"-->
<!--          action="#"-->
<!--          :limit="1"-->
<!--          :show-file-list="false"-->
<!--          :http-request="handleUpload"-->
<!--          :before-upload="handleChange"-->
<!--          accept=".png,.jpe,.jpeg"-->
<!--          ref="uploadBanner"-->
<!--      >-->
<!--        <el-avatar-->
<!--            style="cursor: pointer"-->
<!--            v-if="userStore.isLogin"-->
<!--            :size="100"-->
<!--            :src="UserInfo.avatar"-->
<!--        />-->
<!--      </el-upload>-->

      <div class="">
        <span>{{UserInfo.userName}}</span> &nbsp
        <el-radio-group v-model="UserInfo.gender">
          <el-radio :value="1" size="large">男</el-radio>
          <el-radio :value="2" size="large">女</el-radio>
          <el-radio :value="3" size="large">沃尔玛购物袋</el-radio>
        </el-radio-group>
      </div>
      <div>
        邮箱：<el-input v-model="UserInfo.email" />
      </div>
    </div>

    <div class="button-box">
      <button class="btn btn-primary" @click="updateUserInfo">保存</button>
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
  .avatar-box {
    width: 100px;
    position: relative;
    .bi {
      position: absolute;
      right: 10px;
      bottom: 5px;
    }
  }
}
</style>