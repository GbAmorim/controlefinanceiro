import { useState, useEffect, useRef } from "react";
import { Settings, Check } from "lucide-react";
import { THEMES } from "../utils/themes";

export default function ThemeMenu({ theme, onChange }) {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null); // referência ao elemento HTML do menu

    // Fecha o menu ao clicar fora dele ou apertar Esc
    useEffect(() => {
        if (!open) return;

        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpen(false);
            }
        }
        function handleKey(event) {
            if (event.key === "Escape") setOpen(false);
        }

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKey);

        // Limpeza: remove os "ouvintes" quando o menu fecha
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKey);
        };
    }, [open]);

    return (
        <div className="theme-menu" ref={menuRef}>
            <button
                className="icon-btn"
                onClick={() => setOpen((prev) => !prev)}
                aria-label="Escolher tema"
                aria-haspopup="true"
                aria-expanded={open}
            >
                <Settings size={18} />
            </button>

            {open && (
                <div className="theme-popover" role="menu">
                    <div className="popover-title">Tema</div>
                    {THEMES.map((t) => (
                        <button
                            key={t.id}
                            role="menuitemradio"
                            aria-checked={theme === t.id}
                            className={`theme-option ${theme === t.id ? "active" : ""}`}
                            onClick={() => onChange(t.id)}
                        >
                            <span
                                className="theme-dot"
                                style={{ background: t.color }}
                            />
                            {t.label}
                            {theme === t.id && (
                                <Check size={14} className="check" />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
