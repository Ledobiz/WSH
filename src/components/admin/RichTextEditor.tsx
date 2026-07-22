'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { Editor } from '@tinymce/tinymce-react';
import { useEffect, useRef } from 'react';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    height?: number;
    placeholder?: string;
}

const RichTextEditor = ({ value, onChange, height = 300, placeholder }: RichTextEditorProps) => {
    const editorRef = useRef<any>(null);

    useEffect(() => {
        // Keep TinyMCE dialogs (link/image/etc.) usable inside Radix dialogs, which
        // otherwise trap focus and block typing in the editor's popups.
        const handleFocusIn = (e: any) => {
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
            onInit={(_evt, editor) => (editorRef.current = editor)}
            value={value}
            onEditorChange={onChange}
            init={{
                height,
                ui_mode: 'split',
                placeholder,
                plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'emoticons', 'wordcount', 'help',
                ],
                toolbar:
                    'undo redo | blocks fontfamily fontsize | bold italic forecolor underline strikethrough | link image media table | ' +
                    'align lineheight | bullist numlist outdent indent | emoticons charmap | removeformat code preview',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                setup: (editor: any) => {
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
    );
};

export default RichTextEditor;
