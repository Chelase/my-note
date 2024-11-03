<script setup>
import userApi from '@/api/modules/user.js'
import useUserStore from '@/stores/user.js'
import {ElMessage} from 'element-plus'
import router from "@/router/index.js"

import { ref } from 'vue'

const userStore = useUserStore()

const isRegister = ref(false)


// 登录
const LoginForm = ref({
  userName: '',
  password: ''
})

const LoginFormRef = ref()

const LoginRules = ref({
  userName: [
    { required: true, message: '请填写用户名', trigger: 'blur' },
    { min: 1, max: 50, message: '长度必须在1~50个字符之间', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 18, message: '长度必须在6~18个字符之间', trigger: 'blur' },
  ]
})


// 注册
const RegisterForm = ref({
  userName: '',
  password: '',
  ConfirmPassword: ''
})

const RegisterFormRef = ref()

const RegisterRules = ref({
  userName: [
    { required: true, message: '请填写用户名', trigger: 'blur' },
    { min: 1, max: 50, message: '长度必须在1~50个字符之间', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 18, message: '长度必须在6~18个字符之间', trigger: 'blur' },
  ],
  ConfirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { min: 6, max: 18, message: '长度必须在6~18个字符之间', trigger: 'blur' },
    { validator: validatePassword, trigger: 'blur' }
  ],
});

// 密码验证函数
function validatePassword(rule, value, callback) {
  if (value === '') {
    callback(new Error('请确认密码'));
  } else if (RegisterForm.value.password !== value) {
    callback(new Error('密码不一致'));
  } else {
    callback();
  }
}


function go2register() {
  isRegister.value = !isRegister.value
  if (isRegister.value) {
    RegisterFormRef.value?.resetFields();
    RegisterForm.value = { userName: '', password: '', ConfirmPassword: '' };
  } else {
    LoginFormRef.value?.resetFields();
    LoginForm.value = { userName: '', password: '' };
  }
}

// 登录方法
function login() {
  LoginFormRef.value && LoginFormRef.value?.validate(async (valid) => {
    if (valid) {
      await userStore.Login(LoginForm.value)
      ElMessage.success('登录成功')
      await router.push('/')
    }
  })
}

// 注册方法
function register() {
  RegisterFormRef.value && RegisterFormRef.value?.validate(async (valid) => {
    if (valid) {
      await userApi.userRegister(RegisterForm.value).then((between) => {
        ElMessage.success(between.msg)
        isRegister.value = false
        RegisterFormRef.value.resetFields()
      }).catch((error) => {
        console.log(error)
      })
    }
  })
}

</script>

<template>
  <div class="container">
    <div class="box">
      <div class="LeftInfo">
        <!--标题-->
        <div class="title">
          <h2> <strong> {{isRegister? '加入我们' : '欢迎回来'}} </strong> </h2>
          <p> {{isRegister? 'Join us' : 'welcome back'}} </p>
        </div>

        <!--表单-->
        <div class="inputBox">
          <el-form
              v-if="!isRegister"
              ref="LoginFormRef"
              :model="LoginForm"
              :rules="LoginRules"
          >
            <el-form-item prop="userName">
              <el-input
                  placeholder="用户名"
                  maxlength="50"
                  clearable
                  v-model="LoginForm.userName"
                  style="margin-top: 20px"
              />
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                  type="password"
                  placeholder="密码"
                  maxlength="18"
                  v-model="LoginForm.password"
                  show-password
                  style="margin-top: 15px;"
              />
            </el-form-item>
          </el-form>
          <el-form
              v-else
              ref="RegisterFormRef"
              :model="RegisterForm"
              :rules="RegisterRules"
          >
            <el-form-item prop="userName">
              <el-input
                  placeholder="用户名"
                  maxlength="50"
                  v-model="RegisterForm.userName"
                  clearable
                  style="margin-top: 20px"
              />
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                  type="password"
                  placeholder="密码"
                  maxlength="18"
                  v-model="RegisterForm.password"
                  show-password
                  style="margin-top: 15px;"
              />
            </el-form-item>

            <el-form-item prop="ConfirmPassword">
              <el-input
                  type="password"
                  placeholder="确认密码"
                  maxlength="18"
                  v-model="RegisterForm.ConfirmPassword"
                  show-password
                  style="margin-top: 15px;"
              />
            </el-form-item>
          </el-form>
        </div>

        <div class="ButtonBox">
          <button v-if="!isRegister" @click="login" class="css-button css-button-shadow-border--sky">
            登录
          </button>
          <button v-else @click="register" class="css-button css-button-shadow-border--sky">
            注册
          </button>
          <router-link v-if="!isRegister" to="/">
            <button class="css-button css-button-shadow-border--green"> 返回首页 </button>
          </router-link>
          <button v-else @click="go2register" class="css-button css-button-shadow-border--green"> 返回登录 </button>
        </div>

        <div v-if="!isRegister" class="span-content">
          <a @click="go2register" href="#" class="ForgotPassword"> 去注册 </a>
        </div>
      </div>
      <div class="RightPhoto">
        <img src="@/assets/image/mesh-47.png" class="img-fluid rounded-4" alt="...">
      </div>
      <div class="bottom"> <a href="https://beian.miit.gov.cn/" target="_blank">鲁ICP备2024104791号-1</a></div>
    </div>
  </div>
</template>

<style scoped>
*{
  margin: 0;
  padding: 0;
}

input {
  border: none;
}

.box {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0; left: 0; bottom: 0; right: 0;
  margin: auto;
}

.LeftInfo {
  width: 360px;
  height: 380px;
  padding: 20px;
  background-color: rgba(255,255,255,.05);
  backdrop-filter: blur(70px);
  border-radius: 20px;
  box-shadow: rgba(0,0,0,.2) 10px 10px 20px;
  margin-right: -100px;
  z-index: 2;

  .title{
    width: 140px;
    height: 60px;

    p {
      font-size: 12px;
      font-weight: bold;
    }
  }

  :deep(.el-input__wrapper)  {
    width: 300px;
    height: 40px;
    text-indent:10px;
    background-color: rgba(255,255,255,.2);
  }

  .ButtonBox {
    width: 100%;
    height: 80px;
    margin: 20px auto auto auto;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .span-content{
    float: right;
    margin: 30px 10px;
    font-size: 13px;
    color: #002FA7;
  }

  .ForgotPassword{
    color: white;
    margin-top: -3px;
    font-size: 13px;
  }

}

.RightPhoto{
  max-width: 800px;
  height: auto;

  img {
    box-shadow:  9px 9px 10px #cfd1d4,
    -9px -9px 10px #ffffff;
    -webkit-user-drag: none;
  }
}

.bottom {
  position: fixed;
  bottom: 20px;
  font-size: 14px;
  a {
    color: grey;
  }
}

@media (max-width: 1000px) {
  .LeftInfo {
    margin-right: -200px;
  }
}

@media (max-width: 800px) {
  .box {
    flex-direction: column-reverse;
  }
  .LeftInfo {
    margin: -200px 0 0 0;
    background: white;
    .span-content a {
      color: #409eff;
    }
  }
  .RightPhoto{
    display: none;
  }
}
</style>
