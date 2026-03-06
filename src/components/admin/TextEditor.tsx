'use client';

import { Editor } from '@tinymce/tinymce-react';
import { useEffect, useRef } from 'react';

interface TextEditorProps {
    value: string
    onChange: (value: string) => void
    height?: number
}

const TextEditor = ({value, onChange, height = 500}: TextEditorProps) => {
    const editorRef = useRef(null);

    useEffect(() => {
        const handleFocusIn = (e) => {
            // Check if the focus target is a TinyMCE dialog
            if (e.target.closest(".tox-tinymce-aux, .moxman-window, .tam-assetmanager-root")) {
                e.stopImmediatePropagation();
            }
        };

        document.addEventListener('focusin', handleFocusIn);
        return () => document.removeEventListener('focusin', handleFocusIn);
    }, []);

    return (
        <Editor
            apiKey={process.env.NEXT_PUBLIC_TINYMCE_KEY}
            onInit={ (_evt, editor) => editorRef.current = editor }
            value={value}
            onEditorChange={onChange}
            init={{
                height: 300,
                ui_mode: 'split',
                // menubar: false,
                plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'emoticons', 'wordcount', 'help',
                ],
                // toolbar: 'undo redo | styles | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | preview image media emoticons | forecolor backcolor',
                toolbar: 'undo redo | blocks fontfamily fontsize | bold italic forecolor underline strikethrough | link image media table | ' +
                    'align lineheight | bullist numlist outdent indent | emoticons charmap | removeformat code preview',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                setup: (editor) => {
                    editor.on('PostRender', () => {
                        const container = editor.getContainer();
                        const uiContainer = document.querySelector('.tox.tox-tinymce-aux');
                        if (container && uiContainer) {
                        container.parentNode.appendChild(uiContainer);
                        }
                    });
                },
            }}
        />
    )
}
export default TextEditor