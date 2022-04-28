// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Vuetify
import { createVuetify } from "vuetify";

const myCustomLightTheme = {
  dark: false,
  colors: {
    background: "#EFEFEF",
    surface: "#EFEFEF",
    primary: "#F26D78",
    secondary: "#FA8993",
    error: "#B00020",
    info: "#D37E85",
    success: "#4CAF50",
    warning: "#FB8C00",
  },
};

const myDarkTheme = {
  dark: true,
  colors: {
    background: "#121212",
    surface: "#121212",
    primary: "#C95F68",
    secondary: "#FA8993",
    error: "#B00020",
    info: "#D37E85",
    success: "#4CAF50",
    warning: "#FB8C00",
  },
};

export default createVuetify(
  // https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
  {
    theme: {
      defaultTheme: "myCustomLightTheme",
      themes: {
        myCustomLightTheme,
        myDarkTheme,
      },
    },
  }
);
