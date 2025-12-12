import { forwardRef } from "react";

type Props = {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
  className?: string;
  inputClassName?: string;
};

export const ScribbleField = forwardRef<HTMLInputElement, Props>(
  function ScribbleField(
    { label, placeholder, value, onChange, className, inputClassName },
    ref,
  ) {
    return (
      <label className={className}>
        {label ? (
          <div
            className="mb-1 text-[15px] leading-5 tracking-wide text-neutral-800"
            style={{ fontFamily: "var(--font-scribble)" }}
          >
            {label}
          </div>
        ) : null}
        <input
          ref={ref}
          className={[
            "sb-scribble w-full px-3 py-2 text-[16px] leading-6 text-neutral-900",
            "placeholder:text-neutral-500/70",
            "focus:ring-2 focus:ring-black/10",
            inputClassName ?? "",
          ].join(" ")}
          style={{ fontFamily: "var(--font-scribble)" }}
          placeholder={placeholder}
          value={value ?? ""}
          onChange={(e) => onChange?.(e.target.value)}
        />
      </label>
    );
  },
);

type AreaProps = Omit<Props, "inputClassName"> & {
  rows?: number;
};

export function ScribbleArea({
  label,
  placeholder,
  value,
  onChange,
  className,
  rows = 4,
}: AreaProps) {
  return (
    <label className={className}>
      {label ? (
        <div
          className="mb-1 text-[15px] leading-5 tracking-wide text-neutral-800"
          style={{ fontFamily: "var(--font-scribble)" }}
        >
          {label}
        </div>
      ) : null}
      <textarea
        className={[
          "sb-scribble w-full resize-none px-3 py-2 text-[16px] leading-6 text-neutral-900",
          "placeholder:text-neutral-500/70",
          "focus:ring-2 focus:ring-black/10",
        ].join(" ")}
        style={{ fontFamily: "var(--font-scribble)" }}
        placeholder={placeholder}
        value={value ?? ""}
        rows={rows}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </label>
  );
}
