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
}

function consoleFile() {
  console.log(fileList.value);
}

function uploadAvatar() {
  console.log(fileList.value)
}

// 上传
const handleChange = (rawFile) => {
  if (rawFile.type !== "image/jpeg" && rawFile.type !== "image/png") {
    ElMessage.error("只能上传jpeg/jpg/png图片");
    return false;
  } else if (rawFile.size / 1024 / 1024 > 1) {
    ElMessage.error("上传图片最大不超过1MB!");
    return false;
  }
  return true;
};
const handleUpload = async (file) => {
  let fd = new FormData();
  fd.append("file", file.file);
  // 这里是请求上传接口
  let result = await publicApi.uploadPhoto(fd);

  console.log(57,result);
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
<!--      <el-upload-->
<!--          v-model:file-list="fileList"-->
<!--          class="upload-demo"-->
<!--          :action="url+'/Public/UploadPhoto'"-->
<!--          :limit="1"-->
<!--          :headers="headers"-->
<!--          :show-file-list="false"-->
<!--          @on-success="consoleFile"-->
<!--      >-->
<!--        <div class="avatar-box">-->
<!--          <el-avatar-->
<!--              style="cursor: pointer"-->
<!--              v-if="userStore.isLogin"-->
<!--              :size="100"-->
<!--              :src="UserInfo.avatar"-->
<!--          />-->
<!--          <i class="bi bi-camera"></i>-->
<!--        </div>-->
<!--      </el-upload>-->

      <el-upload
          class="avatar-uploader"
          action="#"
          :limit="1"
          :show-file-list="false"
          :http-request="handleUpload"
          :before-upload="handleChange"
          accept=".png,.jpe,.jpeg"
          ref="uploadBanner"
      >
        <el-avatar
            style="cursor: pointer"
            v-if="userStore.isLogin"
            :size="100"
            :src="UserInfo.avatar"
        />
      </el-upload>

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