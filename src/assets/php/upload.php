<?php


/* Get the name of the uploaded file */
$filename = $_FILES['file']['name'];


$time = gmdate("H-i", time());
$date = date("Y-m-d");
$dateTime = $date . "_" . $time . "_";

/* Choose where to save the uploaded file */
$location = "uploads/" . $dateTime . $filename;



/* Save the uploaded file */
move_uploaded_file($_FILES['file']['tmp_name'], $location);
