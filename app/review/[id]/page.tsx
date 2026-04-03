import { getDesignById } from "../../../lib/studio-client";
import { ReviewPlayer } from "../../../components/review-player";
import { notFound } from "next/navigation";

interface ReviewPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ReviewPage({ params }: ReviewPageProps) {
  try {
    const resolvedParams = await params;
    const design = await getDesignById(resolvedParams.id);
    
    if (!design) return notFound();

    return (
      <main className="min-h-screen bg-black">
        <ReviewPlayer design={design} />
      </main>
    );
  } catch (error) {
    console.error("Strategic Review Sync Error:", error);
    return notFound();
  }
}
