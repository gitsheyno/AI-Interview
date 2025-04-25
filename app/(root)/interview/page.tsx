import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";
const InterviewPage = async () => {
  const user = await getCurrentUser();
  return (
    <>
      <h3>Interview genertion</h3>
      <Agent
        userName={user?.name as string}
        userId={user?.id}
        type="generate"
      />
    </>
  );
};

export default InterviewPage;
