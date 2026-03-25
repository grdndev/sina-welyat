interface ButtonProps {
    name: string;
    typeColor?: string;
    typeBtn: "button" | "submit" | "reset";
    fn?: () => void;
    className?: string;
}

export default function Button({ name, typeColor, typeBtn, fn, className }: ButtonProps) {
    let color: string;
    switch (typeColor?.toLowerCase()) {
        case "success": color = "#157347"; break;
        case "warning": color = "#FFCA2C"; break;
        case "danger":  color = "#BB2D3B"; break;
        case "primary": color = "#161B22"; break;
        default:        color = "#8e5cff"; break;
    }

    return (
        <button
            type={typeBtn}
            onClick={fn}
            style={{
                "--btn-color": color,
                background: typeColor ? undefined : 'linear-gradient(135deg, #b78cff 0%, #8e5cff 50%, #5a2ccb 100%)',
                boxShadow: '0 4px 20px rgba(90, 44, 203, 0.4)',
            } as React.CSSProperties}
            className={`
                relative overflow-hidden
                rounded-full font-bold w-full px-4 py-2
                text-white uppercase text-sm tracking-widest
                transition duration-300 active:opacity-90
                hover:scale-105 hover:brightness-110
                ${typeColor ? 'bg-[var(--btn-color)] border border-[var(--btn-color)]' : ''}
                ${className ?? ""}
            `}
        >
            {name}
        </button>
    );
}