"use client";
import { Button } from "./ui/button";
const SubmitButton = ({
  isSignIn,
  isSubmitting,
}: {
  isSignIn: boolean;
  isSubmitting: boolean;
}) => {
  return (
    <Button type="submit" className="btn" disabled={isSubmitting}>
      {isSubmitting
        ? isSignIn
          ? "Signing In..."
          : "Signing Up..."
        : isSignIn
        ? "Sign In"
        : "Sign Up"}
    </Button>
  );
};

export default SubmitButton;
