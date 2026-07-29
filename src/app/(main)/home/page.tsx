"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

type UserProfile = {
  full_name?: string;
  email?: string;
  id?: string;
  [key: string]: unknown;
};

export default function HomePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const getUser = async () => {
      try {
        const { data } = await api.get("/getUser");
        const parsedData = typeof data === "string" ? JSON.parse(data) : data;

        if (isMounted) {
          setUser(parsedData as UserProfile | null);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    getUser();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{user?.full_name ?? "No profile found"}</h2>
      <p>{user?.email ?? "No email available"}</p>
      <p>{user?.id ?? "No Id available"}</p>
    </div>
  );
}