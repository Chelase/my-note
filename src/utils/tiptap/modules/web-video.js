import { Node, mergeAttributes } from '@tiptap/core';

const VideoEmbed = Node.create({
    name: 'videoEmbed',

    inline: true,
    group: 'inline',
    selectable: false,

    addAttributes() {
        return {
            src: {
                default: null,
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'iframe[src]',
            },
        ];
    },

    renderHTML({ node, HTMLAttributes }) {
        return ['iframe', mergeAttributes({ src: node.attrs.src, frameborder: '0', allowfullscreen: true }, HTMLAttributes)];
    },

});

export default VideoEmbed