import { createStore } from "vuex";

export default createStore({
  strict: !import.meta.env.PROD,
});
