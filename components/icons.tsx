type P = { className?: string };

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

export const SparkleIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z" />
    <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" />
    <path d="M5 15l.6 1.4L7 17l-1.4.6L5 19l-.6-1.4L3 17l1.4-.6z" />
  </svg>
);

export const DropIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 2.5c-.3 0-.6.2-.8.4C9.6 5 5.5 10.4 5.5 14.5a6.5 6.5 0 0013 0c0-4.1-4.1-9.5-5.7-11.6a1 1 0 00-.8-.4z" />
    <path d="M9.5 15.5a2.6 2.6 0 002.4 2.3" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" fill="none" />
  </svg>
);

export const ShieldCheckIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path d="M12 2l8 3v6c0 5-3.4 9.4-8 11-4.6-1.6-8-6-8-11V5z" fill="currentColor" />
    <path d="M8.5 12l2.4 2.4 4.6-4.8" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const LeafIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M5 19c0-9 6-14 15-15-1 9-6 15-15 15z" fill="currentColor" stroke="none" />
    <path d="M5 19c4-4 7-7 10-10" stroke="#fff" />
  </svg>
);

export const CheckCircleIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className}>
    <circle cx="12" cy="12" r="11" fill="currentColor" />
    <path d="M7 12.5l3.2 3.2L17 9" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const StarIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" />
  </svg>
);

export const TruckIcon = ({ className }: P) => (
  <svg viewBox="0 0 64 40" className={className} fill="currentColor">
    <rect x="0" y="8" width="10" height="3" rx="1.5" />
    <rect x="3" y="15" width="9" height="3" rx="1.5" />
    <rect x="0" y="22" width="11" height="3" rx="1.5" />
    <path d="M14 4h28v24H14z" />
    <path d="M44 12h9l8 9v7H44z" />
    <path d="M47 15h5l5 6h-10z" fill="#fff" />
    <circle cx="22" cy="31" r="6" />
    <circle cx="22" cy="31" r="2.5" fill="#fff" />
    <circle cx="52" cy="31" r="6" />
    <circle cx="52" cy="31" r="2.5" fill="#fff" />
    <path d="M24 10l-3 7h4l-2 6 6-8h-4l2-5z" fill="#fff" />
  </svg>
);

export const BadgeCheckIcon = ({ className }: P) => (
  <svg viewBox="0 0 48 52" className={className}>
    <path d="M24 2l20 7v15c0 13-8.6 22.4-20 26C12.6 46.4 4 37 4 24V9z" fill="#2e9d4a" />
    <path d="M24 7l15 5.3V24c0 10-6.4 17.4-15 20.4C15.4 41.4 9 34 9 24V12.3z" fill="#fff" />
    <path d="M24 10.5l12 4.2V24c0 8-5 14-12 16.6C17 38 12 32 12 24v-9.3z" fill="#3fb85b" />
    <path d="M17 25l5 5 10-11" stroke="#fff" strokeWidth="3.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CashHandIcon = ({ className }: P) => (
  <svg viewBox="0 0 56 52" className={className}>
    <rect x="22" y="4" width="26" height="15" rx="2" transform="rotate(-18 35 11)" fill="#f2b233" />
    <circle cx="35" cy="11" r="3.6" fill="#c2185b" />
    <rect x="16" y="12" width="26" height="15" rx="2" transform="rotate(8 29 19)" fill="#c2185b" />
    <circle cx="29" cy="19.5" r="3.6" fill="#fff" />
    <path d="M8 36c6-4 11-5 16-3l9 3c2 .7 2 3.5-.6 3.6H24l10 1.4 11-7c2.3-1.4 4.6 1.4 2.8 3.3L37 48H18l-10-3z" fill="#c2185b" />
    <rect x="1" y="33" width="7" height="16" rx="1.5" fill="#2e9d4a" />
  </svg>
);

export const CartIcon = ({ className }: P) => (
  <svg {...base} className={className} strokeWidth={2.2}>
    <path d="M2 3h3l2.6 12.2a2 2 0 002 1.6h8.8a2 2 0 002-1.5L22 7H6.2" />
    <path d="M9 10.5h10M10 13.5h8" />
    <circle cx="10" cy="20" r="1.6" fill="currentColor" />
    <circle cx="18" cy="20" r="1.6" fill="currentColor" />
  </svg>
);

export const ChevronRightIcon = ({ className }: P) => (
  <svg {...base} className={className} strokeWidth={3}>
    <path d="M9 5l7 7-7 7" />
  </svg>
);

export const PhoneIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 013 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z" />
  </svg>
);

export const WhatsAppIcon = ({ className }: P) => (
  <svg viewBox="0 0 32 32" className={className} fill="currentColor">
    <path d="M16 3a13 13 0 00-11.2 19.6L3 29l6.6-1.7A13 13 0 1016 3zm0 23.6c-2 0-4-.6-5.7-1.6l-.4-.2-3.9 1 1-3.8-.3-.4A10.6 10.6 0 1116 26.6zm5.8-7.9c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7 0a8.7 8.7 0 01-4.3-3.8c-.3-.6.3-.5.9-1.7.1-.2 0-.4 0-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 00-.9.4 3.7 3.7 0 00-1.1 2.7 6.4 6.4 0 001.3 3.4 14.6 14.6 0 005.6 5c2.1.9 2.9 1 4 .8a3.4 3.4 0 002.2-1.6 2.8 2.8 0 00.2-1.6c-.1-.1-.3-.2-.6-.4z" />
  </svg>
);

export const HeartIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 21s-7.5-4.6-9.6-9.3C1 8.4 3 5 6.4 5c2 0 3.3 1 4.1 2.2h3C14.3 6 15.6 5 17.6 5 21 5 23 8.4 21.6 11.7 19.5 16.4 12 21 12 21z" />
  </svg>
);
