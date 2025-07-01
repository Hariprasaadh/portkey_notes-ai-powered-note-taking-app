"use client";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const TOAST_MESSAGES: Record<string, string> = {
  login: "Successfully logged in!",
  signUp: "Check your email for confirmation link",
  newNote: "New note created!",
  logOut: "Successfully logged out!",
};

function HomeToast() {
  const toastType = useSearchParams().get("toastType");

  const removeUrlParam = () => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.delete("toastType");
    const newUrl = `${window.location.pathname}${searchParams.toString() ? `?${searchParams}` : ""}`;
    window.history.replaceState({}, "", newUrl);
  };

  useEffect(() => {
    if (toastType && TOAST_MESSAGES[toastType]) {
      toast.success(TOAST_MESSAGES[toastType]);
      removeUrlParam();
    }
  }, [toastType]);

  return null;
}

export default HomeToast;