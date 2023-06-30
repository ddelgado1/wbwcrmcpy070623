export const msalConfig = {
    auth: {
      clientId: "7ed9d5a4-bc2e-4079-9e3d-78dd1b3b828d",
      authority: "https://login.microsoftonline.com/b511dfbf-cb79-4dcf-b4a5-f88702c4a412", // This is a URL (e.g. https://login.microsoftonline.com/{your tenant ID})
      redirectUri: "https://wbwcrm.azurewebsites.net", 
    },
    cache: {
      cacheLocation: "sessionStorage", // This configures where your cache will be stored
      storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    }
  };
  
  // Add scopes here for ID token to be used at Microsoft identity platform endpoints.
  export const loginRequest = {
    scopes: ["User.Read", "Calendars.Read", "Calendars.ReadWrite", "Calendars.Read.Shared", "Contacts.Read", "Contacts.ReadWrite", "Group.ReadWrite.All", "Directory.ReadWrite.All"]
  };
  // Add the endpoints here for Microsoft Graph API services you'd like to use.
  export const graphConfig = {
      graphMeEndpoint: "https://graph.microsoft.com/v1.0/me"
  };