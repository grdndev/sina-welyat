interface TextareaProps {
    title: string,
    name: string,
    required?: boolean,
    value?: any,
    onChange?: React.ChangeEventHandler<HTMLTextAreaElement>,
    placeholder?: string,
    rows?: number
}

export default function Textarea({ title, name, required, value, onChange, placeholder, rows = 4 }: TextareaProps) {
    return (
        <div>
            <label htmlFor={name} className="font-semibold text-lg">{title}</label>
            <br />
            <textarea
                id={name}
                name={name}
                rows={rows}
                className="bg-white/10 backdrop-blur-md border border-white/20 shadow-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-md w-full my-2 p-1 placeholder:text-white-600 resize-none"
                required={required}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
            <br />
        </div>
    )
}