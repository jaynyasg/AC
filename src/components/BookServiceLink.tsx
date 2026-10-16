import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { BOOK_FORM_PATH } from "../../shared/routes";

/** Scroll the booking form below the fixed header. */
export function scrollBookFormIntoView() {
  const form = document.getElementById("book-form");
  if (!form) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  form.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
}

/**
 * Opens /book with the form in view. Clicking again while the form is already
 * the target still scrolls, because the hash does not change.
 */
export function BookServiceLink({
  className,
  children,
  onClick,
}: {
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  const { pathname } = useLocation();

  return (
    <Link
      className={className}
      to={BOOK_FORM_PATH}
      onClick={() => {
        onClick?.();
        if (pathname === "/book") requestAnimationFrame(() => scrollBookFormIntoView());
      }}
    >
      {children}
    </Link>
  );
}
