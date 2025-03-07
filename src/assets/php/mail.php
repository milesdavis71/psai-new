<?php


    $to = "admin@petofiszeged.hu"; // this is your Email address
    $from = $_POST['email']; // this is the sender's Email address
    
    // Tanuló
    $vez_nev_tan = $_POST['vez_nev_tan'];
    $ker_nev_tan = $_POST['ker_nev_tan'];
    $mese_cime = $_POST['mese_cime'];
    $iskola_neve = $_POST['iskola_neve'];
    $osztaly = $_POST['osztaly'];
    
    // Felkészítő pedagógus
    $vez_nev_ped = $_POST['vez_nev_ped'];
    $ker_nev_ped = $_POST['ker_nev_ped'];
    
    // Kapcsolattartó
    $vez_nev_kapcs = $_POST['vez_nev_kapcs'];
    $ker_nev_kapcs = $_POST['ker_nev_kapcs'];
    $email = $_POST['email'];
    
       
    $subject = "Új jelentkező";
    $subject2 = "Sikeres jelentkezés";
    
    $message1 .= "<p><strong>Versenyző neve:</strong> </td><td>" . $vez_nev_tan ." ".$ker_nev_tan . "</p>";
    $message1 .= "<p><strong>Mese címe:</strong> </td><td>" . $mese_cime . "</p>";
    $message1 .= "<p><strong>Iskola:</strong> </td><td>" . $iskola_neve . "</p>";
    $message1 .= "<p><strong>Évfolyam:</strong> </td><td>" . $osztaly . "</p>";
    $message1 .= "<p><strong>Felkészítő pedagógus:</strong> </td><td>" . $vez_nev_ped ." ".$ker_nev_ped . "</p>";
    $message1 .= "<p><strong>Kapcsolattartó:</strong> </td><td>" . $vez_nev_kapcs ." ".$ker_nev_kapcs . "</p>";
    $message1 .= "<p><strong>Kapcsolattartó e-mail címe:</strong> </td><td>" . $email . "</p>";
    

    
    $message2 .= "<body><html>";
    $message2 .= "<h4>Kedves " . $vez_nev_kapcs ." ".$ker_nev_kapcs ."!</h4>";
    $message2 .= "<p>A Szegedi Petőfi Sándor Általános Iskola „Hetedhét országon túl…” járási mesemondó versenyére megérkezett jelentkezése, a következő adatokkal:<p>";
    $message2 .= '<table>&nbsp;</table>';
    $message2 .= '<table rules="all" style="border-color: #666;" cellpadding="20">';
    // $message2 .= "<tr style='background: #eee;'><td><strong>Érdeklődő:</strong> </td><td>" . $_POST['name'] . "</td></tr>";
    $message2 .= "<tr><td><strong>Versenyző neve:</strong> </td><td>" . $vez_nev_tan ." ".$ker_nev_tan . "</td></tr>";
    $message2 .= "<tr><td><strong>Mese címe:</strong> </td><td>" . $mese_cime . "</td></tr>";
    $message2 .= "<tr><td><strong>Iskola:</strong> </td><td>" . $iskola_neve . "</td></tr>";
    $message2 .= "<tr><td><strong>Évfolyam:</strong> </td><td>" . $osztaly . "</td></tr>";
    $message2 .= "<tr><td><strong>Felkészítő pedagógus:</strong> </td><td>" . $vez_nev_ped ." ".$ker_nev_ped . "</td></tr>";
    $message2 .= "<tr><td><strong>Kapcsolattartó:</strong> </td><td>" . $vez_nev_kapcs ." ".$ker_nev_kapcs . " ".$email ."</td></tr>";
    $message2 .= "</table>";
    $message2 .= "<p><p>";
    $message2 .= "<p>Köszönjük regisztrációját!<br>Szeretettel várjuk Önöket a versenyen!<p>";
    $message2 .= "<p><em>Iskola vezetőség</em><p>";
    $message2 .= "</body></html>";

    $headers = "From:" . $from;
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers2 = "From:" . $to;
    $headers2 = "MIME-Version: 1.0" . "\r\n";
    $headers2 .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    mail($to,$subject,$message1,$headers);
    mail($from,$subject2,$message2,$headers2); // sends a copy of the message to the sender
   

// címlista készítése
$filename = "cimlista.csv";
// fájl írása
$file = fopen($filename, "a");
// if (filesize($filename) === 0){
//     fwrite($file, $name, $visitor_email, $mese_cime);
// }

fwrite($file, "\r\n".$vez_nev_tan. ";" .$ker_nev_tan. ";" .$mese_cime. ";" .$iskola_neve. ";" .$osztaly. ";" .$vez_nev_ped. ";" .$ker_nev_ped. ";" .$vez_nev_kapcs. ";" .$ker_nev_kapcs. ";" .$email);
// }
fclose($file);

//visszaírányít egy oldalra, fontos, hogy ezután a sor után ne írj semmit
header("Location: https://petofiszeged.edu.hu/versenyek/hetedhet_orszagon_tul_sikeres_regisztracio.html");
exit;

/* ?>
<meta http-equiv="refresh" content="0; url=<?echo $thankyou;?>"">
<?php */

?>