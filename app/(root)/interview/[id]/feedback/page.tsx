import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getFeedbackByInterviewId,
  getInterviewByID,
} from "@/lib/actions/general.action";
import { redirect } from "next/navigation";

const FeedbackPage = async ({ params }: RouteParams) => {
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
  return <div>page</div>;
};

export default FeedbackPage;
