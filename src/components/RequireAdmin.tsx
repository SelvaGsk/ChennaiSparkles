import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFirebase } from "@/Services/context";
import React from "react";
import { get, ref } from "firebase/database";
import { database } from "@/Services/Firebase.config.js";

const RequireAdmin = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { user } = useFirebase();

  const [setting, setSetting] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSetting = async () => {
      try {
        const settingRef = ref(database, "CSC/Settings");
        const snapshot = await get(settingRef);
        if (snapshot.exists()) {
          setSetting(snapshot.val());
        } else {
          console.log("No setting data available");
        }
      } catch (error) {
        console.error("Error fetching setting data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSetting();
  }, []);

  const adminEmails = useMemo(() => {
    const adminMailId = setting?.[0]?.adminMailId;
    return Array.isArray(adminMailId)
      ? adminMailId.map((e: string) => e.toLowerCase())
      : adminMailId
      ? adminMailId.toLowerCase().split("#")
      : [];
  }, [setting]);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/login");
        return;
      }

      console.log(setting);
      console.log(adminEmails);
      console.log(user.email);

      if (!user.email || !adminEmails.includes(user.email.toLowerCase())) {
        navigate("/unauthorized");
      }
    }
  }, [user, adminEmails, navigate, loading]);

  if (loading || !user || !user.email || !adminEmails.includes(user.email.toLowerCase())) {
    return <div>Loading settings...</div>;
  }

  return <>{children}</>;
};

export default RequireAdmin;
