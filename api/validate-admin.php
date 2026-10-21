<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Content-Length");
header("Content-Type: application/json; charset=utf-8");

// Manejar pre-flight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/env.php';

// Obtener contraseña del entorno (más seguro que hardcodear)
$adminPassword = getenv("ADMIN_PASSWORD"); 

try {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['password'])) {
        http_response_code(400);
        echo json_encode([
            "valid" => false,
            "message" => "Password required"
        ]);
        exit;
    }

    $providedPassword = $input['password'];

    // Validar contraseña (usar hash en producción)
    if ($providedPassword === $adminPassword) {
        // Generar token seguro
        $token = bin2hex(random_bytes(32));
        
        // Guardar token en sesión/base de datos (opcional para validar después)
        // Por ahora solo devolvemos el token al cliente
        
        http_response_code(200);
        echo json_encode([
            "valid" => true,
            "token" => $token,
            "message" => "Admin access granted"
        ]);
    } else {
        http_response_code(401);
        echo json_encode([
            "valid" => false,
            "message" => "Invalid password"
        ]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "valid" => false,
        "message" => $e->getMessage()
    ]);
}

?>
