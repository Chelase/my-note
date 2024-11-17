import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'

import { ColorHighlighter } from './ColorHighlighter.js'
import { SmilieReplacer } from './SmilieReplacer.js'

const TipTapPlugin = {
    // 注册配置插件
    extensions: [StarterKit, Highlight, Typography, ColorHighlighter, SmilieReplacer],
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
        },
    },
}

export default TipTapPlugin