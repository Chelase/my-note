<script setup>
import {ref, onBeforeMount, onBeforeUnmount} from 'vue'
import TipTapPlugin from '@/utils/tiptap/index.js'
import {useEditor, EditorContent, BubbleMenu, FloatingMenu} from '@tiptap/vue-3'
import publicApi from "@/api/modules/public.js";
import router from "@/router/index.js";
import noteApi from "@/api/modules/note.js";
import {ElMessage} from "element-plus";
import useUserStore from "@/stores/user.js";


const article = ref({
  cover: '',
  title: '',
  content: '',
})
const editor = useEditor(TipTapPlugin)
const userStore = useUserStore()
// const noteId = router.currentRoute.value.query.id

// async function editNote() {
//   if (noteId) {
//     await noteApi.GetNote({id: noteId}).then(res => {
//       NoteContent.value = res.note
//     })
//   }
// }

function uploadCover() {
  const fileInput = document.getElementById('fileInput');
  fileInput.click();

  // 监听文件选择事件
  fileInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    const formData = new FormData()
    formData.append('file', file)
    publicApi.uploadPhoto(formData).then(res => {
      if (res.data) {
        article.value.cover = res.data[0]
      }
    }).catch(error => {
      console.log(error);
    })
  }, { once: true }); // 使用 { once: true } 确保事件监听器只触发一次
}

function insertVideo() {
  let url = prompt('请输入视频链接', '')
  const videoId = extractVideoId(url); // 提取视频 ID 的函数
  const embedUrl = `https://www.youtube.com/embed/${videoId}`; // YouTube 嵌入链接

  editor.chain().focus().setVideoEmbed({ src: embedUrl }).run();
}

// 提取视频 ID 的简单示例
function extractVideoId(url) {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^&\n]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}


function addImage() {
  const fileInput = document.getElementById('fileInput');
  fileInput.click();

  // 监听文件选择事件
  fileInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    const formData = new FormData()
    formData.append('file', file)
    publicApi.uploadPhoto(formData).then(res => {
      if (res.data) {
        editor.value.chain().focus().setImage({ src: res.data[0] }).run()
      }
    }).catch(error => {
      console.log(error);
    })
    // 转成base64
    // if (file) {
    //   const reader = new FileReader();
    //
    //   reader.onload = function(e) {
    //     const base64String = e.target.result;
    //     console.log(base64String);
    //   }
    //
    //   reader.readAsDataURL(file);
    // }
  }, { once: true }); // 使用 { once: true } 确保事件监听器只触发一次
}

async function saveNote () {
  console.log(editor.value.getHTML());
  if (article.value.title === '')
    ElMessage.error('标题为空')
  else {
    article.value.content = editor.value.getHTML()
    article.value.userInfoId = userStore.UserId
    await noteApi.AddNote(article.value).then( () => {
      ElMessage.success('保存成功')
      router.back()
    })
  }
}

onBeforeUnmount(() => {
  editor.value.destroy();
})

</script>

<template>
  <input type="file" id="fileInput" style="display: none;" accept="image/*">
  <div class="container">
    <button class="btn btn-link" @click="$router.back()">
      <i class="bi bi-arrow-left"></i>
      返回
    </button>
    <div class="title d-flex justify-content-between align-items-end">
      <div class="cover-photo">
        <img v-if="article.cover" :src="article.cover" alt="">
        <div
            v-else
            class="is-cover d-flex justify-content-center align-items-center"
            @click="uploadCover"
        >上传封面</div>
      </div>
      <button class="btn btn-success" @click="saveNote" style="min-height: 40px;">保存</button>
    </div>

    <div class="w-100 d-flex justify-content-between align-items-end">
      <textarea rows="4" cols="50" type="text" v-model="article.title" placeholder="请输入标题..." minlength="1" maxlength="50"></textarea>
      <div>{{article.title.length}}/50</div>
    </div>

    <div class="editor">
      <editor-content :editor="editor" />
    </div>

    <div v-if="editor">
      <bubble-menu
          class="bubble-menu"
          :tippy-options="{ duration: 100 }"
          :editor="editor"
      >
        <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">
          加粗
        </button>
        <button @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }">
          斜体
        </button>
        <button @click="editor.chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }">
          删除线
        </button>
        <button @click="addImage">上传图片</button>
        <button @click="insertVideo()">插入网络视频</button>
      </bubble-menu>

      <floating-menu
          class="floating-menu"
          :tippy-options="{ duration: 100 }"
          :editor="editor"
      >
        <button @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }">
          1级标题
        </button>
        <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }">
          2级标题
        </button>
        <button @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }">
          无序列表
        </button>
        <button @click="addImage">上传图片</button>
        <button @click="insertVideo()">插入网络视频</button>
      </floating-menu>
    </div>

<!--    <ElButton @click="testHtml">测试HTML</ElButton>-->
  </div>

</template>

<style scoped lang="scss">

.title {
  min-height: 150px;
  padding-bottom: 10px;
  margin-bottom: 30px;
  border-bottom: 1px solid #ccc;
  color: #585858;

  .cover-photo {
    width: 100px;
    min-height: 100px;

    img {
      width: 100px;
      height: 100px;
    }

    .is-cover {
      width: 100px;
      height: 100px;
      cursor: pointer;
      border: 1px solid #cccccc;
    }

  }
}

textarea {
  width: 97%;
  max-height: 90px;
  border: none;
  outline: none;
  background: none;
  font-size: 28px;
  font-weight: bold;
  resize: none;
}

.tiptap {
  :first-child {
    margin-top: 0;
  }

  /* Code and preformatted text styles */
  code {
    background-color: var(--purple-light);
    border-radius: 0.4rem;
    color: var(--black);
    font-size: 0.85rem;
    padding: 0.25em 0.3em;
  }

  /* Color swatches */
  .color {
    white-space: nowrap;

    &::before {
      background-color: var(--color);
      border: 1px solid rgba(128, 128, 128, 0.3);
      border-radius: 2px;
      content: " ";
      display: inline-block;
      height: 1em;
      margin-bottom: 0.15em;
      margin-right: 0.1em;
      vertical-align: middle;
      width: 1em;
    }
  }
}

</style>