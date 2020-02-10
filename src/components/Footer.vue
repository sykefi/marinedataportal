<template>
  <footer>
    <div id="app-footer">
      <div id="feedback">
        <font-awesome-icon icon="angle-right" id="arrow-icon" />
        <a :href="$t('$emailWithSubject')">{{$t('$feedback')}}</a>
      </div>
      <div id="logos">
        <!-- Finnish logos -->
        <ul v-if="$i18n.locale === 'fi'">
          <li>
            <a href="https://syke.fi/fi-FI">
              <img
                id="syke-logo"
                src="@/assets/logos/SYKE_fi_en.jpg"
                alt="Suomen ympäristökeskuksen kotisivu."
              />
            </a>
          </li>
          <li>
            <a href="http://www.gtk.fi/">
              <img
                id="gtk-logo"
                src="@/assets/logos/GTK_fi_en.png"
                alt="Geologian tutkimuskeskuksen kotisivu."
              />
            </a>
          </li>
          <li>
            <a href="https://ilmatieteenlaitos.fi/">
              <img
                id="il-logo"
                src="@/assets/logos/il_fi_en.png"
                alt="Ilmatieteenlaitoksen kotisivu."
              />
            </a>
          </li>
          <li>
            <a href="https://luke.fi">
              <img src="@/assets/logos/Luke_fi.jpg" alt="Luonnonvarakeskuksen kotisivu." />
            </a>
          </li>
          <li>
            <a href="https://www.merialuesuunnittelu.fi">
              <img
                id="mas-logo"
                src="@/assets/logos/mas_fi.png"
                alt="Merialuesuunnittelun kotisivu."
              />
            </a>
          </li>
          <li>
            <a href="http://metsa.fi">
              <img src="@/assets/logos/mh_fi_eng.png" alt="Metsähallituksen kotisivu." />
            </a>
          </li>
          <li>
            <a href="https://www.museovirasto.fi/">
              <img src="@/assets/logos/Museovirasto_fi_en.jpg" alt="Museoviraston kotisivu." />
            </a>
          </li>
          <li>
            <a href="https://www.utu.fi/">
              <img src="@/assets/logos/UTU_fi.jpg" alt="Turun yliopiston kotisivu." />
            </a>
          </li>
          <li>
            <a href="https://www.regeringen.ax/">
              <img
                id="aland-logo"
                src="@/assets/logos/aland_fi_en.png"
                alt="Ahvenanmaan maakuntahallituksen kotisivu."
              />
            </a>
          </li>
        </ul>

        <!-- English logos -->
        <ul v-if="$i18n.locale === 'en'">
          <li>
            <a href="https://syke.fi/en-US">
              <img
                id="syke-logo"
                src="@/assets/logos/SYKE_fi_en.jpg"
                alt="Finnish Environment Institute home."
              />
            </a>
          </li>
          <li>
            <a href="http://en.gtk.fi/">
              <img
                id="gtk-logo"
                src="@/assets/logos/GTK_fi_en.png"
                alt="Geological Survey of Finland home."
              />
            </a>
          </li>
          <li>
            <a href="https://en.ilmatieteenlaitos.fi/">
              <img
                id="il-logo"
                src="@/assets/logos/il_fi_en.png"
                alt="Finnish Meteorological Institute home."
              />
            </a>
          </li>
          <li>
            <a href="https://luke.fi/en">
              <img src="@/assets/logos/Luke_en.png" alt="Natural Resources Institute Finland home." />
            </a>
          </li>
          <li>
            <a href="https://www.merialuesuunnittelu.fi/en">
              <img
                id="mas-logo"
                src="@/assets/logos/mas_eng.png"
                alt="Maritime spatial planning home."
              />
            </a>
          </li>
          <li>
            <a href="http://metsa.fi/web/en">
              <img src="@/assets/logos/mh_fi_eng.png" alt="Metsähallitus home." />
            </a>
          </li>
          <li>
            <a href="https://www.museovirasto.fi/en/">
              <img
                src="@/assets/logos/Museovirasto_fi_en.jpg"
                alt="The Finnish Heritage Agency home."
              />
            </a>
          </li>
          <li>
            <a href="https://www.utu.fi/en">
              <img src="@/assets/logos/UTU_fi.jpg" alt="University of Turku home." />
            </a>
          </li>
          <li>
            <a href="https://www.regeringen.ax/">
              <img
                id="aland-logo"
                src="@/assets/logos/aland_fi_en.png"
                alt="Ålands landskapsregering home."
              />
            </a>
          </li>
        </ul>
      </div>
      <div id="links">
        <ul>
          <li>
            <a
              href="https://github.com/sykefi/marinedataportal"
              target="_blank"
              rel="noopener noreferrer"
            >{{$t('$sourceCode')}}</a>
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import i18n from '@/locale/i18n';

@Component({ i18n })
export default class Footer extends Vue { }
</script>

<style lang="scss" scoped>
@import "@/assets/styles/variables.scss";
#app-footer {
  display: grid;
  grid-template:
    "div div div"
    ". logo ."
    ". links ."
    / 1fr 65rem 1fr;
}

#feedback {
  grid-area: div;
  height: 4.4rem;
  background-color: $border-dark;
  margin-top: 5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  a {
    color: $text-white;
    font-weight: bold;
    font-size: $font-size-l;
    letter-spacing: 0.05rem;
    text-decoration: none;
  }
}

#arrow-icon {
  color: $background-bright-blue;
  font-size: $font-size-xl;
  padding-right: 0.5rem;
}

#logos {
  grid-area: logo;
  ul {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    height: 3rem;
    list-style-type: none;
    width: 100%;
    padding: 0;
    li {
      height: 100%;
    }
  }
  #mas-logo {
    width: 9rem;
    height: auto;
  }

  #gtk-logo {
    width: 5rem;
    height: auto;
    padding-bottom: 0.4rem;
  }

  #syke-logo {
    width: 3rem;
    height: auto;
  }

  #il-logo {
    width: 11rem;
    height: auto;
  }

  #aland-logo {
    width: 6rem;
    height: auto;
  }
}

#links {
  grid-area: links;
  ul {
    list-style: none;
    text-align: right;
  }
}
</style>