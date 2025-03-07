  {{> hover}}

  <div class="cell medium-9 medium-cell-block-y">
      <style>
      .headers {
          top: 0;
          position: -webkit-sticky;
          position: sticky;
          z-index: 1;
      }

      .tracks,
      .scroller {
          display: flex;
          overflow-y: hidden;
          -webkit-overflow-scrolling: touch;
      }

      .scroller {
          overflow-x: hidden;
      }
      </style>

      <div class="headers">
          <div class="scroller">
              <ul class="menu simple">
                  <li class="is-active"><a href="{{root}}galeriak/2020_21/ps/fooldal_2020_21_ps.php"
                          style="padding: 0.7rem 1rem;">Székhely</a></li>
                  <li style="padding: 0.7rem 1rem;"><a
                          href="{{root}}galeriak/2020_21/bs/fooldal_2020_21_bs.php">Tagiskola</a></li>
              </ul>
          </div>
      </div>

      <h3 class="text-center">Szegedi Petőfi Sándor Általános Iskola<br />
          <small>Fotógalériák 2020–2021</small>
      </h3>
      <hr>

      <div class="grid-x grid-margin-x">
          <?php
      //set main directory
      $mainDir = '../../../assets/img/galeriak/2020_21/ps/';

      {{> galeria_fooldal_fix_part_ps_2020_21}}
      {{> menu_galeriak_horizontal_centered}}
  </div>