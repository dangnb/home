'use client';

import dynamic from 'next/dynamic';
import { useMemo, useRef } from 'react';
import 'react-quill-new/dist/quill.snow.css';

// Fix for React 19: Use react-quill-new if possible, or just standard react-quill
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const quillRef = useRef<any>(null);

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files ? input.files[0] : null;
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        
        if (data.success) {
          const quill = quillRef.current?.getEditor();
          if (quill) {
            const range = quill.getSelection(true);
            quill.insertEmbed(range.index, 'image', data.url);
          }
        } else {
          alert('Upload failed');
        }
      } catch (err) {
        console.error('Upload error:', err);
      }
    };
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ align: [] }],
        ['link', 'image', 'video'],
        ['clean'],
      ],
      handlers: {
        image: imageHandler,
      },
    },
  }), []);

  return (
    <div className="bg-white">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        className="h-64 mb-12"
      />
    </div>
  );
}
