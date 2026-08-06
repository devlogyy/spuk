import { useId, type KeyboardEvent } from "react";
import { X } from "lucide-react";

interface Props {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  helper?: string;
  examples?: string[];
  max?: number;
  /** allowed chars regex; defaults to letters + ? + * */
  allow?: RegExp;
  /** uppercase the value */
  upper?: boolean;
  /** WebMCP declarative tool name exposed to browser agents */
  toolName?: string;
  /** WebMCP declarative tool description exposed to browser agents */
  toolDescription?: string;
  /** name attribute of the input, used as the agent-facing parameter name */
  fieldName?: string;
}

export function SmartInput({

  label,
  value,
  onChange,
  onSubmit,
  placeholder,
  helper,
  examples,
  max = 20,
  allow = /[^a-zA-Z?*_ ]/g,
  upper = true,
  toolName,
  toolDescription,
  fieldName = "query",
}: Props) {
  const id = useId();
  const helperId = `${id}-helper`;

  const handle = (v: string) => {
    let next = v.replace(allow, "").slice(0, max);
    if (upper) next = next.toUpperCase();
    onChange(next);
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSubmit) {
      e.preventDefault();
      onSubmit();
    }
  };

  // Declarative WebMCP: agents discover this form as a callable tool.
  const toolAttrs = toolName
    ? { toolname: toolName, tooldescription: toolDescription ?? label }
    : {};

  return (
    <form
      className="space-y-2"
      {...toolAttrs}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
    >
      <label htmlFor={id} className="block text-sm font-semibold text-foreground">
        {label}
      </label>
      <div className="glass-strong flex items-center gap-2 rounded-2xl p-2 shadow-soft">
        <input
          id={id}
          name={fieldName}
          type="text"
          value={value}
          onChange={(e) => handle(e.target.value)}
          onKeyDown={onKey}
          placeholder={placeholder}
          aria-label={label}
          aria-describedby={helper ? helperId : undefined}
          inputMode="text"
          autoCapitalize="characters"
          autoComplete="off"
          spellCheck={false}
          className="h-12 flex-1 bg-transparent px-3 text-base font-semibold tracking-wider outline-none placeholder:font-normal placeholder:tracking-normal placeholder:text-muted-foreground sm:h-14 sm:text-lg"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Clear input"
            className="grid h-11 w-11 place-items-center rounded-xl text-muted-foreground transition hover:bg-accent hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {helper && (
        <p id={helperId} className="text-xs text-muted-foreground">
          {helper}
        </p>
      )}
      {examples && examples.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-medium text-muted-foreground">Try:</span>
          {examples.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => onChange(ex)}
              className="min-h-9 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-semibold tracking-wider text-foreground transition hover:border-primary hover:text-primary"
            >
              {ex}
            </button>
          ))}

        </div>
      )}
    </form>
  );
}
