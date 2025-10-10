
export const theme = {
  light: {
    background: "220 22% 95%",
    foreground: "221 52% 25%",
    card: "210 20% 98%",
    "card-foreground": "221 52% 25%",
    popover: "210 20% 98%",
    "popover-foreground": "221 52% 25%",
    primary: "33 99% 68%",
    "primary-foreground": "0 0% 98%",
    secondary: "210 16% 90%",
    "secondary-foreground": "222 84% 5%",
    muted: "210 16% 90%",
    "muted-foreground": "215.4 16.3% 46.9%",
    accent: "292 55% 65%",
    "accent-foreground": "221 52% 25%",
    destructive: "0 84.2% 60.2%",
    "destructive-foreground": "0 0% 98%",
    border: "24 12% 80%",
    input: "24 12% 80%",
    ring: "208 100% 37%",
  },
  dark: {
    background: "221 52% 15%",
    foreground: "220 22% 95%",
    card: "221 52% 15%",
    "card-foreground": "220 22% 95%",
    popover: "221 52% 15%",
    "popover-foreground": "220 22% 95%",
    primary: "208 100% 47%",
    "primary-foreground": "0 0% 98%",
    secondary: "221 52% 25%",
    "secondary-foreground": "0 0% 98%",
    muted: "221 52% 25%",
    "muted-foreground": "215 20.2% 65.1%",
    accent: "204 77% 62%",
    "accent-foreground": "0 0% 98%",
    destructive: "0 62.8% 30.6%",
    "destructive-foreground": "0 0% 98%",
    border: "24 12% 40%",
    input: "24 12% 40%",
    ring: "208 100% 47%",
  },
  sidebar: {
    background: "0 0% 98%",
    foreground: "240 5.3% 26.1%",
    primary: "240 5.9% 10%",
    "primary-foreground": "0 0% 98%",
    accent: "240 4.8% 95.9%",
    "accent-foreground": "240 5.9% 10%",
    border: "220 13% 91%",
    ring: "217.2 91.2% 59.8%",
  },
  sidebar_dark: {
    background: "240 5.9% 10%",
    foreground: "240 4.8% 95.9%",
    primary: "224.3 76.3% 48%",
    "primary-foreground": "0 0% 100%",
    accent: "240 3.7% 15.9%",
    "accent-foreground": "240 4.8% 95.9%",
    border: "240 3.7% 15.9%",
    ring: "217.2 91.2% 59.8%",
  }
};

export const defaultSolidColors = [
    '#000000', '#545454', '#737373', '#A6A6A6', '#B4B4B4', '#D9D9D9', '#FFFFFF',
    '#FF3131', '#FF5757', '#FF66C4', '#E2A9F1', '#CB6CE6', '#8C52FF', '#5E17EB',
    '#0097B2', '#0CC0DF', '#5CE1E6', '#38B6FF', '#5170FF', '#004AAD', '#1800AD',
    '#00BF63', '#7ED957', '#C1FF72', '#FFDE59', '#FFBD59', '#FF914D', '#FF751F'
];

export const gradientTemplates = [
    { name: "Sunrise", css: "linear-gradient(to top right, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)" },
    { name: "Dark Ocean", css: "linear-gradient(to right, #373b44, #4286f4)" },
    { name: "Sunset", css: "linear-gradient(to top right, #F3904F 0%, #3B4371 100%)" },
    { name: "Forest", css: "linear-gradient(to top right, #13547a 0%, #80d0c7 100%)" },
    { name: "Royal", css: "linear-gradient(to top right, #473B7B 0%, #3584A7 50%, #30D2BE 100%)" },
    { name: "Mojito", css: "linear-gradient(to top, #1d976c, #93f9b9)" },
    { name: "Cherry", css: "linear-gradient(to top, #eb3349, #f45c43)" },
    { name: "Pinky", css: "linear-gradient(to top, #dd5e89, #f7bb97)" },
    { name: "Purple", css: "linear-gradient(to top right, #6a11cb 0%, #2575fc 100%)" },
    { name: "Sky", css: "linear-gradient(to top right, #4facfe 0%, #00f2fe 100%)" },
    { name: "Fire", css: "linear-gradient(to top right, #f12711 0%, #f5af19 100%)" },
    { name: "Aqua", css: "linear-gradient(to top right, #1a2980 0%, #26d0ce 100%)" },
    { name: "Peach", css: "linear-gradient(to right, #ffecd2 0%, #fcb69f 100%)" },
    { name: "Violet", css: "linear-gradient(to right, #8e2de2, #4a00e0)" },
    { name: "Emerald", css: "linear-gradient(to right, #348f50, #56b4d3)" },
    { name: "Steel", css: "linear-gradient(to right, #65799b, #5e2563)" },
    { name: "Cosmic", css: "linear-gradient(to right, #ff00cc, #333399)" },
];

export const pageInitialColors = {
    bgColor: "#f4fdff",
    textColor: "#0F2027",
    gradientBg: gradientTemplates[0].css,
    rectBgColor: "#f4ede4",
    overlayColor: "#7585A3",
}

    