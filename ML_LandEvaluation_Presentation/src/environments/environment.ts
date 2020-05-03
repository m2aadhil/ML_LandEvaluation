// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  coreServiceUrl: "https://land-eval-app.df.r.appspot.com/",//"http://localhost:3600/",//"https://landevaluation-275112.el.r.appspot.com/",
  googleMaps: {
    geoCodeAPI: "https://maps.googleapis.com/maps/api/geocode/json?",
    apiKey: "AIzaSyDyR_6J7H-k-A_SF2sNQ0Brou2IZQYpeik"

  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
