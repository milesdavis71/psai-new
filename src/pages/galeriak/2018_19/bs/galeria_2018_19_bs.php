<div class="cell medium-9 medium-cell-block-y">
    {{> vissza2}}

    <?php
    // Közös változók a galéria oldalhoz (cím + képek)
    $mainDir = '../../../assets/img/galeriak/2018_19/bs/';

    // Folder név beolvasása és sanitizálása
    $folder = $_POST['folder'] ?? '';
    $folder = (string)$folder;
    $folder = trim($folder, "/\\");      // elejéről-végéről / és \ le
    $folder = basename($folder);         // csak az utolsó komponens

    // Engedjük: betűk (ékezetes is), szám, szóköz, _, -, .
    if (
        $folder === '' ||
        !preg_match('/^[\p{L}0-9 _\.\-]+$/u', $folder)
    ) {
        $folder = '';
    }

    // Segédfüggvény: album szöveg tisztítása
    // - HTML entitások (pl. &lt;br&gt;) dekódolása
    // - <br> -> sortörés
    // - összes HTML tag eltávolítása
    function cleanAlbumText(string $text): string {
        // Ha album.txt-ben HTML-entitások vannak (pl. &lt;br&gt;), előbb dekódoljuk.
        // Így a strip_tags + <br>-kezelés tényleg működik.
        $text = html_entity_decode($text, ENT_QUOTES | ENT_HTML5, 'UTF-8');

        // <br>, <br/>, <br /> → egy sortörés, az utánuk lévő whitespace eltüntetésével
        $text = preg_replace('/<br\s*\/?>\s*/i', "\n", $text);

        // Minden HTML tag eltávolítása
        $text = strip_tags($text);

        // Normalizáljuk az esetleges CRLF-et
        $text = str_replace("\r", "", $text);

        return trim($text);
    }

    // Album cím/szöveg: az aktuális mappa album.txt fájljából (ha van).
    // Ha nincs, akkor a POST title-ből.
    $albumTitle = '';
    if ($folder !== '') {
        $albumTxtPath = $mainDir . '/' . $folder . '/album.txt';
        if (is_file($albumTxtPath)) {
            $rawContent = @file_get_contents($albumTxtPath);
            if ($rawContent !== false) {
                $albumTitle = cleanAlbumText($rawContent);
            }
        }
    }

    // Fallback: ha nincs, vagy üres az album.txt, akkor a POST-ból
    if ($albumTitle === '') {
        $albumTitle = cleanAlbumText((string)($_POST['title'] ?? ''));
    }
    ?>

    <h3 class="text-center">Szegedi Petőfi Sándor Általános Iskola
        <small>
        <?php
            // Plusz sortörés AZ EGÉSZ cím elé
            // Az album.txt-ben lévő <br> már egy sortörés (\n) lett,
            // így a struktúra:
            //   (üres sor)
            //   2023. 09. 16.
            //   Szüreti piknik
            echo nl2br(htmlspecialchars("\n" . $albumTitle, ENT_QUOTES, 'UTF-8'));
        ?>
        </small>
    </h3>
    <hr>

    <?php
      // Ha nincs érvényes mappa, ne próbáljunk glob()-ot futtatni "...//*.jpg"-ra,
      // mert ez a gyökérben is találhat képeket / vagy üresen hagyhatja a gridet.
      $hasValidFolder = ($folder !== '');
    ?>

    <div class="content">
        <div class="gg-container">
            <div class="gg-box dark" id='square'>
                <?php
                // Alkönvtárak beolvasása (jelenleg nincs felhasználva, de meghagyjuk)
                $subDirectories = @scandir($mainDir);
                if (is_array($subDirectories)) {
                    unset($subDirectories[0], $subDirectories[1]);
                }

                if ($hasValidFolder) {
                    // Képek beolvasása az aktuális mappából
                    // Támogatjuk a .jpg/.jpeg/.png kiterjesztéseket is.
                    $images = [];
                    foreach (['jpg','JPG','jpeg','JPEG','png','PNG'] as $ext) {
                        $pattern = $mainDir . '/' . $folder . '/*.' . $ext;
                        $found = glob($pattern) ?: [];
                        if (!empty($found)) {
                            $images = array_merge($images, $found);
                        }
                    }
                    // Stabil sorrend (különböző fájlrendszerek esetén)
                    sort($images, SORT_NATURAL | SORT_FLAG_CASE);

                    foreach ($images as $file) {
                        // A lightbox JS a data-full attribútumból olvassa a nagy képet.
                        $src = htmlspecialchars($file, ENT_QUOTES, 'UTF-8');
                        echo '<img src="' . $src . '" data-full="' . $src . '" loading="lazy">';
                    }

                    if (empty($images)) {
                        echo '<p class="text-center" style="padding: 1rem;">Nincs megjeleníthető kép ebben az albumban.</p>';
                    }
                } else {
                    echo '<p class="text-center" style="padding: 1rem;">Az album megnyitásához kérlek a galéria főoldaláról válassz egy albumot.</p>';
                }
                ?>
            </div>
        </div>
    </div>
    {{> grid_gallery_js}}
    {{> vissza2}}
