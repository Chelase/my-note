import { ref } from 'vue'
import { defineStore } from 'pinia'
import noteApi from '@/api/modules/note.js'

export const useNoteStore = defineStore('note', () => {
  const NoteData = ref({})

  const getNoteList = async (id) => {
    const { list } = await noteApi.GetNote({id})
    NoteData.value = list
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
