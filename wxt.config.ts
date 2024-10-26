import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
// export default defineConfig({
//   extensionApi: 'chrome',
//   modules: ['@wxt-dev/module-react'],
// });

// import { defineConfig } from "wxt";

export default defineConfig({
  extensionApi: "chrome",
  modules: ["@wxt-dev/module-react"],
  manifest: {
    action: {
      default_title: "LinkedIn AI Reply",
    },
    web_accessible_resources: [
      {
        matches: ["*://*.linkedin.com/*"],
        resources: ["icon/*.png"], // Adjust this to your icon's actual location
      },
    ],
  },
});
