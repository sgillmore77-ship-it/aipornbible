import type { Metadata } from "next";
import KeystaticApp from "./keystatic";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

const configured = process.env.NODE_ENV !== "production" || !!process.env.NEXT_PUBLIC_KEYSTATIC_CLOUD_PROJECT;

export default function KeystaticLayout() {
  if (!configured) {
    return (
      <div style={{ fontFamily: "system-ui, sans-serif", maxWidth: 560, margin: "80px auto", padding: "0 20px", lineHeight: 1.6 }}>
        <h1 style={{ fontSize: 24 }}>Dashboard not connected yet</h1>
        <p>
          Set the <code>NEXT_PUBLIC_KEYSTATIC_CLOUD_PROJECT</code> environment variable in Vercel to your Keystatic Cloud project
          (for example <code>your-team/aipornbible</code>) and redeploy. See the README for the steps.
        </p>
      </div>
    );
  }
  return <KeystaticApp />;
}
