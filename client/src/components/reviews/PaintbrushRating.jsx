import React, { useMemo, useState } from "react";

export default function PaintbrushRating({
  value = 0,
  onChange, // <- if provided, becomes interactive picker
  showOutOf = false,
  disabled = false,
}) {
  const [hover, setHover] = useState(null);

  const v = useMemo(() => {
    const n = Number(value) || 0;
    return Math.max(0, Math.min(5, Math.round(n)));
  }, [value]);

  const interactive = typeof onChange === "function" && !disabled;
  const active = hover !== null ? hover : v;

  const btnStyle = (filled) => ({
    border: "none",
    background: "transparent",
    cursor: interactive ? "pointer" : "default",
    padding: 2,
    fontSize: 18,
    lineHeight: 1,
    opacity: filled ? 1 : 0.25,
    transition: "opacity 120ms ease",
  });

  return (
    <div
      aria-label={`${v} out of 5 paintbrushes`}
      title={`${v} out of 5`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 2,
        userSelect: "none",
      }}
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const n = i + 1;
        const filled = n <= active;

        // Interactive mode: buttons you can click/hover
        if (interactive) {
          return (
            <button
              key={n}
              type="button"
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(n)}
              onBlur={() => setHover(null)}
              onClick={() => onChange(n)}
              style={btnStyle(filled)}
              aria-label={`${n} out of 5`}
              title={`${n} out of 5`}
            >
              🖌️
            </button>
          );
        }

        // Read-only mode: just emojis
        return (
          <span key={n} style={btnStyle(filled)} aria-hidden="true">
            🖌️
          </span>
        );
      })}

      {showOutOf ? (
        <span style={{ marginLeft: 8, fontSize: 14, opacity: 0.7 }}>{v}/5</span>
      ) : null}
    </div>
  );
}
