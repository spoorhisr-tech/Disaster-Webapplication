import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Activity, Building2, Lock, Mail, Loader2, AlertCircle } from "lucide-react";

export function CustomLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successUser, setSuccessUser] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials. Please verify your email and password.");
      }

      // Store Sanctum Bearer Token
      if (data.token) {
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("auth_user", JSON.stringify(data.user));
      }

      setSuccessUser(data.user);

      // Redirect after brief delay
      setTimeout(() => {
        window.location.href = "/";
      }, 1200);
    } catch (err) {
      setError(err.message || "Failed to log in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-lg border-border/80">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/20">
            <Activity className="size-8 stroke-[2.5]" />
          </div>
          <div className="pt-1">
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Disaster Relief Management
            </CardTitle>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Emergency Operations Command
            </p>
          </div>
          <CardDescription className="text-xs pt-1">
            Sign in to your <span className="font-semibold text-foreground">Admin</span> or{" "}
            <span className="font-semibold text-foreground">Organization (NGO / Hospital)</span> account
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="size-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {successUser && (
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-600 dark:text-emerald-400">
                Welcome back, <strong>{successUser.name}</strong> ({successUser.role?.toUpperCase()})! Redirecting...
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-1.5">
                <Mail className="size-3.5 text-muted-foreground" /> Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="coordinator@redcross.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="flex items-center gap-1.5">
                  <Lock className="size-3.5 text-muted-foreground" /> Password
                </Label>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="rounded-lg bg-blue-50/60 dark:bg-blue-950/20 p-3 text-xs text-muted-foreground border border-blue-100 dark:border-blue-900/40">
              <div className="flex items-center gap-2 font-medium text-blue-900 dark:text-blue-300">
                <Building2 className="size-4 text-blue-600" />
                <span>Organization & Authority Gateway</span>
              </div>
              <p className="mt-1">
                Authorized for relief coordinators, hospital triage teams, and municipal emergency directors.
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button
              type="submit"
              className="w-full font-semibold shadow-sm bg-blue-600 hover:bg-blue-700 text-white"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" /> Authenticating...
                </>
              ) : (
                "Sign In to Command Portal"
              )}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Volunteers: Please use the offline-capable mobile Android app.
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default CustomLogin;

