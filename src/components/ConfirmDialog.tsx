import { AlertTriangle } from "lucide-react";
import Modal from "./Modal";

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
    variant?: 'danger' | 'warning';
}

export default function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "تأكيد",
    cancelText = "إلغاء",
    isLoading = false,
    variant = 'danger'
}: ConfirmDialogProps) {
    const variantStyles = {
        danger: {
            icon: 'text-red-500',
            button: 'bg-red-500 hover:bg-red-600',
        },
        warning: {
            icon: 'text-yellow-500',
            button: 'bg-yellow-500 hover:bg-yellow-600',
        },
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="sm"
            footer={
                <>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 ${variantStyles[variant].button}`}
                    >
                        {isLoading ? "جارٍ..." : confirmText}
                    </button>
                </>
            }
        >
            <div className="flex items-start gap-4">
                <div className={`p-2 rounded-full bg-red-100 ${variantStyles[variant].icon}`}>
                    <AlertTriangle className="w-6 h-6" />
                </div>
                <p className="text-gray-600 mt-1">{message}</p>
            </div>
        </Modal>
    );
}
