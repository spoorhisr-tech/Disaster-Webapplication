<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full bg-slate-50 dark:bg-zinc-950">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Sign In - Disaster Relief Management</title>
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
                    <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/20">
                        <svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M3 12h4l2 2 2.5-8 3 14 2.5-8H21"/>
                        </svg>
                    </div>
                    <div class="pt-1">
                        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Disaster Relief Management</h1>
                        <p class="text-sm font-medium text-slate-500 dark:text-slate-400">Emergency Operations Command</p>
                    </div>
                    <p class="text-xs text-slate-500 dark:text-zinc-400 pt-1">
                        Sign in to your <span class="font-semibold text-slate-800 dark:text-zinc-200">Admin</span> or <span class="font-semibold text-slate-800 dark:text-zinc-200">Organization</span> account
                    </p>
                </div>

                <div id="alert-box" class="hidden mb-4 p-3 rounded-lg text-sm"></div>

                <form id="login-form" class="space-y-4">
                    <div>
                        <label for="email" class="block text-sm font-medium mb-1">Email Address</label>
                        <input id="email" type="email" required placeholder="coordinator@redcross.org"
                            class="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-zinc-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>

                    <div>
                        <label for="password" class="block text-sm font-medium mb-1">Password</label>
                        <input id="password" type="password" required placeholder="••••••••"
                            class="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-zinc-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>

                    <div class="rounded-lg bg-blue-50/60 dark:bg-blue-950/20 p-3 text-xs text-slate-600 dark:text-zinc-400 border border-blue-100 dark:border-blue-900/40">
                        <div class="flex items-center gap-1.5 font-medium text-blue-900 dark:text-blue-300 mb-0.5">
                            <svg class="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                            </svg>
                            <span>Organization & Authority Gateway</span>
                        </div>
                        Authorized access for relief coordinators, hospital triage units, and emergency managers.
                    </div>

                    <button type="submit" id="submit-btn"
                        class="w-full h-10 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium rounded-lg text-sm shadow transition-colors flex items-center justify-center">
                        Sign In to Command Portal
                    </button>
                </form>

                <div class="mt-5 pt-4 border-t border-slate-100 dark:border-zinc-800">
                    <p class="text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-2 text-center">Quick Fill Demo Accounts:</p>
                    <div class="grid grid-cols-2 gap-2">
                        <button type="button" onclick="fillCredentials('admin@disaster-relief.org', 'Admin@123')"
                            class="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-zinc-700 hover:bg-blue-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-medium transition text-center hover:border-blue-300">
                            🛡️ Admin
                        </button>
                        <button type="button" onclick="fillCredentials('coordinator@redcross.org', 'Redcross@123')"
                            class="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-zinc-700 hover:bg-blue-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-medium transition text-center hover:border-blue-300">
                            🏥 Coordinator
                        </button>
                    </div>
                </div>

                <p class="text-center text-xs text-slate-400 mt-5">
                    Volunteers: Please use the offline-capable mobile Android app.
                </p>
            </div>
        </div>
    </div>

    <script>
        function fillCredentials(email, pass) {
            document.getElementById('email').value = email;
            document.getElementById('password').value = pass;
            const alertBox = document.getElementById('alert-box');
            if (alertBox) alertBox.className = 'hidden';
        }

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

