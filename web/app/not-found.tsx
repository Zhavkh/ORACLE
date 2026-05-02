import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-9xl font-bold tracking-tighter text-zinc-100">404</h1>
      <h2 className="mt-4 text-2xl font-medium tracking-tight text-zinc-300">
        Page not found
      </h2>
      <p className="mt-2 text-sm text-zinc-500">
        The page you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-lg border border-[#00ec97]/70 bg-[#00ec97] px-6 py-2.5 text-sm font-semibold text-black transition-all duration-200 hover:brightness-110"
      >
        Go Home
      </Link>
    </div>
  );
}
