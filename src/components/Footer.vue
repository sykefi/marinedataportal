<template>
  <footer>
    <div id="app-footer">
      <div id="feedback">
        <font-awesome-icon
          icon="angle-right"
          id="arrow-icon"
        />
        <a :href="$t('$emailWithSubject')">{{ $t('$feedback') }}</a>
      </div>
      <div id="logos">
        <ul>
          <li>
            <a
              target="_blank"
              rel="noopener"
              :href="$t('$sykeFi')"
            >
              <img
                id="syke-logo"
                src="@/assets/logos/Syke_logo.svg"
                :alt="$t('$sykeLogoAltText')"
              >
            </a>
          </li>
          <li>
            <a
              target="_blank"
              rel="noopener"
              :href="$t('$fmiFi')"
            >
              <img
                id="il-logo"
                src="@/assets/logos/il_fi_en.png"
                :alt="$t('$fmiLogoAltText')"
              >
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
            >{{ $t('$sourceCode') }}</a>
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
    / 1fr $content-width 1fr;
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
    justify-content: center;
    list-style-type: none;
    width: 100%;
    padding: 0;
    li {
      height: 100%;
      padding: 2rem;
    }
  }

  #syke-logo {
    width: 12rem;
    height: auto;
  }

  #il-logo {
    width: 15rem;
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