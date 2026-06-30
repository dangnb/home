import React from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export default function FormInput({ label, className = "", ...props }: FormInputProps) {
    return (
        <div className="admin-form-group">
            <label className="admin-label">{label}</label>
            <input className={`admin-input ${className}`} {...props} />
        </div>
    );
}
