<script setup>
import {ref, onMounted, onBeforeUnmount} from 'vue'
import { TipTapPlugin } from '@/utils/tiptap/index.js'
import {useEditor, EditorContent, BubbleMenu, FloatingMenu} from '@tiptap/vue-3'
import publicApi from "@/api/modules/public.js";
import otherApi from '@/api/modules/other.js'
import router from "@/router/index.js";
import noteApi from "@/api/modules/note.js";
import {ElMessage} from "element-plus";
import useUserStore from "@/stores/user.js";
import {emitter} from "@/utils/emitter.js";


const article = ref({
  cover: '',
  title: '',
  content: '',
})
const editor = useEditor(TipTapPlugin)
const userStore = useUserStore()
const width = ref(640)
const height = ref(480)
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

const addYoutube = () => {
  const url = prompt('请输入youtube视频链接')

  editor.value.commands.setYoutubeVideo({
    src: url,
    width: Math.max(320, parseInt(width.value, 10)) || 640,
    height: Math.max(180, parseInt(height.value, 10)) || 480,
    margin: 'auto'
  })
}

const addBilibili = () => {
  const url = prompt('请输入bilibili视频链接')
  const bvid = url.match(/video\/([^/]+)/)[1]; // 提取 Bilibili 视频 ID

  editor.value.commands.insertContent({
    type: 'video',
    attrs: {
      src: `https://player.bilibili.com/player.html?bvid=${bvid}`, // 生成嵌入链接
      width: 640,
      height: 360,
      bvid: bvid, // 存储 Bilibili 视频 ID
    },
  });
}

const addTiktok = async () => {
  const url = prompt('请输入抖音视频链接')
  const vid = url.match(/douyin.com\/video\/([^/]+)/)[1];
  const { data: { iframe_code } } = await otherApi.getTiktokVideo(vid)
  console.log(iframe_code);
}

const addWeb = () => {
  const url = prompt('请输入网站地址')
  editor.value.commands.insertContent({
    type: 'iframe',
    attrs: {
      src: url,
      width: 640,
      height: 360,
      frameborder: '0',
      allowfullscreen: 'true',
    },
  });
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

onMounted(() => {
  emitter.on('trigger-add-image', addImage)
  emitter.on('trigger-add-bilibili', addBilibili)
  emitter.on('trigger-add-youtube', addYoutube)
  emitter.on('trigger-add-tiktok', addTiktok)
})

onBeforeUnmount(() => {
  emitter.off('trigger-add-image', addImage)
  emitter.off('trigger-add-bilibili', addBilibili)
  emitter.off('trigger-add-youtube', addYoutube)
  emitter.off('trigger-add-tiktok', addTiktok)
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
      <insert-menu />
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
        <button id="youtube" @click="addYoutube()">
          嵌入youtube视频
        </button>
        <button id="bilibili" @click="addBilibili()">
          嵌入bilibili视频
        </button>
        <button id="tiktok" @click="addTiktok()">
          嵌入抖音视频
        </button>
        <button id="web" @click="addWeb()">
          嵌入网站
        </button>
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