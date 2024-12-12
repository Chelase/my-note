<script setup>
import { ref, onMounted } from 'vue'
import MessageApi from '@/api/modules/Message.js'
import { HubConnectionBuilder } from '@microsoft/signalr'
import useUserStore from "@/stores/user.js"
import {storeToRefs} from "pinia"

const userStore = useUserStore()
const url = import.meta.env.VITE_APP_API_BASEURL
const { UserId } = storeToRefs(userStore)
const data = ref({
  userInfoId: UserId,
  msg: '',
})

const MsgList = ref([])

const connection = new HubConnectionBuilder()
    .withUrl(`${url}/MessageHub`)
    .build();

connection.start()
    .then(() => {
      // console.log('SignalR Connected');
    })
    .catch(err => console.error(err));

connection.on('ReceiveMessage', message => {
  MsgList.value.push(message)
  console.log('Received message:', message);
  message.createTime = message.createTime.slice(11)
  console.log(33,MsgList.value);
});

onMounted(() => getMsg())

async function getMsg() {
  const { list } = await MessageApi.getMessage()
  if (list)
    MsgList.value = list
  console.log(MsgList.value);
}

async function sendMsg () {
  if (data.value.msg) {
    await MessageApi.AddMessage(data.value)
    data.value.msg = ''
  }
}
</script>

<template>
  <div class="container">
    <div class="chat" v-for="item in MsgList" :key="item.id">
      <div class="chat-info d-flex" v-if="userStore.UserId !== item.userInfoId">
        <div class="w-10">
          <el-avatar :size="50" :src="item.userAvatar" />
        </div>
        <div class="w-auto">
            <span> &nbsp {{item.userName}} &nbsp </span>
          <time class="text-xs opacity-50">{{item.createTime}}</time>
          <div class="chat-bubble"> &nbsp {{item.msg}}</div>
        </div>
      </div>
      <div class="chat-info d-flex justify-content-end" v-else>
        <div class="w-auto">
          <time class="text-xs opacity-50">{{item.createTime}}</time>
          <span> &nbsp {{item.userName}} &nbsp </span>
          <div class="chat-bubble" style="text-align: right"> {{item.msg}} &nbsp</div>
        </div>
        <div class="w-10">
          <el-avatar :size="50" :src="item.userAvatar" />
        </div>
      </div>
    </div>
    <div class="bottom-input">
      <el-input
          v-model="data.msg"
          style="width: 240px;"
          placeholder="请输入"
      />
      <button class="btn btn-primary" @click="sendMsg()">发送</button>
    </div>
  </div>
</template>

<style scoped>
  .chat {
    display: flex;
    .chat-info {
      width: 100%;
    }
  }
  .bottom-input {
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
  }
</style>