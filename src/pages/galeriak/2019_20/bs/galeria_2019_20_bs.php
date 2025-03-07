<div class="cell medium-9 medium-cell-block-y">
    {{> vissza2}}


    <h3 class="text-center">Szegedi Petőfi Sándor Általános Iskola<br />
        Bálint Sándor Tagiskolája<br>
        <small>
            <?php echo $_POST["title"]; ?>
        </small>
    </h3>
    <hr>


    <div class="content">
        <div class="gg-container">
            <div class="gg-box dark" id='square'>
                <?php
      //set main directory
      $mainDir = '../../../assets/img/galeriak/2019_20/bs/';

      //gets sub directories of PDFS directory
      $subDirectories = scandir($mainDir);

      //removes the first two indexes in the directories array that are just dots
      unset($subDirectories[0]);
      unset($subDirectories[1]);

          foreach (glob($mainDir . '/' . $_POST["folder"] . '/*.jpg') as $file) {
              $counter = substr($file, -6, 2);
              echo '<img src="' . $file . '">';
  }
  ?>
            </div>
        </div>
    </div>
    {{> grid_gallery_js}}
    {{> vissza2}}