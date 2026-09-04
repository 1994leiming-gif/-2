export function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 19 19 5M8 5h11v11" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function MenuIcon({ open = false }: { open?: boolean }) {
  return (
    <span aria-hidden="true" data-open={open}>
      <i />
      <i />
    </span>
  );
}

export function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m5 5 14 14M19 5 5 19" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
