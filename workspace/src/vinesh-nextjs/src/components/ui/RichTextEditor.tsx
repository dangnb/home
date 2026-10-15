"use client";

import React, { useRef, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { uploadEditorImage } from "@/app/admin/actions";

// Dynamic import to prevent SSR issues with Quill, while forwarding the ref
const ReactQuill = dynamic(
    async () => {
        const { default: RQ, Quill } = await import("react-quill-new");
        const { default: BlotFormatter } = await import("quill-blot-formatter");
        const { default: ImageDropAndPaste } = await import("quill-image-drop-and-paste");

        // Register custom image blot to preserve inline styles (like float, display, margin, width, height)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const BaseImageFormat = Quill.import("formats/image") as any;
        class ImageFormat extends BaseImageFormat {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            static formats(domNode: any) {
                return ["height", "width", "style"].reduce(function (formats: Record<string, string | null>, attribute: string) {
                    if (domNode.hasAttribute(attribute)) {
                        formats[attribute] = domNode.getAttribute(attribute);
                    }
                    return formats;
                }, {});
            }
            format(name: string, value: unknown) {
                if (["height", "width", "style"].indexOf(name) > -1) {
                    if (value) {
                        this.domNode.setAttribute(name, String(value));
                    } else {
                        this.domNode.removeAttribute(name);
                    }
                } else {
                    super.format(name, value);
                }
            }
        }
        Quill.register(ImageFormat, true);
        Quill.register("modules/blotFormatter", BlotFormatter);
        Quill.register("modules/imageDropAndPaste", ImageDropAndPaste);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ForwardedQuill = React.forwardRef((props, ref) => <RQ ref={ref as any} {...(props as any)} />);
        ForwardedQuill.displayName = "ForwardedQuill";
        return ForwardedQuill;
    },
    { ssr: false }
);

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
    name?: string;
}

interface QuillEditorInstance {
    getSelection: (focus?: boolean) => { index: number } | null;
    insertEmbed: (index: number, format: string, value: string) => void;
}

export default function RichTextEditor({ value, onChange, placeholder, label, name }: RichTextEditorProps) {
    const quillRef = useRef<{ getEditor: () => QuillEditorInstance } | null>(null);

    const imageHandler = useCallback(() => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.onchange = async () => {
            if (input.files && input.files[0]) {
                const file = input.files[0];

                try {
                    const formData = new FormData();
                    formData.append("file", file);

                    // Call the server action directly
                    const res = await uploadEditorImage(formData);

                    if (res && res.success && res.url) {
                        const quill = quillRef.current?.getEditor();
                        if (quill) {
                            const range = quill.getSelection(true);
                            quill.insertEmbed(range?.index || 0, "image", res.url);
                        }
                    } else {
                        alert("Lỗi khi tải ảnh lên!");
                    }
                } catch (error) {
                    console.error("Upload error:", error);
                    alert("Đã xảy ra lỗi khi tải ảnh.");
                }
            }
        };
    }, []);

    const imageDropHandler = useCallback((_imageDataUrl: string, _type: string, imageData: { toFile: () => File | null }) => {
        const file = imageData.toFile();
        if (!file) return;

        const upload = async () => {
            try {
                const formData = new FormData();
                formData.append("file", file);
                const res = await uploadEditorImage(formData);

                if (res && res.success && res.url) {
                    const quill = quillRef.current?.getEditor();
                    if (quill) {
                        const range = quill.getSelection(true);
                        quill.insertEmbed(range?.index || 0, "image", res.url);
                    }
                } else {
                    alert("Lỗi khi tải ảnh copy/paste lên!");
                }
            } catch (error) {
                console.error("Upload error:", error);
                alert("Đã xảy ra lỗi khi tải ảnh copy/paste.");
            }
        };
        upload();
    }, []);

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ font: [] }, { size: [] }],
                [{ header: [1, 2, 3, 4, 5, 6, false] }],
                ["bold", "italic", "underline", "strike"],
                [{ color: [] }, { background: [] }],
                [{ script: "sub" }, { script: "super" }],
                ["blockquote", "code-block"],
                [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
                [{ direction: "rtl" }, { align: [] }],
                ["link", "image", "video"],
                ["clean"],
            ],
            handlers: {
                image: imageHandler
            }
        },
        blotFormatter: {},
        imageDropAndPaste: {
            handler: imageDropHandler
        }
    }), [imageHandler, imageDropHandler]);

    return (
        <div className="admin-form-group" style={{ marginBottom: "20px" }}>
            {label && <label className="admin-label">{label}</label>}
            <div style={{ backgroundColor: "#fff" }}>
                <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    value={value || ""}
                    onChange={onChange}
                    placeholder={placeholder}
                    modules={modules}
                    style={{ minHeight: "200px" }}
                />
                {name && <input type="hidden" name={name} value={value || ""} />}
            </div>
            <style jsx global>{`
                .ql-editor {
                    min-height: 200px;
                    font-size: 1rem;
                    line-height: 1.6;
                }
                .ql-editor img {
                    max-width: 100%;
                    height: auto;
                }
            `}</style>
        </div>
    );
}

