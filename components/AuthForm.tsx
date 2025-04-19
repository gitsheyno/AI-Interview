"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import FormFieldCustom from "./FormFieldCustom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/firebase/client";
import { sign } from "crypto";
import { signUp } from "@/lib/actions/auth.action";
type AuthFormProps = {
  type: "sign-in" | "sign-up";
};

const authFormSchema = (type: "sign-in" | "sign-up") => {
  return z.object({
    name:
      type === "sign-up"
        ? z.string().min(1, "Name is required")
        : z.string().optional(),
    email: z.string().min(1, "Email is required").email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });
};

const AuthForm = ({ type }: AuthFormProps) => {
  const navigate = useRouter();
  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);

    try {
      if (type === "sign-in") {
        toast.success("Sign-in successfully");
        navigate.push("/");
        console.log("Signing up with", values);
      } else {
        const { name, email, password } = values;

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const result = await signUp({
          uid: userCredential.user.uid,
          name: name!,
          email,
          password,
        });

        if (!result?.success) {
          toast.error(result?.message);
          return;
        }
        toast.success("Account created successfully");
        navigate.push("/sign-in");
        console.log("Signing in with", values);
      }
    } catch (error) {
      console.error("Error during authentication", error);
      toast.error(`An error occurred during authentication ${error}`);
    }
  }

  const isSignIn = type === "sign-in";

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image alt="logo" src="/logo.svg" height={32} width={38} />
          <h2 className="text-primary-100">WiselyPrep</h2>
        </div>
        <h3>Practive you interviews with you Assistence</h3>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form"
          >
            {!isSignIn && (
              <FormFieldCustom
                control={form.control}
                name="name"
                label="name"
                placeholder="Your Name"
              />
            )}
            <FormFieldCustom
              control={form.control}
              name="email"
              label="Email"
              placeholder="Your Email"
            />
            <FormFieldCustom
              control={form.control}
              name="password"
              label="Password"
              type="password"
              placeholder="Your Password"
            />
            <Button type="submit" className="btn">
              {isSignIn ? "Sign In" : "Sign Up"}
            </Button>
          </form>
        </Form>
        <p className="text-center">
          {isSignIn ? "Don't have an account?" : "Have an account already?"}
          <Link
            href={isSignIn ? "/sign-up" : "/sign-in"}
            className="font-bold text-user-primary ml-1"
          >
            {isSignIn ? "Sign-up" : "Sign-in"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
