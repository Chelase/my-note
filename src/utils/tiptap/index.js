import {VueNodeViewRenderer} from "@tiptap/vue-3";
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import Image from '@tiptap/extension-image'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'

import CodeBlockComponent from '@/components/CodeBlockComponent.vue'
import VideoEmbed from './modules/web-video.js'
import { all, createLowlight } from 'lowlight'

const lowlight = createLowlight(all)

const TipTapPlugin = {
    // 注册配置插件
    extensions: [
        StarterKit,
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
        VideoEmbed,
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

export default TipTapPlugin