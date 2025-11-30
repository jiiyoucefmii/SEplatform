
interface InputProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  dir?: "rtl" | "ltr";
}

export default function Input({
  type,
  placeholder,
  value,
  onChange,
  dir = "ltr",
}: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      dir={dir}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-primary 
                 text-gray-700"
    />
  );
}
