"use client";

import { useAppStore } from "@/app/store/appStore";
import apiClient from "@/lib/api";
import { REGISTER_ROUTE, FEEDS_ROUTE } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import Link from "next/link";
import { LogIn } from "lucide-react";
import FormInput from "@/app/components/ui/FormComponents/FormInput";
import FormButton from "@/app/components/ui/FormComponents/FormButton";
import FormAlert from "@/app/components/ui/FormComponents/FormAlert";

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const performLogin = useAppStore((state) => state.login);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    console.log("Login attempt with:", { email, password: "***" });

    try {
      const loginResponse = await apiClient.loginUser(email, password);
      console.log("Login response:", loginResponse);

      if (loginResponse.data) {
        const { accessToken, ...other } = loginResponse.data;
        console.log("Login successful, storing token and user data");
        performLogin(other);
        console.log(other);
        localStorage.setItem("accessToken", accessToken);
        setSuccess(true);
        setError(null);
        setTimeout(() => {
          router.push(FEEDS_ROUTE);
        }, 1000);
      } else {
        console.log("Login failed:", loginResponse.error);
        setError(loginResponse.error);
        setSuccess(false);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError((err as Error).message ?? "An unexpected error occurred");
      setSuccess(false);
    } finally {
      console.log("Setting loading to false");
      setLoading(false);
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
            {success && (
              <FormAlert
                type="success"
                message="Login successful! Redirecting..."
              />
            )}

            <FormButton
              type="submit"
              loading={loading}
              disabled={loading || success}
            >
              {loading ? "Signing in..." : "Sign In"}
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
