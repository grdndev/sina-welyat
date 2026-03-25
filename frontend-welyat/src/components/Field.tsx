interface FieldProps {
  title: string;
  name: string;
  type?: string | 'text';
  required?: boolean;
  pattern?: string | '';
  value?: any;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string | '';
}

export default function Field({
  title,
  name,
  type,
  required,
  pattern,
  value,
  onChange,
  placeholder,
}: FieldProps) {
  return (
    <div>
      <label htmlFor={name} className="font-semibold text-lg">
        {' '}
        {title}{' '}
      </label>
      <br />
      <input
        name={name}
        type={type}
        className="bg-white/10 backdrop-blur-md border border-white/20 shadow-lg focus:border-primary focus:outline-none rounded-md w-full my-2 p-1 placeholder:text-white-600 focus:ring-2 focus:ring-primary/50"
        required={required}
        pattern={pattern}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      <br />
    </div>
  );
}
