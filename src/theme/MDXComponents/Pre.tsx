import React, { type ReactNode, useRef, useState } from "react";
import type { Props } from "@theme/MDXComponents/Pre";

type PreWithDataTitle = Props & { "data-title"?: string };

export default function MDXPre(props: PreWithDataTitle): ReactNode | undefined {
  const title = props["data-title"];
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const code = preRef.current?.innerText || preRef.current?.textContent || "";

    copyText(code, () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      style={{
        ...props.style,
        borderRadius: "var(--ifm-pre-border-radius)",
      }}
      className="shiki-code-wrapper"
    >
      {title && (
        <div className="shiki-code-header">
          <span>{title}</span>
        </div>
      )}
      <div className="shiki-code-content">
        <button
          className="shiki-code-copy-button"
          onClick={handleCopy}
          title={copied ? "已复制!" : "复制代码"}
          style={{ ...props.style }}
        >
          <i className={copied ? "tabler--check" : "tabler--copy"}></i>
        </button>
        <pre {...props} ref={preRef} />
      </div>
    </div>
  );
}

export function copyText(text: string, cb: () => void) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      cb();
    });
  } else {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      const successful = document.execCommand("copy");
      if (successful) {
        cb();
      }
    } catch (err) {
      console.error("Fallback: Oops, unable to copy", err);
    }
    document.body.removeChild(textArea);
  }
}
