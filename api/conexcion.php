<?php

require_once __DIR__ . '/env.php';

$conexion = new mysqli(
    getenv("DB_HOST") ?: "localhost",
    getenv("DB_USER") ?: "root",
    getenv("DB_PASS") ?: "",
    getenv("DB_NAME") ?: "camara",
    (int) (getenv("DB_PORT") ?: 3306)
);

if ($conexion->connect_error) {
    http_response_code(500);
    echo json_encode([
        "error" => "DB connection failed",
        "message" => $conexion->connect_error
    ]);
    exit;
}

$conexion->set_charset("utf8");