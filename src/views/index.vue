<script setup>
import {ref} from "vue";
import noteApi from '@/api/modules/note.js'
import {ElMessage, ElMessageBox} from "element-plus";
import useUserStore from '@/stores/user.js'

const userStore = useUserStore()

const NoteList = ref({})
const NoteForm = ref({
  id: 0,
  currentPage: 1,
  pageSize: 6
})

async function getNotes() {
  await noteApi.GetNote(NoteForm.value).then(res => {
    NoteList.value = res
  })
}

async function del(id) {
  ElMessageBox.confirm(
      '确定要删除吗？',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
  ).then(async () => {
        await noteApi.DelNote(id)
        ElMessage({
          type: 'success',
          message: '删除成功',
        })
        await getNotes()
      })
}

async function handleCurrentChange(currentPage) {
  NoteForm.value.currentPage = currentPage
  await getNotes()
}

getNotes()

</script>

<template>
  <div class="container py-4 px-3 border position-relative">
    <h1>尽情使用我的笔记!</h1>
    <div class="d-sm-flex justify-content-between">
      <button v-if="userStore.isLogin" class="btn btn-primary" @click="$router.push('/edit_note')">快速新建</button>
      <div>
        <button v-if="!userStore.isLogin" class="btn btn-primary" @click="$router.push('/login')">登录</button>
      </div>
    </div>
  </div>

  <div class="container my-4" v-if="NoteList.data">
    <div class="row">
      <div class="col-md-6" v-for="item in NoteList.data" :key="item.id" style="max-width: 540px;">
        <div class="card mb-3">
          <div class="row g-0" style="min-height: 128px">
            <div class="col-md-8">
              <div class="card-body">
                <h5 class="card-title" @click="$router.push({path:'/view_note',query: {id: item.id}})">{{ item.title }}</h5>
                <!-- <p class="card-text">{{ item.content }}</p> -->
                <p class="card-text"><small class="text-muted">{{ item.createTime.slice(0,10) }}</small></p>
                <div class="hidden-operation" v-if="userStore.UserId === item.userInfoId">
                  <button class="btn btn-outline-primary" @click="$router.push({path:'/edit_note',query: {id: item.id}})">
                    <i class="bi bi-pencil-square"></i>
                  </button>
                  <button class="btn btn-outline-danger" @click="del(item.id)">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="float-end">
      <el-pagination
          hide-on-single-page
          v-model:current-page="NoteForm.currentPage"
          v-model:page-size="NoteForm.pageSize"
          background
          layout="prev, pager, next, jumper"
          :total="NoteList.totalCount"
          @current-change="handleCurrentChange"
      />
    </div>
  </div>
  <el-empty v-else description="暂无内容" />
</template>

<style scoped>
.card {
  min-height: 110px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.card:hover .hidden-operation{
  right: 10px;
}

.hidden-operation {
  width: 100px;
  min-height: 110px;
  position: absolute;
  top: 10px;
  right: -100px;
  transition: all .5s;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

nav {
  position: fixed;
  right: 100px;
  bottom: 50px;
}

@media (min-width: 1400px) {
  .col-md-6:nth-child(odd) {
    margin-left: 120px;
  }
}

@media (max-width: 1400px) {
  .col-md-6:nth-child(odd) {
    margin-left: 30px;
  }
}

@media (max-width: 1200px) {
  .col-md-6:nth-child(odd) {
    margin-left: 0;
  }
  .hidden-operation {
    width: 100px;
    height: 25px;
    position: absolute;
    top: 40px;
    right: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  nav {
    position: static;
    ul {
      float: right;
    }
  }
}
</style>
