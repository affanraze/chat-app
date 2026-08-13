import React from "react";

export default function Avatar({ initials, hue, size = 44, online }) {
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <div
        className="w-full h-full rounded-full flex items-center justify-center font-semibold"
        style={{
          background: `linear-gradient(150deg, ${hue}33, ${hue}11)`,
          color: hue,
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: size * 0.36,
        }}
      >
        {initials}
      </div>
      {online && (
        <span
          className="absolute bottom-0 right-0 rounded-full border-2 border-[var(--elevated)]"
          style={{ width: size * 0.28, height: size * 0.28, background: "var(--online)" }}
        />
      )}
    </div>
  );
}
