import React from "react";
import { createRoot } from "react-dom/client";
import { CustomLogin } from "./components/auth/custom-login";

const loginRoot = document.getElementById("login-root");
if (loginRoot) {
    createRoot(loginRoot).render(<CustomLogin />);
}
