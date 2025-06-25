"use client";

import apiClient from "@/lib/api/apiclient";
import { LOGIN_ROUTE } from "@/lib/router";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import FormInput from "@/app/components/FormComponents/FormInput";
import FormButton from "@/app/components/FormComponents/FormButton";
import FormAlert from "@/app/components/FormComponents/FormAlert";

export default function Register() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const registerResponse = await apiClient.auth.register(
        username,
        email,
        password
      );
      if (!registerResponse.error) {
        setSuccess(true);
        setError(null);

        setTimeout(() => {
          router.push(LOGIN_ROUTE);
        }, 2000);
      } else {
        setError(registerResponse.error);
        setSuccess(false);
      }
    } catch (err) {
      setError((err as Error).message ?? "An unexpected error occurred");
      setSuccess(false);
    } finally {
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
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: "var(--text-color)" }}
          >
            Join RudyClub
          </h1>
          <p style={{ color: "var(--secondary-color)" }}>
            Create your account to get started
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
              label="Username"
              name="username"
              type="text"
              required
              placeholder="Choose a username"
            />

            <FormInput
              label="Email Address"
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
              placeholder="Create a strong password"
            />

            {error && <FormAlert type="error" message={error} />}
            {success && (
              <FormAlert
                type="success"
                message="Registration successful! Redirecting to login..."
              />
            )}

            <FormButton
              type="submit"
              loading={loading}
              disabled={loading || success}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </FormButton>
          </form>

          {/* Divider */}
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

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm" style={{ color: "var(--secondary-color)" }}>
              Already have an account?{" "}
              <Link
                href={LOGIN_ROUTE}
                className="font-medium hover:underline transition-colors duration-200"
                style={{ color: "var(--primary-color)" }}
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs" style={{ color: "var(--muted-color)" }}>
            By creating an account, you agree to our Terms of Service and
            Privacy Policy(🤡)
          </p>
        </div>
      </div>
    </div>
  );
}
