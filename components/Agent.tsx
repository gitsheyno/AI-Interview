"use client";
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";
import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

const Agent = ({
  userName,
  userId,
  type,
  interviewId,
  questions,
}: AgentProps) => {
  const router = useRouter();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);

  useEffect(() => {
    const onCallsatrt = () => {
      console.log("call started");
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      console.log("call ended");
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message: Message) => {
      console.log(message, "message");
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };

        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeachstart = () => {
      console.log("speach started");
      setIsSpeaking(true);
    };

    const onSpeachEnd = () => {
      console.log("speach ended");
      setIsSpeaking(false);
    };

    const onError = (error: Error) => {
      console.log(error.message, "error");
    };

    vapi.on("call-start", onCallsatrt);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeachstart);
    vapi.on("speech-end", onSpeachEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallsatrt);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeachstart);
      vapi.off("speech-end", onSpeachEnd);
      vapi.on("error", onError);
    };
  }, []);

  const handleGenerateFeedback = async (messages: SavedMessage[]) => {
    console.log("handleGenerateFeedback", messages);

    const feedbackResponse = await createFeedback({
      interviewId: interviewId!,
      userId: userId!,
      transcript: messages,
    });

    if (!feedbackResponse) {
      console.log("Error generating feedback");
      router.push("/");
      return;
    }

    const { success, feedbackId: id } = feedbackResponse;

    if (success && id) {
      router.push(`/interview/${interviewId}/feedback`);
    } else {
      console.log("Error generating feedback");
      router.push("/");
    }
  };

  useEffect(() => {
    if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        router.push("/");
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [callStatus, messages, userId, type]);

  const handleCall = async () => {
    console.log("call started", messages, callStatus);
    setCallStatus(CallStatus.CONNECTING);
    if (type === "generate") {
      await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
        variableValues: {
          username: userName,
          userid: userId,
        },
      });
    } else {
      let formattedQuestions = "";
      if (questions) {
        formattedQuestions = questions
          .map((question) => `- ${question}`)
          .join("\n");
      }

      await vapi.start(interviewer, {
        variableValues: {
          username: userName,
          userid: userId,
          interviewId: interviewId,
          questions: formattedQuestions,
        },
      });
    }
  };
  const handleDisconnect = async () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  const lastestMessage = messages[messages.length - 1]?.content;
  const isCallInactiveOrFinished =
    callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;

  console.log(CallStatus, "callStatus");
  return (
    <>
      <div className="call-view">
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              className="object-cover"
              src="/ai-avatar.png"
              alt="vapi"
              width={65}
              height={54}
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>AI Interviewer</h3>
        </div>
        <div className="card-border">
          <div className="card-content">
            <Image
              className="rounded-full object-cover size-[120px]"
              src="/user-avatar.png"
              alt="user-avatar"
              width={540}
              height={540}
            />
            <h3>{userName}</h3>
          </div>
        </div>
      </div>
      {messages.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p
              key={lastestMessage}
              className={cn(
                "transition-opacity duration-500 opacity-0",
                "animate-fadeIn opacity-100"
              )}
            >
              {lastestMessage}
            </p>
          </div>
        </div>
      )}
      <div className="w-full flex justify-center">
        {callStatus !== "ACTIVE" ? (
          <button className="relative btn-call" onClick={handleCall}>
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75",
                callStatus !== "CONNECTING" && "hidden"
              )}
            />

            <span>{isCallInactiveOrFinished ? "Call" : " ..."}</span>
          </button>
        ) : (
          <button onClick={handleDisconnect} className="btn-disconnect">
            END
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;
