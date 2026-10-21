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
    if (!isset($_FILES['photo']) || !isset($_POST['nia']) || !isset($_POST['dni'])) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Missing required fields or photo upload'
        ]);
        exit;
    }

    $nia = trim($_POST['nia']);
    $dni = trim($_POST['dni']);

    if ($nia === '' || $dni === '') {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Missing NIA or DNI'
        ]);
        exit;
    }

    $photoFile = $_FILES['photo'];
    if ($photoFile['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'File upload error ' . $photoFile['error']
        ]);
        exit;
    }

    $uploadDir = __DIR__ . '/uploads';

    if (!is_dir($uploadDir) && !mkdir($uploadDir, 0755, true)) {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Unable to create uploads directory'
        ]);
        exit;
    }

    if (!is_writable($uploadDir)) {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Uploads directory is not writable: ' . $uploadDir
        ]);
        exit;
    }

    $safeNia = preg_replace('/[^A-Za-z0-9_-]/', '_', $nia);

    $extension = pathinfo($photoFile['name'], PATHINFO_EXTENSION);
    $extension = $extension ? strtolower($extension) : 'jpg';

    if (!in_array($extension, ['jpg', 'jpeg', 'png', 'gif'], true)) {
        $extension = 'jpg';
    }

    $timestamp = time();
    $filename = sprintf('%s_%s.%s', $safeNia, $timestamp, $extension);
    $targetPath = $uploadDir . '/' . $filename;

    if (!move_uploaded_file($photoFile['tmp_name'], $targetPath)) {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to move uploaded file'
        ]);
        exit;
    }

    $relativePath = 'uploads/' . $filename;

    require 'conexcion.php';

    $stmt = $conexion->prepare(
        'UPDATE fotos_alumnos SET photo = ? WHERE nia = ? AND dni = ?'
    );
    $stmt->bind_param('sss', $relativePath, $nia, $dni);
    $stmt->execute();

    if ($stmt->affected_rows === 0) {
        // No existía ninguna fila con ese nia+dni (p.ej. no se importó por Excel):
        // creamos el registro para no perder la foto capturada.
        $insert = $conexion->prepare(
            'INSERT INTO fotos_alumnos (nia, dni, photo) VALUES (?, ?, ?)'
        );
        $insert->bind_param('sss', $nia, $dni, $relativePath);
        $insert->execute();
        $insert->close();
    }

    $stmt->close();

    echo json_encode([
        'status' => 'success',
        'message' => 'Foto subida correctamente',
        'file' => $filename,
        'path' => $relativePath
    ]);

} catch (\Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}