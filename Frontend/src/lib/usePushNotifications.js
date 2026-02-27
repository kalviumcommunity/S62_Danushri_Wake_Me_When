import { useState, useEffect } from "react";
import API from "./api";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64  = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw     = atob(base64);
  return Uint8Array.from([...raw].map(c => c.charCodeAt(0)));
}

export function usePushNotifications() {
  const [supported,   setSupported]   = useState(false);
  const [permission,  setPermission]  = useState("default");
  const [subscribed,  setSubscribed]  = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState(null);

  useEffect(() => {
    const ok = "serviceWorker" in navigator && "PushManager" in window;
    setSupported(ok);
    if (!ok) return;
    setPermission(Notification.permission);

    // Check if already subscribed
    navigator.serviceWorker.ready.then(reg => {
      reg.pushManager.getSubscription().then(sub => {
        setSubscribed(!!sub);
      });
    });
  }, []);

  const enable = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get VAPID key
      const { data } = await API.get("/api/push/vapid-public-key");
      if (!data.key) throw new Error("Push not configured on server.");

      // Register service worker
      const reg = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      // Request permission
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== "granted") throw new Error("Notification permission denied.");

      // Subscribe to push
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly:      true,
        applicationServerKey: urlBase64ToUint8Array(data.key),
      });

      // Save to backend
      await API.post("/api/push/subscribe", { subscription: sub.toJSON() });
      setSubscribed(true);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const disable = async () => {
    setLoading(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await API.post("/api/push/unsubscribe", { endpoint: sub.endpoint });
        await sub.unsubscribe();
      }
      setSubscribed(false);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const test = async () => {
    setLoading(true);
    try {
      await API.post("/api/push/test");
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
    setLoading(false);
  };

  return { supported, permission, subscribed, loading, error, enable, disable, test };
}