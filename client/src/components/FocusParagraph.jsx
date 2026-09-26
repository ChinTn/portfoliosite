import React, { Fragment, useRef, useState } from "react";

export function FocusParagraph({
  sentences,
  active: activeProp,
  className = "",
}) {
  const [hovered, setActive] = useState(null);
  const active = activeProp === undefined ? hovered : activeProp;
  const focused = useRef(null);

  return (
    <p
      className={`leading-relaxed text-pretty ${className}`}
      onPointerLeave={(e) => {
        if (e.pointerType === "touch") return;
        setActive(focused.current);
      }}
      onBlur={(e) => {
        if (e.currentTarget.contains(e.relatedTarget)) return;
        focused.current = null;
        setActive(null);
      }}
    >
      {sentences.map((sentence, i) => (
        <Fragment key={i}>
          {i > 0 && " "}
          <span
            tabIndex={0}
            data-state={active === null ? "idle" : active === i ? "focus" : "dim"}
            onPointerEnter={(e) => {
              if (e.pointerType !== "touch") setActive(i);
            }}
            onPointerUp={(e) => {
              if (e.pointerType === "touch") setActive((a) => (a === i ? null : i));
            }}
            onFocus={(e) => {
              if (!e.currentTarget.matches(":focus-visible")) return;
              focused.current = i;
              setActive(i);
            }}
            className="rounded-[3px] box-decoration-clone outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-text-main/40 transition-[opacity,filter] ease-[cubic-bezier(0.23,1,0.32,1)] data-[state=dim]:opacity-40 data-[state=dim]:blur-[0.6px] data-[state=dim]:duration-300 data-[state=focus]:duration-200 data-[state=idle]:duration-300"
          >
            {sentence}
          </span>
        </Fragment>
      ))}
    </p>
  );
}
