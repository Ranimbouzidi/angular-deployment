// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  backend_url: 'http://localhost:8081/api/',
  UserMs: 'http://localhost:8081/api/',
  apiUrl: 'http://localhost:8081/api/paiements',
  stripe: {
    publicKey: 'pk_test_51RFF90IxGu5W6MCjqb0iG85354fE8b6XmWbcTrwbmS3bgTUoxzrHcARwrlctt1rhRqfz8GOP9xJEjxG6lTyQr8nk00EMCpUH3P'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
