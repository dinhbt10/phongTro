"use client";
// Trình soạn thảo rich text (Tiptap) cho ô "Mô tả". Xuất HTML, dùng qua RHF Controller.
import { useEffect } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  BoldIcon,
  ItalicIcon,
  StrikethroughIcon,
  Heading2Icon,
  Heading3Icon,
  ListIcon,
  ListOrderedIcon,
  LinkIcon,
  Undo2Icon,
  Redo2Icon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false, // tránh hydration mismatch trong Next SSR
    extensions: [
      StarterKit.configure({ link: false }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        protocols: ["http", "https", "mailto", "tel"],
      }),
      Placeholder.configure({ placeholder: placeholder ?? "Nhập nội dung…" }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm dark:prose-invert max-w-none min-h-[140px] px-3 py-2 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      // Editor rỗng vẫn trả "<p></p>" → quy về chuỗi rỗng để DB/giao diện sạch.
      onChange(editor.getText().trim() ? html : "");
    },
  });

  // Đồng bộ khi value được set từ bên ngoài (vd tính năng "Phân tích tin rao").
  useEffect(() => {
    if (!editor) return;
    const next = value || "";
    if (next !== editor.getHTML()) {
      editor.commands.setContent(next, { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="rounded-lg border border-input bg-transparent focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const setLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Nhập đường link (URL):", prev ?? "https://");
    if (url === null) return; // bấm Hủy
    if (url.trim() === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const cls = (active: boolean) =>
    cn(
      "inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground [&_svg]:size-4",
      active && "bg-muted text-foreground",
    );

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b p-1">
      <button type="button" title="Đậm" className={cls(editor.isActive("bold"))} onClick={() => editor.chain().focus().toggleBold().run()}>
        <BoldIcon />
      </button>
      <button type="button" title="Nghiêng" className={cls(editor.isActive("italic"))} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <ItalicIcon />
      </button>
      <button type="button" title="Gạch ngang" className={cls(editor.isActive("strike"))} onClick={() => editor.chain().focus().toggleStrike().run()}>
        <StrikethroughIcon />
      </button>
      <span className="mx-1 h-5 w-px bg-border" />
      <button type="button" title="Tiêu đề lớn" className={cls(editor.isActive("heading", { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        <Heading2Icon />
      </button>
      <button type="button" title="Tiêu đề nhỏ" className={cls(editor.isActive("heading", { level: 3 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
        <Heading3Icon />
      </button>
      <span className="mx-1 h-5 w-px bg-border" />
      <button type="button" title="Danh sách" className={cls(editor.isActive("bulletList"))} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <ListIcon />
      </button>
      <button type="button" title="Danh sách số" className={cls(editor.isActive("orderedList"))} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrderedIcon />
      </button>
      <button type="button" title="Chèn link" className={cls(editor.isActive("link"))} onClick={setLink}>
        <LinkIcon />
      </button>
      <span className="mx-1 h-5 w-px bg-border" />
      <button type="button" title="Hoàn tác" className={cls(false)} onClick={() => editor.chain().focus().undo().run()}>
        <Undo2Icon />
      </button>
      <button type="button" title="Làm lại" className={cls(false)} onClick={() => editor.chain().focus().redo().run()}>
        <Redo2Icon />
      </button>
    </div>
  );
}
