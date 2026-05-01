import Link from "next/link";
import { ReviewForm } from "@/components/ReviewForm";

type Props = { params: { id: string } };

export default function ReviewPage({ params }: Props) {
  const { id } = params;
  return (
    <div className="mx-auto max-w-md space-y-8">
      <div className="space-y-3">
        <Link
          href={`/agents/${id}`}
          className="inline-block text-sm text-zinc-500 transition-colors duration-200 hover:text-zinc-300"
        >
          ← Back to profile
        </Link>
        <div className="space-y-2">
          <h1 className="text-2xl font-medium tracking-tight text-zinc-50">Leave a review</h1>
          <p className="text-sm text-zinc-400">Score, comment, and sign with NEAR wallet.</p>
        </div>
      </div>
      <ReviewForm agentId={id} />
    </div>
  );
}
