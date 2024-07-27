import { ref } from 'vue'
import { defineStore } from 'pinia'
import noteApi from '@/api/modules/note.js'

export const useNoteStore = defineStore('note', () => {
  const NoteData = ref({})

  const getNoteList = async (id, page, size) => {
    NoteData.value = await noteApi.GetNote({id, page, size})
  }

  const addNoteList = async (data) => {
    await noteApi.AddNote(data)
  }

  return {
    NoteData,
    getNoteList,
    addNoteList
  }
})
