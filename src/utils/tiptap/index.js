import {VueNodeViewRenderer} from "@tiptap/vue-3";
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import Image from '@tiptap/extension-image'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Youtube from '@tiptap/extension-youtube'

import CodeBlockComponent from '@/components/CodeBlockComponent.vue'
import VideoEmbed from './modules/web-video.js'
import Iframe from './modules/iframe.js'
import { all, createLowlight } from 'lowlight'

const lowlight = createLowlight(all)

export const TipTapPlugin = {
    // 注册配置插件
    extensions: [
        StarterKit.configure({
            codeBlock: false, // 禁用 StarterKit 中的 codeBlock
        }),
        Highlight,
        Typography,
        Image,
        CodeBlockLowlight
            .extend({
                addNodeView() {
                    return VueNodeViewRenderer(CodeBlockComponent)
                },
            })
            .configure({ lowlight }),
        Youtube.configure({
            controls: false,
            nocookie: true,
        }),
        VideoEmbed,
        Iframe,
    ],
    // 设置初始内容
    content: '<p>I’m running Tiptap with Vue.js. 🎉</p>',
    // 初始化后将光标放置在编辑器中
    autofocus: 'end',
    // 使文本可编辑
    editable: true,
    // 是否禁用默认css的加载
    injectCSS: true,
    // 粘贴规则
    enablePasteRules: true,

    editorProps: {
        attributes: {
            spellcheck: false,
            attributes: {
                class:
                    "",
            },
        },
    },
}

// export const addYoutube = (editor) => {
//     const url = prompt('请输入youtube视频链接')
//
//     editor.commands.setYoutubeVideo({
//         src: url,
//         width: Math.max(320, parseInt(this.width, 10)) || 640,
//         height: Math.max(180, parseInt(this.height, 10)) || 480,
//     })
// }