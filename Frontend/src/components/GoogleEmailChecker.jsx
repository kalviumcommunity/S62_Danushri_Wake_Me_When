// import React, { useEffect, useState } from "react";

// const CLIENT_ID = "804707996958-40dubi6g56q5djdu4vc0kf6qsnp12a22.apps.googleusercontent.com";

// const GoogleEmailChecker = () => {
//   const [email, setEmail] = useState("");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     // Dynamically load the Google Identity Services script
//     const script = document.createElement("script");
//     script.src = "https://accounts.google.com/gsi/client";
//     script.async = true;
//     script.defer = true;
//     document.body.appendChild(script);

//     script.onload = () => {
//       window.google.accounts.id.initialize({
//         client_id: CLIENT_ID,
//         callback: handleCredentialResponse,
//       });

//       window.google.accounts.id.renderButton(
//         document.getElementById("sign-in-button"),
//         { theme: "outline", size: "large" }
//       );
//     };
//   }, []);

//   const handleCredentialResponse = async (response) => {
//     const { credential } = response;
//     try {
//       const userInfo = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
//         headers: {
//           Authorization: `Bearer ${credential}`,
//         },
//       });

//       if (!userInfo.ok) throw new Error("Failed to fetch user info");

//       const data = await userInfo.json();
//       setEmail(data.email);
//       setError("");
//     } catch (err) {
//       console.error("Error:", err);
//       setEmail("");
//       setError("Failed to get email");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center space-y-4">
//         <h1 className="text-2xl font-bold text-gray-800">Check Your Google Email</h1>
//         <div id="sign-in-button"></div>
//         {email && <p className="text-green-700 text-lg mt-4">Signed in as: {email}</p>}
//         {error && <p className="text-red-600">{error}</p>}
//       </div>
//     </div>
//   );
// };

// export default GoogleEmailChecker;
