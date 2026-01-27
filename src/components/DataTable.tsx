import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface Column<T> {
    key: string;
    header: string;
    render?: (item: T) => ReactNode;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    loading?: boolean;
    emptyMessage?: string;
    keyExtractor: (item: T) => string | number;
}

export default function DataTable<T>({
    columns,
    data,
    loading = false,
    emptyMessage = "لا توجد بيانات",
    keyExtractor,
}: DataTableProps<T>) {
    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#024C3F]" />
                <span className="mr-2 text-gray-500">جارٍ التحميل...</span>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500">
                {emptyMessage}
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="bg-gray-50 border-b">
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                className="px-4 py-3 text-right text-sm font-semibold text-gray-600"
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr
                            key={keyExtractor(item)}
                            className="border-b hover:bg-gray-50 transition-colors"
                        >
                            {columns.map((col) => (
                                <td key={col.key} className="px-4 py-3 text-sm">
                                    {col.render
                                        ? col.render(item)
                                        : (item as any)[col.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
