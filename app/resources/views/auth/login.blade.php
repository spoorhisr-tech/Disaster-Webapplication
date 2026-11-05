<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full bg-slate-50 dark:bg-zinc-950">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Sign In - Disaster Relief Command Portal</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                    },
                }
            }
        }
    </script>
</head>
<body class="h-full font-sans antialiased text-slate-900 dark:text-slate-100">
    <div id="login-root">
        <!-- Modern Server-rendered Fallback / Initial State -->
        <div class="flex min-h-screen items-center justify-center p-4">
            <div class="w-full max-w-md rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-xl">
                <div class="text-center space-y-2 mb-6">
                    <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-600 text-white shadow-md">
                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                        </svg>
                    </div>
                    <h1 class="text-2xl font-bold tracking-tight">Disaster Response Portal</h1>
                    <p class="text-sm text-slate-500 dark:text-zinc-400">
                        Sign in to your <span class="font-semibold text-slate-800 dark:text-zinc-200">Admin</span> or <span class="font-semibold text-slate-800 dark:text-zinc-200">Organization</span> account
                    </p>
                </div>

                <div id="alert-box" class="hidden mb-4 p-3 rounded-lg text-sm"></div>

                <form id="login-form" class="space-y-4">
                    <div>
                        <label for="email" class="block text-sm font-medium mb-1">Email Address</label>
                        <input id="email" type="email" required placeholder="coordinator@redcross.org"
                            class="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-zinc-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
                    </div>

                    <div>
                        <label for="password" class="block text-sm font-medium mb-1">Password</label>
                        <input id="password" type="password" required placeholder="••••••••"
                            class="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-zinc-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
                    </div>

                    <div class="rounded-lg bg-slate-50 dark:bg-zinc-800/50 p-3 text-xs text-slate-500 dark:text-zinc-400 border border-slate-100 dark:border-zinc-800">
                        <div class="flex items-center gap-1.5 font-medium text-slate-700 dark:text-zinc-300 mb-0.5">
                            <svg class="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                            </svg>
                            <span>Organization & Authority Gateway</span>
                        </div>
                        Authorized access for relief coordinators, hospital triage units, and emergency managers.
                    </div>

                    <button type="submit" id="submit-btn"
                        class="w-full h-10 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg text-sm shadow transition-colors flex items-center justify-center">
                        Sign In to Command Portal
                    </button>
                </form>

                <p class="text-center text-xs text-slate-400 mt-6">
                    Volunteers: Please use the offline-capable mobile Android app.
                </p>
            </div>
        </div>
    </div>

    <script>
        const form = document.getElementById('login-form');
        const alertBox = document.getElementById('alert-box');
        const submitBtn = document.getElementById('submit-btn');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            alertBox.className = 'hidden';
            submitBtn.disabled = true;
            submitBtn.textContent = 'Authenticating...';

            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({
                        email: document.getElementById('email').value,
                        password: document.getElementById('password').value,
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Invalid credentials.');
                }

                if (data.token) {
                    localStorage.setItem('auth_token', data.token);
                    localStorage.setItem('auth_user', JSON.stringify(data.user));
                }

                alertBox.textContent = `Welcome back, ${data.user.name} (${data.user.role?.toUpperCase()})! Redirecting...`;
                alertBox.className = 'mb-4 p-3 rounded-lg text-sm bg-emerald-50 text-emerald-700 border border-emerald-200 block';

                setTimeout(() => {
                    window.location.href = '/';
                }, 1000);

            } catch (err) {
                alertBox.textContent = err.message || 'Login failed.';
                alertBox.className = 'mb-4 p-3 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200 block';
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Sign In to Command Portal';
            }
        });
    </script>
</body>
</html>

