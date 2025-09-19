"use client";

import { FC, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Link from "@tiptap/extension-link";
import Blockquote from "@tiptap/extension-blockquote";
import CodeBlock from "@tiptap/extension-code-block";
import Image from "@tiptap/extension-image";
import HorizontalRule from "@tiptap/extension-horizontal-rule";

// ⭐ NEW extensions
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Link as LinkIcon,
  List as ListIcon,
  ListOrdered,
  Quote,
  Code,
  ImageIcon,
  Minus,
  Underline as UnderlineIcon,
  Strikethrough,
  CheckSquare,
  Highlighter,
} from "lucide-react";

interface TipTapEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const TipTapEditor: FC<TipTapEditorProps> = ({ value, onChange }) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        // Disable built-in history if you add custom History
        // history: false,
      }),
      Bold,
      Italic,
      Heading.configure({ levels: [1, 2, 3] }),
      BulletList,
      OrderedList,
      ListItem,
      Link.configure({ openOnClick: false }),
      Blockquote,
      CodeBlock,
      Image,
      HorizontalRule,

      // ⭐ New goodies
      Underline,
      Strike,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Color.configure({ types: ["textStyle"] }),
      TaskList,
      TaskItem,
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert max-w-none min-h-[200px] p-3 border rounded-md focus:outline-none",
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) return null;

  const setLink = () => {
    const url = prompt("Enter URL");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = prompt("Enter image URL");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 bg-muted p-2 rounded-md border">
        {/* Text styles */}
        <Button
          type="button"
          variant={editor.isActive("bold") ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <BoldIcon className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("italic") ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <ItalicIcon className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("underline") ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("strike") ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="w-4 h-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {/* Headings */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          H2
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          H3
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {/* Lists */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <ListIcon className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleTaskList().run()}
        >
          <CheckSquare className="w-4 h-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {/* Block types */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <Code className="w-4 h-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {/* Highlight */}
        <Button
          type="button"
          variant={editor.isActive("highlight") ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
        >
          <Highlighter className="w-4 h-4" />
        </Button>

        {/* Alignment */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          L
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          C
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          R
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {/* Links & media */}
        <Button type="button" variant="outline" size="sm" onClick={setLink}>
          <LinkIcon className="w-4 h-4" />
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={addImage}>
          <ImageIcon className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Minus className="w-4 h-4" />
        </Button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
};
