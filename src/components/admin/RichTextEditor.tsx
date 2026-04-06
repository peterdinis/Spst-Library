"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
	Bold,
	Italic,
	List,
	ListOrdered,
	Quote,
	Redo,
	Strikethrough,
	Type,
	Undo,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
}

const Toolbar = ({ editor }: { editor: any }) => {
	if (!editor) return null;

	const components = [
		{
			icon: Bold,
			onClick: () => editor.chain().focus().toggleBold().run(),
			isActive: editor.isActive("bold"),
		},
		{
			icon: Italic,
			onClick: () => editor.chain().focus().toggleItalic().run(),
			isActive: editor.isActive("italic"),
		},
		{
			icon: Strikethrough,
			onClick: () => editor.chain().focus().toggleStrike().run(),
			isActive: editor.isActive("strike"),
		},
		{
			icon: List,
			onClick: () => editor.chain().focus().toggleBulletList().run(),
			isActive: editor.isActive("bulletList"),
		},
		{
			icon: ListOrdered,
			onClick: () => editor.chain().focus().toggleOrderedList().run(),
			isActive: editor.isActive("orderedList"),
		},
		{
			icon: Quote,
			onClick: () => editor.chain().focus().toggleBlockquote().run(),
			isActive: editor.isActive("blockquote"),
		},
	];

	return (
		<div className="flex flex-wrap items-center gap-1 border-b border-border p-1">
			{components.map((item, index) => (
				<Button
					key={index}
					type="button"
					variant="ghost"
					size="sm"
					onClick={item.onClick}
					className={cn(
						"h-8 w-8 p-0 rounded-md",
						item.isActive && "bg-primary/10 text-primary hover:bg-primary/20",
					)}
				>
					<item.icon className="h-4 w-4" />
				</Button>
			))}
			<div className="w-[1px] h-4 bg-border mx-1" />
			<Button
				type="button"
				variant="ghost"
				size="sm"
				onClick={() => editor.chain().focus().undo().run()}
				disabled={!editor.can().undo()}
				className="h-8 w-8 p-0"
			>
				<Undo className="h-4 w-4" />
			</Button>
			<Button
				type="button"
				variant="ghost"
				size="sm"
				onClick={() => editor.chain().focus().redo().run()}
				disabled={!editor.can().redo()}
				className="h-8 w-8 p-0"
			>
				<Redo className="h-4 w-4" />
			</Button>
		</div>
	);
};

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				bulletList: {
					keepMarks: true,
					keepAttributes: false,
				},
				orderedList: {
					keepMarks: true,
					keepAttributes: false,
				},
			}),
			Underline,
			Link.configure({
				openOnClick: false,
			}),
			Placeholder.configure({
				placeholder: placeholder || "Začnite písať...",
			}),
		],
		content: value,
		editorProps: {
			attributes: {
				class:
					"prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[150px] p-4 text-slate-900 dark:text-slate-100",
			},
		},
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML());
		},
	});
 
	useEffect(() => {
		if (editor && value !== editor.getHTML()) {
			editor.commands.setContent(value);
		}
	}, [value, editor]);

	return (
		<div className="w-full rounded-2xl border border-border bg-background focus-within:ring-2 focus-within:ring-primary/20 transition-all overflow-hidden flex flex-col">
			<Toolbar editor={editor} />
			<EditorContent editor={editor} />
			<style jsx global>{`
				.ProseMirror p.is-editor-empty:first-child::before {
					content: attr(data-placeholder);
					float: left;
					color: #adb5bd;
					pointer-events: none;
					height: 0;
				}
				.ProseMirror {
					outline: none;
				}
				.ProseMirror ul {
					list-style-type: disc;
					padding-left: 1.5rem;
					margin: 1rem 0;
				}
				.ProseMirror ol {
					list-style-type: decimal;
					padding-left: 1.5rem;
					margin: 1rem 0;
				}
				.ProseMirror blockquote {
					border-left: 3px solid #e2e8f0;
					padding-left: 1rem;
					margin: 1rem 0;
					font-style: italic;
				}
			`}</style>
		</div>
	);
}
