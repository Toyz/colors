import "@fortawesome/fontawesome-free/css/all.css";
import { createApp } from "vue";
import Vue3ColorPicker from "vue3-colorpicker";
import "vue3-colorpicker/style.css";
import App from "./App.vue";
import "./style.css";

createApp(App).use(Vue3ColorPicker).mount("#app");
