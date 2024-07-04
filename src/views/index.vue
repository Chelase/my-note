<script setup>
import {useNoteStore} from "@/stores/note.js"
import {storeToRefs} from "pinia";
import {ref} from "vue";
import noteApi from '@/api/modules/note.js'
import Message from "vue-m-message"

const noteStore = useNoteStore()
const NoteList = ref([])
const noteId = ref('')

async function getNotes() {
  await noteStore.getNoteList(0)
  const { NoteData } = storeToRefs(noteStore)
  NoteList.value = NoteData.value
}

async function del(id) {
  await noteApi.DelNote(id)
  Message.success('删除成功')
  await getNotes()
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
      <div class="col-md-6" v-for="item in NoteList" :key="item.id" style="max-width: 540px;">
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

@media (min-width: 1400px) {
  .col-md-6:nth-child(odd) {
    margin-left: 120px;
  }
}

@media (max-width: 1200px) {
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
}
</style>