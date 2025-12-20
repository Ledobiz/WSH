'use client';

import { Editor } from '@tinymce/tinymce-react';

interface TextEditorProps {
    value: string
    onChange: (value: string) => void
    height?: number
}

const TextEditor = ({value, onChange, height = 500}: TextEditorProps) => {
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
                toolbar: 'bold italic forecolor underline strikethrough | link image media table | alignleft aligncenter ' +
                    'bullist numlist outdent indent | emoticons charmap | ' +
                    'align lineheight | code preview | blocks fontfamily fontsize | ' +
                    'undo redo removeformat',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
            }}
        />
    )
}
export default TextEditor