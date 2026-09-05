import { useEffect, useRef, useState } from "react";
import MingcuteCheckLine from "~icons/mingcute/check-line";
import MingcuteCopy2Line from "~icons/mingcute/copy-2-line";

interface CopyButtonProps {
  value: string;
  label: string;
  size?: number;
}

export function CopyButton({ value, label, size = 16 }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<number | undefined>(undefined);

  useEffect(
    () => () => {
      window.clearTimeout(resetTimer.current);
    },
    [],
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.clearTimeout(resetTimer.current);
      resetTimer.current = window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      className={copied ? "docs-copy-button is-copied" : "docs-copy-button"}
      type="button"
      aria-label={copied ? "已复制" : label}
      title={copied ? "已复制" : label}
      onClick={handleCopy}
    >
      {copied ? (
        <MingcuteCheckLine width={size} height={size} aria-hidden="true" />
      ) : (
        <MingcuteCopy2Line width={size} height={size} aria-hidden="true" />
      )}
      <span className="docs-copy-button__status" aria-live="polite">
        {copied ? "已复制" : ""}
      </span>
    </button>
  );
}
