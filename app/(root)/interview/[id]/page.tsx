import {
  getFeedbackByInterviewId,
  getInterviewByID,
} from "@/lib/actions/general.action";
import { redirect } from "next/navigation";
import Image from "next/image";
import { getCurrentUser } from "@/lib/actions/auth.action";
import Agent from "@/components/Agent";
import DisplayTechIcons from "@/components/DisplayTechIcons";
const InterviewDetailsPage = async ({ params }: RouteParams) => {
  const { id } = await params;
  const user = await getCurrentUser();

  const interview = await getInterviewByID(id);

  if (!interview) {
    redirect("/");
  }

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id as string,
  });
  return (
    <>
      <div className="flex flex-row gap-4 justify-between">
        <div className="flex flex-row gap-4 items-center max-sm:flex-col">
          <div className="flex flex-row gap-4 items-center">
            <Image
              src="/covers/adobe.png"
              alt="cover-image"
              width={40}
              height={40}
              className="rounded-full object-cover size-[40px]"
            />
            <h3 className="capitalize">{interview.role} Interview</h3>
          </div>

          <DisplayTechIcons techStack={interview.techstack} />
        </div>

        <p className="bg-dark-200 px-4 py-2 rounded-lg h-fit">
          {interview.type}
        </p>
      </div>

      <Agent
        userName={user?.name as string}
        userId={user?.id}
        interviewId={id}
        type="interview"
        questions={interview.questions}
        feedbackId={feedback?.id}
      />
    </>
  );
};

export default InterviewDetailsPage;
