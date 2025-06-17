import Feeds from "./Feeds";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LOGIN_ROUTE } from "@/lib/constants";

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (!token) {
    redirect(LOGIN_ROUTE);
  }

  return (
    <main>
      <Feeds />
    </main>
  );
}
