import Link from "next/link";

export default function AgentNotFound() {
  return (
    <div className="space-y-6 text-center">
      <h1 className="text-xl font-medium text-zinc-100">Agent not found</h1>
      <p className="text-sm text-zinc-500">This ID does not exist or was removed.</p>
      <Link
        href="/"
        className="inline-block text-sm text-zinc-400 transition-colors duration-200 hover:text-zinc-100"
      >
        ← Back to agents
      </Link>
    </div>
  );
}
