import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const EASE = "cubic-bezier(0.23, 1, 0.32, 1)";
const DRAWER = "cubic-bezier(0.32, 0.72, 0, 1)";

export function AnnouncementBanner({
  open,
  onDismiss,
  type = "success",
  children,
}) {
  const [shown, setShown] = useState(open);
  const [firstShow, setFirstShow] = useState(true);
  
  if (open !== shown) {
    setShown(open);
    if (!open) setFirstShow(false);
  }

  const rows = open
    ? `grid-template-rows 280ms ${DRAWER}`
    : `grid-template-rows 240ms ${DRAWER} 80ms`;

  const content = open
    ? firstShow
      ? `translate 280ms ${DRAWER}, opacity 200ms ${EASE}, filter 200ms ${EASE}`
      : `opacity 200ms ${EASE} 120ms, filter 200ms ${EASE} 120ms`
    : `opacity 120ms ${EASE}, filter 120ms ${EASE}`;

  // bg-green-500 or bg-red-500 or just bg-highlight
  const bgClass = type === 'error' ? 'bg-red-500' : 'bg-highlight';

  return (
    <div
      className="grid w-full relative z-50 pt-2 px-6 max-w-5xl mx-auto"
      style={{ gridTemplateRows: open ? "1fr" : "0fr", transition: rows, marginTop: open ? 0 : 0 }}
    >
      <div className="min-h-0 overflow-hidden">
        <section
          inert={!open ? "true" : undefined}
          className={`pointer-events-auto flex h-11 items-center gap-2.5 ${bgClass} rounded-lg pr-1.5 pl-4 text-sm text-bg-main outline-none shadow-lg`}
          style={{
            opacity: open ? 1 : 0,
            filter: open ? "blur(0px)" : "blur(2px)",
            translate: !open && firstShow ? "0 -100%" : "0 0",
            transition: content,
          }}
        >
          <span aria-hidden="true" className="flex shrink-0">
            {type === 'error' ? (
               <i className="fas fa-exclamation-circle"></i>
            ) : (
               <i className="fas fa-check-circle"></i>
            )}
          </span>
          <p className="min-w-0 font-medium truncate">{children}</p>
          <button
            type="button"
            aria-label="Dismiss announcement"
            onClick={onDismiss}
            className="relative ml-auto flex h-8 w-8 shrink-0 touch-manipulation items-center justify-center rounded-full text-bg-main/70 outline-none transition-[scale,color,background-color] duration-150 ease-out select-none hover:bg-bg-main/15 hover:text-bg-main active:scale-[0.96] after:absolute after:-inset-1 after:rounded-full"
          >
            <svg
              viewBox="0 0 16 16"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="m4.5 4.5 7 7M11.5 4.5l-7 7" />
            </svg>
          </button>
        </section>
      </div>
    </div>
  );
}

// Global Banner Manager
export function GlobalBanner() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("success");
  const timerRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const handleShowBanner = (e) => {
      setMessage(e.detail.message);
      setType(e.detail.type || "success");
      setOpen(true);
      
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setOpen(false);
      }, 5000); // auto dismiss after 5s
    };

    window.addEventListener("show-banner", handleShowBanner);
    return () => window.removeEventListener("show-banner", handleShowBanner);
  }, []);

  // Optionally dismiss on route change
  useEffect(() => {
    setOpen(false);
  }, [location]);

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] pointer-events-none">
      <div className="pointer-events-none pt-20">
        <AnnouncementBanner open={open} onDismiss={() => setOpen(false)} type={type}>
          {message}
        </AnnouncementBanner>
      </div>
    </div>
  );
}

export const showBanner = (message, type = 'success') => {
  window.dispatchEvent(new CustomEvent('show-banner', { detail: { message, type } }));
};




