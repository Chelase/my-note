<script setup>
import {useNoteStore} from "@/stores/note.js"
import {storeToRefs} from "pinia";
import {ref} from "vue";
import noteApi from '@/api/modules/note.js'
import Message from "vue-m-message"

const noteStore = useNoteStore()
const NoteList = ref([])
const noteId = ref('')

async function getNotes(page = 1) {
  await noteStore.getNoteList(0,page,6)
  const { NoteData } = storeToRefs(noteStore)
  NoteList.value = NoteData.value
  console.log(NoteList.value);
}

async function del(id) {
  await noteApi.DelNote(id)
  Message.success('删除成功')
  await getNotes()
}

async function pagination(page = 1) {
  if(page <= 1) {
    page = 1
    Message.info('已经是第一页')
    return false
  }
  if(page >= NoteList.value.currentPage) {
    page = NoteList.value.currentPage
    Message.info('已经是最后一页')
    return false
  }
  await getNotes(page)
}

getNotes()

</script>

<template>
  <div class="container py-4 px-3 border">
    <h1>尽情使用我的笔记!</h1>
    <button class="btn btn-primary" @click="$router.push('/edit_note')">快速新建</button>
  </div>

  <div class="container my-4">
    <div class="row">
      <div class="col-md-6" v-for="item in NoteList.data" :key="item.id" style="max-width: 540px;">
        <div class="card mb-3">
          <div class="row g-0" style="min-height: 128px">
            <div class="col-md-8">
              <div class="card-body">
                <h5 class="card-title" @click="$router.push({path:'/view_note',query: {id: item.id}})">{{ item.title }}</h5>
                <!-- <p class="card-text">{{ item.content }}</p> -->
                <p class="card-text"><small class="text-muted">{{ item.createTime.slice(0,10) }}</small></p>
                <div class="hidden-operation">
                  <button type="button" class="btn btn-outline-primary" @click="$router.push({path:'/edit_note',query: {id: item.id}})">
                    <i class="bi bi-pencil-square"></i>
                  </button>
                  <button type="button" class="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#exampleModal" @click="noteId = item.id">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <nav aria-label="Page navigation example">
      <ul class="pagination">
        <li class="page-item">
          <a class="page-link" href="#" aria-label="上一页" @click="pagination(NoteList.currentPage--)">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <li class="page-item" v-for="page in NoteList.totalPages" :key="page" @click="pagination(page)"><a class="page-link" href="#">{{page}}</a></li>
        <li class="page-item" @click="pagination(NoteList.currentPage++)">
          <a class="page-link" href="#" aria-label="下一页">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
    <a href="https://beian.miit.gov.cn/" target="_blank" class="ICPRecordNumber">鲁ICP备2024104791号-1</a>
  </div>

  <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">确定删除该笔记吗？</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="del(noteId)">确认删除</button>
        </div>
      </div>
    </div>
  </div>
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

.ICPRecordNumber {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translate(-50%);
  text-decoration: none;
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