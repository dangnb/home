"use client";

import React from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

// Dynamic import to prevent SSR issues with Quill
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
}

export default function RichTextEditor({ value, onChange, placeholder, label }: RichTextEditorProps) {
    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image", "video"],
            ["clean"],
        ],
    };

    return (
        <div className="admin-form-group" style={{ marginBottom: "20px" }}>
            {label && <label className="admin-label">{label}</label>}
            <div style={{ backgroundColor: "#fff" }}>
                <ReactQuill
                    theme="snow"
                    value={value || ""}
                    onChange={onChange}
                    placeholder={placeholder}
                    modules={modules}
                    style={{ minHeight: "200px" }}
                />
            </div>
            <style jsx global>{`
                .ql-editor {
                    min-height: 200px;
                    font-size: 1rem;
                    line-height: 1.6;
                }
            `}</style>
        </div>
    );
}
