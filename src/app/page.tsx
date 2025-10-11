"use client";

import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Icon } from "../components/ui";

export default function Home() {
  const { isAuthenticated, isLoading, signIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-black">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <Card className="max-w-md w-full" padding="lg">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center mx-auto mb-4">
            <Icon name="loading" size="lg" className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-black mb-2">
            Plantify Admin
          </h1>
          <p className="text-black">Sign in to access the admin dashboard</p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={signIn}
            variant="primary"
            size="lg"
            className="w-full"
          >
            Sign in with Internet Identity
          </Button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-black">
            Secure authentication powered by Internet Computer
          </p>
        </div>
      </Card>
    </div>
  );
}
