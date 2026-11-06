import { THEMES } from "../utils/themes";

export default function ThemeSelector({ theme, onChange }) {
    return (
        <div className="theme-selector">
            {THEMES.map((t) => (
                <button
                    key={t.id}
                    className={`theme-btn ${theme === t.id ? "active" : ""}`}
                    onClick={() => onChange(t.id)}
                >
                    <span
                        className="theme-dot"
                        style={{ background: t.color }}
                    />
                    {t.label}
                </button>
            ))}
        </div>
    );
}
