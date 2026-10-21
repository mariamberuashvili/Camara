<?php

header('Content-Type: application/json');

include 'conexcion.php';

$resultado = $conexion->query(
    "SELECT * FROM fotos_alumnos ORDER BY id DESC"
);

$datos = [];

while ($fila = $resultado->fetch_assoc()) {
    $datos[] = $fila;
}

echo json_encode($datos);