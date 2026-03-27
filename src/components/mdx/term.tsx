import {
  Children,
  cloneElement,
  isValidElement,
  useId,
  type ReactNode,
} from "react";

export function Term({
  children,
  tip,
}: {
  children: ReactNode;
  tip: string;
}) {
  const tooltipId = useId();
  const items = Children.toArray(children);
  const isCodeTerm = items.length === 1
    && isValidElement(items[0])
    && items[0].type === "code";
  const renderedChildren = isCodeTerm
    && isValidElement<{ className?: string }>(items[0])
    ? cloneElement(items[0], {
        className: [items[0].props.className, "nb-term__code"]
          .filter(Boolean)
          .join(" "),
      })
    : children;

  return (
    <span className="nb-term-wrap">
      <button
        aria-describedby={tooltipId}
        className={isCodeTerm ? "nb-term nb-term--code" : "nb-term"}
        type="button"
      >
        {renderedChildren}
      </button>

      <span
        className="nb-term__tooltip"
        id={tooltipId}
        role="tooltip"
      >
        {tip}
        <span className="nb-term__arrow" />
      </span>
    </span>
  );
}
