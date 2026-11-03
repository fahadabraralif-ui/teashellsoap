// Tailwind styles only for the public site; the admin panel brings its own CSS.
import "../globals.css";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return children;
}
