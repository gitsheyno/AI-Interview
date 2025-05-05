import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { dummyInterviews } from "@/constants";
import InterviewCard from "@/components/InterviewCard";
import {
  getCurrentUser,
  getInterviewByUserId,
  getLatestInterviews,
} from "@/lib/actions/auth.action";
export default async function Home() {
  const user = await getCurrentUser();

  const [userInterviews, latestInterviews] = await Promise.all([
    await getInterviewByUserId(user?.id as string),
    await getLatestInterviews({
      userId: user?.id as string,
    }),
  ]);

  const hasPastIntervoews = userInterviews && userInterviews?.length > 0;
  const hasUpCommingInterviews =
    latestInterviews && latestInterviews?.length > 0;
  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Get Interview ready with AI power</h2>
          <p className="text-lg">
            Practsie your interviews with your AI assistant. Get instant
            feedback
          </p>
          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview">Strart an Interview</Link>
          </Button>
        </div>
        <Image
          src="/robot.png"
          alt="robot"
          width={400}
          height={400}
          className="max-sm:hidden"
        />
      </section>
      <section className="flex flex-col gap-6 mt-8">
        <h2>Your Interviews</h2>
        <div className="interviews-section">
          {hasPastIntervoews ? (
            userInterviews.map((interview) => (
              <InterviewCard key={interview.id} {...interview} />
            ))
          ) : (
            <p>You haven&apos;t taken any interviews yet</p>
          )}
        </div>
      </section>
      <section className="flex flex-col gap-6 mt-8">
        <h2>Take an Interview</h2>
        <div className="interviews-section">
          {hasUpCommingInterviews ? (
            latestInterviews.map((interview) => (
              <InterviewCard key={interview.id} {...interview} />
            ))
          ) : (
            <p>You haven&apos;t taken any interviews yet</p>
          )}
        </div>
      </section>
    </>
  );
}
