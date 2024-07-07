<?php
$datos = [
    'nombre' => $_POST['nombre'],
    'apellido' => $_POST['apellido'],
    'email' => $_POST['email'],
    'nacimiento' => $_POST['nacimiento'],
    'mensaje' => $_POST['mensaje']
];
 echo json_encode($datos);



  
?>
