module.exports = {
  siteTitle: "Carlos Loureda", // Navigation and Site Title
  siteTitleAlt: "La web personal de Carlos Loureda", // Alternative Site title for SEO
  siteTitleShort: "carlosloureda", // short_name for manifest
  siteUrl: process.env.ROOT_URL || "https://carlosloureda.com", // Domain of your site. No trailing slash!
  lang: "es", // Language Tag on <html> element
  pathPrefix: "/",
  siteLogo: "images/logo.png", // Used for SEO and manifest, path to your image you placed in the 'static' folder
  siteDescription: "Ven a aprender conmigo React  JS.",
  minibio: `
      <strong>Carlos Loureda</strong> está creando contenido en React y Gatsby.
    `,
  author: "Carlos Loureda", // Author for schemaORGJSONLD
  organization: "Carlos Loureda Tech LLC",

  // siteFBAppID: '123456789', // Facebook App ID - Optional
  userTwitter: "@carlosloureda", // Twitter Username
  ogSiteName: "Carlos Loureda", // Facebook Site Name
  ogLanguage: "en_US",

  // Manifest and Progress color
  themeColor: "#4147DC",
  backgroundColor: "#231C42",

  // Social component
  twitter: "https://twitter.com/carlosloureda/",
  twitterHandle: "@carlosloureda",
  github: "https://github.com/carlosloureda/",
  linkedin: "https://www.linkedin.com/in/carlosloureda/",
  youtube: "",
  rss: "",
};
