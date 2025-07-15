import { useEffect, useState } from "react";
import { UserProfile } from "@/types";

export const useUserProfile = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(
          "https://linked-posts.routemisr.com/users/profile-data",
          { headers: { token } }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch profile");
        setUser(data.user);
      } catch (err) {
        console.error("Fetch user error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, setUser, loading };
};
