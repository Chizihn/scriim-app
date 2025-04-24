export const lightTheme = {
  background: "#FFFFFF",
  text: "#000000",
  primary: "#e74c3c",
  secondary: "#f8f8f8",
  border: "#ddd",
  card: "#f8f8f8",
  headerBackground: "#e74c3c",
  headerText: "#FFFFFF",
  inputBackground: "#f8f8f8",
};

export const darkTheme = {
  background: "#121212",
  text: "#FFFFFF",
  primary: "#e74c3c",
  secondary: "#2A2A2A",
  border: "#444",
  card: "#1E1E1E",
  headerBackground: "#1E1E1E",
  headerText: "#FFFFFF",
  inputBackground: "#2A2A2A",
};

export type Theme = typeof lightTheme;

export const getTheme = (isDarkMode: boolean): Theme => {
  return isDarkMode ? darkTheme : lightTheme;
};
