"use client";
import { useAppStore } from "@/app/store/appStore";
import apiClient from "@/lib/api";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const performLogin = useAppStore((state) => state.login);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    const loginResponse = await apiClient.loginUser(username, password);
    if (loginResponse.data) {
      const { accessToken, ...other } = loginResponse.data;

      performLogin(other);
      localStorage.setItem("accessToken", accessToken);

      setSuccess(true);
      setError(null);
      router.push("/");
    } else {
      setError(loginResponse.error);
      setSuccess(false);
    }
  }

  return (
    <div className="">
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input type="text" name="username" id="username" required />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" name="password" id="password" required />
        </div>
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
      {success && <p>Login successful!</p>}
    </div>
  );
}
