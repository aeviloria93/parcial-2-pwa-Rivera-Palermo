<?php

$postdata = $_POST;


/* echo "<pre>";
print_r($postdata);
echo "</pre>"; */


$nombre = isset($postdata['nombre']) ? htmlspecialchars($postdata['nombre']) : 'Usuario';
$email = isset($postdata['email']) ? htmlspecialchars($postdata['email']) : 'tu email';

$mensaje = "Gracias $nombre por comunicarte con nosotros. Te estaremos enviando un mail a $email para terminar tu verificación.";



?> 

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Formulario de Contacto</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-0evHe/X+R7YkIZDRvuzKMRqM+OrBnVFBL6DOitfPri4tjfHxaWutUpFmBp4vmVor" crossorigin="anonymous">

    <link rel="stylesheet" href="styles.css">
</head>


<header class="bg-success text-end ">

  <a href="index.html" class="bg-warning btn text-dark m-2">Volver</a>


</header>


<body>

      <div class="container mt-5 col-md-8 col-sm-10" id="fondo">
      <h1 class=" text-center">Rick&Morty App!</h1>
        <div>
        <h2 class=" text-center">Gracias!</h2>
        <p class="fs-4"><?= $mensaje?></p>
      </div>
      <a href="index.html" class="bg-warning btn text-dark m-2 d-block m-auto">Volver</a>
      <img class="d-block mt-5 m-auto" src="img/rmlogo-removebg-preview.png" alt="logor&m">


    
    <div id="response"></div>
    </div>

 



</body>
</html>

