import type { ComponentProps, ReactNode } from "react";
import React from "react";
import CodeInline from "@theme/CodeInline";
import type { Props } from "@theme/MDXComponents/Code";

function shouldBeInline(props: Props) {
  return (
    // empty code blocks have no props.children,
    // see https://github.com/facebook/docusaurus/pull/9704
    typeof props.children !== "undefined" &&
    React.Children.toArray(props.children).every(
      (el) => typeof el === "string" && !el.includes("\n")
    )
  );
}

function CodeBlock(props: ComponentProps<"code">): JSX.Element {
  return <code {...props} />;
}

export default function MDXCode(props: Props): ReactNode {
  return shouldBeInline(props) ? (
    <CodeInline {...props} />
  ) : (
    <CodeBlock {...(props as ComponentProps<typeof CodeBlock>)} />
  );
}
