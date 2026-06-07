import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import {
  Bold, Italic, List, ListOrdered, Quote, Code, Heading1, Heading2,
  AlignLeft, AlignCenter, AlignRight, Link as LinkIcon, ImageIcon, Undo, Redo,
} from 'lucide-react';
import { useEffect, useCallback } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  label?: string;
}

export function RichTextEditor({ value, onChange, label = 'Content' }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Image.configure({ inline: false, allowBase64: true }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Start writing...' }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: value,
    onUpdate: ({ editor: e }) => onChange(e.getHTML()),
    editorProps: {
      attributes: { class: 'tiptap-editor-content' },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, false);
    }
  }, [value]);

  const addImage = useCallback(() => {
    if (!editor) return;
    const url = prompt('Enter image URL:');
    if (url) editor.chain().focus().setImage({ src: url }).run();
  }, [editor]);

  const addLink = useCallback(() => {
    if (!editor) return;
    const url = prompt('Enter link URL:');
    if (url) editor.chain().focus().setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  const ToolBarBtn = ({
    onClick, active, children, title,
  }: { onClick: () => void; active?: boolean; children: React.ReactNode; title: string }) => (
    <button
      type="button"
      className={`tiptap-btn ${active ? 'active' : ''}`}
      onClick={onClick}
      title={title}
    >
      {children}
    </button>
  );

  return (
    <div className="rich-text-editor">
      <label className="admin-label">{label}</label>
      <div className="tiptap-toolbar">
        <ToolBarBtn onClick={() => editor.chain().focus().undo().run()} title="Undo">
          <Undo size={16} />
        </ToolBarBtn>
        <ToolBarBtn onClick={() => editor.chain().focus().redo().run()} title="Redo">
          <Redo size={16} />
        </ToolBarBtn>
        <span className="toolbar-divider" />
        <ToolBarBtn
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          <Heading1 size={16} />
        </ToolBarBtn>
        <ToolBarBtn
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
          title="Heading 3"
        >
          <Heading2 size={16} />
        </ToolBarBtn>
        <span className="toolbar-divider" />
        <ToolBarBtn
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="Bold"
        >
          <Bold size={16} />
        </ToolBarBtn>
        <ToolBarBtn
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="Italic"
        >
          <Italic size={16} />
        </ToolBarBtn>
        <ToolBarBtn
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive('code')}
          title="Code"
        >
          <Code size={16} />
        </ToolBarBtn>
        <span className="toolbar-divider" />
        <ToolBarBtn
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <List size={16} />
        </ToolBarBtn>
        <ToolBarBtn
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="Ordered List"
        >
          <ListOrdered size={16} />
        </ToolBarBtn>
        <ToolBarBtn
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          title="Blockquote"
        >
          <Quote size={16} />
        </ToolBarBtn>
        <span className="toolbar-divider" />
        <ToolBarBtn
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          active={editor.isActive({ textAlign: 'left' })}
          title="Align Left"
        >
          <AlignLeft size={16} />
        </ToolBarBtn>
        <ToolBarBtn
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          active={editor.isActive({ textAlign: 'center' })}
          title="Align Center"
        >
          <AlignCenter size={16} />
        </ToolBarBtn>
        <ToolBarBtn
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          active={editor.isActive({ textAlign: 'right' })}
          title="Align Right"
        >
          <AlignRight size={16} />
        </ToolBarBtn>
        <span className="toolbar-divider" />
        <ToolBarBtn onClick={addLink} active={editor.isActive('link')} title="Add Link">
          <LinkIcon size={16} />
        </ToolBarBtn>
        <ToolBarBtn onClick={addImage} title="Add Image">
          <ImageIcon size={16} />
        </ToolBarBtn>
      </div>
      <EditorContent editor={editor} className="tiptap-editor" />
    </div>
  );
}
