<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Content-Length");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    $body = file_get_contents('php://input');
    $data = json_decode($body, true);

    if (!is_array($data) || !isset($data['nia']) || !isset($data['dni'])) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid request payload'
        ]);
        exit;
    }

    require 'conexcion.php';

    $nia = $conexion->real_escape_string(trim($data['nia']));
    $dni = $conexion->real_escape_string(trim($data['dni']));

    $query = "SELECT id, nia, dni FROM fotos_alumnos WHERE nia = '$nia' AND dni = '$dni' LIMIT 1";
    $result = $conexion->query($query);

    if ($result && $result->num_rows === 1) {
        $row = $result->fetch_assoc();
        echo json_encode([
            'status' => 'success',
            'data' => [
                'id' => $row['id'],
                'nia' => $row['nia'],
                'dni' => $row['dni']
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode([
            'status' => 'error',
            'message' => 'Credenciales inválidas'
        ]);
    }
} catch (\Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
