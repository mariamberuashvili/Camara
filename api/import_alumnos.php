<?php

require 'vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\IOFactory;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Content-Length");
header("Content-Type: application/json; charset=utf-8");

// Manejar pre-flight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Capturar errores y convertir a JSON
set_error_handler(function($errno, $errstr, $errfile, $errline) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => $errstr,
        "file" => $errfile,
        "line" => $errline
    ]);
    exit;
});

try {
    include "conexcion.php";

    if (!isset($_FILES['file'])) {
        http_response_code(400);
        echo json_encode([
            "status" => "error",
            "message" => "No file uploaded"
        ]);
        exit;
    }

    if ($_FILES['file']['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode([
            "status" => "error",
            "message" => "File upload error: " . $_FILES['file']['error']
        ]);
        exit;
    }

    $filePath = $_FILES['file']['tmp_name'];

    // Validar que el archivo existe
    if (!file_exists($filePath)) {
        http_response_code(400);
        echo json_encode([
            "status" => "error",
            "message" => "Uploaded file not found"
        ]);
        exit;
    }

    $spreadsheet = IOFactory::load($filePath);
    $sheet = $spreadsheet->getActiveSheet();

    $insertados = 0;
    $actualizados = 0;
    $errores = [];

    foreach ($sheet->getRowIterator() as $rowIndex => $row) {
        if ($rowIndex == 1) continue;

        $nia = $sheet->getCell("A" . $rowIndex)->getValue();
        $dni = $sheet->getCell("B" . $rowIndex)->getValue();

        if (!$nia || !$dni) continue;

        $nia = $conexion->real_escape_string(trim((string) $nia));
        $dni = $conexion->real_escape_string(trim((string) $dni));

        try {
            $check = $conexion->query("SELECT id FROM fotos_alumnos WHERE nia='$nia'");

            if ($check->num_rows > 0) {
                $conexion->query("
                    UPDATE fotos_alumnos
                    SET dni='$dni'
                    WHERE nia='$nia'
                ");
                $actualizados++;
            } else {
                $conexion->query("
                    INSERT INTO fotos_alumnos (nia, dni, photo)
                    VALUES ('$nia', '$dni', '')
                ");
                $insertados++;
            }
        } catch (Exception $e) {
            $errores[] = "Row $rowIndex: " . $e->getMessage();
        }
    }

    http_response_code(200);
    echo json_encode([
        "status" => "ok",
        "message" => "Importación completada",
        "insertados" => $insertados,
        "actualizados" => $actualizados,
        "errores" => $errores
    ], JSON_UNESCAPED_UNICODE);

} catch (\Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage(),
        "code" => $e->getCode()
    ]);
}