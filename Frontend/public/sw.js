// Wake Me When — Service Worker
// Handles push notifications and plays alarm sound

self.addEventListener("push", (event) => {
  const data = event.data?.json() || {};
  const title = data.title || "⏰ Meeting starting soon";
  const options = {
    body:    data.body || "You have a meeting coming up",
    icon:    "/icon-192.png",
    badge:   "/icon-192.png",
    tag:     data.tag || "wmw-alarm",
    renotify: true,
    requireInteraction: true,   // stays on screen until dismissed
    vibrate: [500, 200, 500, 200, 500],  // buzz pattern
    data:    data,
    actions: [
      { action: "dismiss", title: "Dismiss" },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  if (event.action === "dismiss") return;

  // Focus or open the app
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      const app = list.find(c => c.url.includes("localhost") || c.url.includes("wakemewhen"));
      if (app) return app.focus();
      return clients.openWindow("/home");
    })
  );
});