<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="theme-color" content="#252539">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="description" content="Ouvrez votre coeur et laissez le miroir pénétrer votre âme">
        <meta name="theme-color" content="#1A1A2E">
        <meta name="author" content="Maxence (Maxlego08) Simon">

        <meta name="keywords" content="miroir, vos races, seven wands, vosraces">
        <meta property="description" content="Ouvrez votre coeur et laissez le miroir pénétrer votre âme">
        <meta name="description" content="Ouvrez votre coeur et laissez le miroir pénétrer votre âme">

        <base href="{{ route('home') }}">
        <meta property="og:title" content="{{ config('app.name', 'Laravel') }}">
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ url()->current() }}">
        <meta property="og:image" content="">
        <meta property="og:description" content="Ouvrez votre coeur et laissez le miroir pénétrer votre âme">
        <meta property="og:site_name" content="Miroir de VosRaces">

        <meta name="msapplication-TileColor" content="#252539">
        <meta name="msapplication-TileImage" content="{{ asset('android-chrome-192x192.png') }}">

        <meta name="author" content="GROUPEZ.DEV [contact@groupez.dev]">
        <meta name="publisher" content="GROUPEZ.DEV [contact@groupez.dev]">
        <meta name="twitter:card" content="summary">
        <meta name="twitter:site" content="@GroupeZ_">
        <meta name="twitter:creator" content="@GroupeZ_">
        <meta name="twitter:card" content="summary">
        <meta name="twitter:title" content="{{ config('app.name', 'Laravel') }}">
        <meta name="twitter:image" content="{{ asset('android-chrome-192x192.png') }}">
        <meta property="og:title" content="{{ config('app.name', 'Laravel') }}">
        <meta property="og:type" content="website">
        <meta property="og:site_name" content="Miroir de VosRaces">
        <meta property="og:description" content="Ouvrez votre coeur et laissez le miroir pénétrer votre âme">
        <meta property="og:url" content="{{ request()->url() }}">
        <meta property="og:image" content="{{ asset('android-chrome-192x192.png') }}">

        <link rel="apple-touch-icon" sizes="180x180" href="{{ asset('apple-touch-icon.png') }}">
        <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('favicon-32x32.png') }}">
        <link rel="icon" type="image/png" sizes="16x16" href="{{ asset('favicon-16x16.png') }}">
        <link rel="manifest" href="{{ asset('site.webmanifest') }}">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <meta name="csrf-token" content="{{ csrf_token() }}">

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
