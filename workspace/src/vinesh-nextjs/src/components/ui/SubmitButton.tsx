"use client";

import { useFormStatus } from "react-dom";

interface SubmitButtonProps {
    children: React.ReactNode;
    className?: string;
    icon?: React.ReactNode;
}

export default function SubmitButton({ children, className, icon }: SubmitButtonProps) {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            className={className || "admin-btn btn-primary"}
            disabled={pending}
            style={pending ? { opacity: 0.7, cursor: "not-allowed" } : {}}
        >
            {pending ? (
                <>
                    <i className="ph ph-spinner ph-spin" style={{ marginRight: "8px" }}></i>
                    Đang xử lý...
                </>
            ) : (
                <>
                    {icon && <span style={{ marginRight: "5px" }}>{icon}</span>}
                    {children}
                </>
            )}
        </button>
    );
}
