<?php

// Cargar variables de entorno desde .env.local
// Se busca primero en la raíz del proyecto (junto a /api) y, si no está,
// dentro de /api, por si así se subió al hosting.
$envCandidates = [
    __DIR__ . '/../.env.local',
    __DIR__ . '/.env.local',
];

$envFile = null;
foreach ($envCandidates as $candidate) {
    if (file_exists($candidate)) {
        $envFile = $candidate;
        break;
    }
}

if ($envFile !== null) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos($line, '=') !== false && strpos($line, '#') !== 0) {
            list($key, $value) = explode('=', $line, 2);
            $key = trim($key);
            $value = trim($value);
            putenv("$key=$value");
        }
    }
}
