import React from "react";

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
}

export default function FormTextarea({ label, className = "", ...props }: FormTextareaProps) {
    return (
        <div className="admin-form-group">
            <label className="admin-label">{label}</label>
            <textarea className={`admin-textarea ${className}`} {...props} />
        </div>
    );
}
