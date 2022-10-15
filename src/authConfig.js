export const msalConfig = {
    auth: {
      clientId: "f22b238d-fdfd-471f-8eb2-9df6c9e2fbf1",
      authority: "https://login.microsoftonline.com/common", // This is a URL (e.g. https://login.microsoftonline.com/{your tenant ID})
      redirectUri: "http://localhost:3000",
    },
    cache: {
      cacheLocation: "sessionStorage", // This configures where your cache will be stored
      storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    }
  };
  
  // Add scopes here for ID token to be used at Microsoft identity platform endpoints.
  export const loginRequest = {
    scopes: ["User.Read", "Calendars.Read", "Calendars.ReadWrite", "Calendars.Read.Shared", "Contacts.Read", "Contacts.ReadWrite"]
  };
  
  // Add the endpoints here for Microsoft Graph API services you'd like to use.
  export const graphConfig = {
      graphMeEndpoint: "https://graph.microsoft.com/v1.0/me"
  };