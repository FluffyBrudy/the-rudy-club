"use client";

import { useAppStore } from "@/app/store/appStore";
import apiClient from "@/lib/api";
import { REGISTER_ROUTE } from "@/lib/router";
import { type FormEvent, useState } from "react";
import Link from "next/link";
import { LogIn } from "lucide-react";
import FormInput from "@/app/components/FormComponents/FormInput";
import FormButton from "@/app/components/FormComponents/FormButton";
import FormAlert from "@/app/components/FormComponents/FormAlert";

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const performLogin = useAppStore((state) => state.login);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const loginResponse = await apiClient.loginUser(email, password);

      if (loginResponse.data) {
        const { accessToken, ...other } = loginResponse.data;
        performLogin(other);
        localStorage.setItem("accessToken", accessToken);
        setLoginSuccess(true);
        setError(null);
        window.location.reload();
      } else {
        setError(loginResponse.error);
        setLoginSuccess(false);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError((err as Error).message ?? "An unexpected error occurred");
      setLoginSuccess(false);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
            style={{ backgroundColor: "var(--primary-color)" }}
          >
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: "var(--text-color)" }}
          >
            Welcome Back
          </h1>
          <p style={{ color: "var(--secondary-color)" }}>
            Sign in to your account to continue
          </p>
        </div>

        <div
          className="p-8 rounded-2xl shadow-xl backdrop-blur-sm"
          style={{
            backgroundColor: "var(--card-bg)",
            border: "1px solid var(--border-color)",
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput
              label="Email"
              name="email"
              type="email"
              required
              placeholder="Enter your email"
            />

            <FormInput
              label="Password"
              name="password"
              type="password"
              required
              placeholder="Enter your password"
            />

            {error && <FormAlert type="error" message={error} />}
            {loginSuccess && (
              <FormAlert
                type="success"
                message="Login loginSuccessful! Redirecting..."
              />
            )}

            <FormButton
              type="submit"
              loading={isLoading}
              disabled={isLoading || loginSuccess}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </FormButton>
          </form>

          <div className="my-6 flex items-center">
            <div
              className="flex-1 h-px"
              style={{ backgroundColor: "var(--border-color)" }}
            ></div>
            <span
              className="px-4 text-sm"
              style={{ color: "var(--muted-color)" }}
            >
              or
            </span>
            <div
              className="flex-1 h-px"
              style={{ backgroundColor: "var(--border-color)" }}
            ></div>
          </div>

          <div className="text-center">
            <p className="text-sm" style={{ color: "var(--secondary-color)" }}>
              {"Don't"} have an account?{" "}
              <Link
                href={REGISTER_ROUTE}
                className="font-medium hover:underline transition-colors duration-200"
                style={{ color: "var(--primary-color)" }}
              >
                Create one here
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-xs" style={{ color: "var(--muted-color)" }}>
            By signing in, you agree to our Terms of Service and Privacy
            Policy(🤡)
          </p>
        </div>
      </div>
    </div>
  );
}
