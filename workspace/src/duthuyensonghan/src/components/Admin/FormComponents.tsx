import React from "react";
import styles from "@/app/admin/admin.module.css";

// ── Shared Types ──
interface BaseFieldProps {
    label: string;
    required?: boolean;
    helpText?: React.ReactNode;
    icon?: string;
    className?: string;
}

interface FormInputProps extends BaseFieldProps, Omit<React.InputHTMLAttributes<HTMLInputElement>, "className"> { }

export function FormInput({ label, required, helpText, icon, className = "", ...props }: FormInputProps) {
    return (
        <div className={`${styles.formField} ${className}`}>
            <label>
                {label} {required && <span style={{ color: "#ef4444" }}>*</span>}
            </label>
            {icon ? (
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <span style={{ position: "absolute", left: "0.85rem", fontSize: "1rem" }}>{icon}</span>
                    <input {...props} style={{ ...props.style, paddingLeft: "2.4rem" }} />
                </div>
            ) : (
                <input {...props} />
            )}
            {helpText && <span style={{ fontSize: "0.75rem", color: "#94a3b8", display: "block" }}>{helpText}</span>}
        </div>
    );
}

interface FormTextareaProps extends BaseFieldProps, Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "className"> { }

export function FormTextarea({ label, required, helpText, className = "", ...props }: FormTextareaProps) {
    return (
        <div className={`${styles.formField} ${className}`}>
            <label>
                {label} {required && <span style={{ color: "#ef4444" }}>*</span>}
            </label>
            <textarea {...props} />
            {helpText && <span style={{ fontSize: "0.75rem", color: "#94a3b8", display: "block" }}>{helpText}</span>}
        </div>
    );
}

interface FormSelectProps extends BaseFieldProps, Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "className"> {
    options: { label: string; value: string | number }[];
}

export function FormSelect({ label, required, helpText, options, className = "", ...props }: FormSelectProps) {
    return (
        <div className={`${styles.formField} ${className}`}>
            <label>
                {label} {required && <span style={{ color: "#ef4444" }}>*</span>}
            </label>
            <select {...props}>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {helpText && <span style={{ fontSize: "0.75rem", color: "#94a3b8", display: "block" }}>{helpText}</span>}
        </div>
    );
}
