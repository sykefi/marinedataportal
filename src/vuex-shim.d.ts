import { Store } from 'vuex'

declare module '@vue/runtime-core' {
  interface State {
    mainState: {
      loading: boolean
    }
  }

  interface ComponentCustomProperties {
    $store: Store<State>
  }
}
