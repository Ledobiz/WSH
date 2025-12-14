'use client';

import { useRef } from "react";
import { Editor } from '@tinymce/tinymce-react';

interface TextEditorProps {
    value: string
    onChange: (value: string) => void
    height?: number
}

const TextEditor = ({value, onChange, height = 500}: TextEditorProps) => {
    const editorRef = useRef(null);

    return (
        <Editor
            apiKey={process.env.NEXT_PUBLIC_TINYMCE_KEY}
            value={value}
            onEditorChange={onChange}
            //onInit={ (_evt, editor) => editorRef.current = editor }
            init={{
                height: 300,
                menubar: false,
                plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount',
                    'codesample', 'emoticons'
                ],
                toolbar: 'undo redo | blocks fontfamily fontsize | ' +
                    'bold italic forecolor underline strikethrough | link image media table | alignleft aligncenter ' +
                    'align lineheight | bullist numlist outdent indent | emoticons charmap | ' +
                    'removeformat | code preview',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
            }}
        />
    )
}
export default TextEditor