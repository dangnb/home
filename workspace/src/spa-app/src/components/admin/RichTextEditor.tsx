'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Image as ImageIcon,
  Link as LinkIcon,
  Code
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showSource, setShowSource] = useState(false);

  useEffect(() => {
    if (editorRef.current && !showSource) {
      if (editorRef.current.innerHTML !== (value || '')) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value, showSource]);

  const execCmd = (command: string, arg?: string) => {
    if (showSource) return;
    editorRef.current?.focus();
    document.execCommand(command, false, arg);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleImageUpload = () => {
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
          execCmd('insertImage', data.url);
        } else {
          alert('Upload ảnh thất bại');
        }
      } catch (err) {
        console.error('Upload error:', err);
      }
    };
  };

  const handleLink = () => {
    const url = prompt('Nhập đường dẫn (URL):');
    if (url) {
      execCmd('createLink', url);
    }
  };

  return (
    <div className="bg-white border border-gray-300 rounded-xl overflow-hidden">
      <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b border-gray-200">
        <button
          type="button"
          onClick={() => execCmd('bold')}
          className="p-2 hover:bg-gray-200 rounded-lg text-gray-700"
          title="In đậm"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execCmd('italic')}
          className="p-2 hover:bg-gray-200 rounded-lg text-gray-700"
          title="In nghiêng"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execCmd('underline')}
          className="p-2 hover:bg-gray-200 rounded-lg text-gray-700"
          title="Gạch chân"
        >
          <Underline className="w-4 h-4" />
        </button>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={() => execCmd('formatBlock', 'H2')}
          className="p-2 hover:bg-gray-200 rounded-lg text-gray-700"
          title="Tiêu đề H2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execCmd('formatBlock', 'H3')}
          className="p-2 hover:bg-gray-200 rounded-lg text-gray-700"
          title="Tiêu đề H3"
        >
          <Heading3 className="w-4 h-4" />
        </button>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={() => execCmd('insertUnorderedList')}
          className="p-2 hover:bg-gray-200 rounded-lg text-gray-700"
          title="Danh sách chấm"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execCmd('insertOrderedList')}
          className="p-2 hover:bg-gray-200 rounded-lg text-gray-700"
          title="Danh sách số"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={handleLink}
          className="p-2 hover:bg-gray-200 rounded-lg text-gray-700"
          title="Chèn liên kết"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleImageUpload}
          className="p-2 hover:bg-gray-200 rounded-lg text-gray-700"
          title="Tải ảnh lên"
        >
          <ImageIcon className="w-4 h-4" />
        </button>
        <div className="ml-auto">
          <button
            type="button"
            onClick={() => setShowSource(!showSource)}
            className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1 ${
              showSource ? 'bg-primary text-white' : 'hover:bg-gray-200 text-gray-700'
            }`}
            title="Xem mã HTML"
          >
            <Code className="w-4 h-4" /> HTML
          </button>
        </div>
      </div>

      {showSource ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-h-[220px] p-4 font-mono text-sm outline-none resize-y"
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
          className="min-h-[220px] p-4 outline-none prose max-w-none overflow-y-auto"
        />
      )}
    </div>
  );
}
