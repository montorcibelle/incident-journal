import { Link, useLocation } from "react-router";

const ctaClass =
  "inline-flex shrink-0 items-center rounded-lg bg-purple-700 px-4 py-2 font-mono text-sm font-semibold text-white transition-colors hover:bg-purple-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-700";

export default function Nav() {
  const { pathname } = useLocation();
  const onNewPage = pathname === "/new";

  return (
    <nav className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="truncate text-lg font-bold text-stone-900">
          Incident Journal
        </Link>

        {onNewPage ? (
          <Link to="/" className={ctaClass}>
            <span aria-hidden="true" className="mr-1">←</span>
            Back to incidents
          </Link>
        ) : (
          <Link to="/new" className={ctaClass}>
            Add new Incident
          </Link>
        )}
      </div>
    </nav>
  );
}
