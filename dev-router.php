<?php

// Router para `php -S localhost:8080 -t . dev-router.php`
// Solo usado en desarrollo local para servir api/*.php a través del proxy de Angular.
// Bloquea cualquier otra ruta (evita exponer .env.local, código fuente, etc).

$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

if (strpos($uri, '/api/') === 0 && is_file(__DIR__ . $uri)) {
    return false;
}

http_response_code(404);
echo 'Not found';
