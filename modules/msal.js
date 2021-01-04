import * as Msal from 'msal';

export default function () {
  // https://github.com/Azure-Samples/active-directory-b2c-javascript-msal-singlepageapp/blob/master/JavaScriptSPA/policies.js
  // Enter here the user flows and custom policies for your B2C application
  // To learn more about user flows, visit https://docs.microsoft.com/en-us/azure/active-directory-b2c/user-flow-overview
  // To learn more about custom policies, visit https://docs.microsoft.com/en-us/azure/active-directory-b2c/custom-policy-overview

  const b2cPolicies = {
    names: {
      signUpSignIn: "B2C_1A_LocalAccountsSignUpOrSignin",
      forgotPassword: "B2C_1A_LocalAccountsPasswordReset",
      editProfile: "B2C_1A_LocalAccountsProfileEdit"
    },
    authorities: {
      signUpSignIn: {
        authority: "https://aadb2clinelogin.b2clogin.com/aadb2clinelogin.onmicrosoft.com/B2C_1A_LocalAccountsSignUpOrSignin",
      },
      forgotPassword: {
        authority: "https://aadb2clinelogin.b2clogin.com/aadb2clinelogin.onmicrosoft.com/B2C_1A_LocalAccountsPasswordReset",
      },
      editProfile: {
        authority: "https://aadb2clinelogin.b2clogin.com/aadb2clinelogin.onmicrosoft.com/B2C_1A_LocalAccountsProfileEdit"
      }
    },
  };

  // https://github.com/Azure-Samples/active-directory-b2c-javascript-msal-singlepageapp/blob/master/JavaScriptSPA/authConfig.js
  /**
   * Config object to be passed to MSAL on creation.
   * For a full list of msal.js configuration parameters, 
   * visit https://azuread.github.io/microsoft-authentication-library-for-js/docs/msal/modules/_configuration_.html
   * */
  const msalConfig = {
    auth: {
      clientId: "42b3f342-9254-496e-b3f1-df73595cbe1a",
      authority: b2cPolicies.authorities.signUpSignIn.authority,
      validateAuthority: false
    },
    cache: {
      cacheLocation: "localStorage", // This configures where your cache will be stored
      storeAuthStateInCookie: false // Set this to "true" to save cache in cookies to address trusted zones limitations in IE (see: https://github.com/AzureAD/microsoft-authentication-library-for-js/wiki/Known-issues-on-IE-and-Edge-Browser)
    }
  };

  /** 
   * Scopes you enter here will be consented once you authenticate. For a full list of available authentication parameters, 
   * visit https://azuread.github.io/microsoft-authentication-library-for-js/docs/msal/modules/_authenticationparameters_.html
   */
  const loginRequest = {
    scopes: ["openid", "profile"],
  };

  // Add here scopes for access token to be used at the API endpoints.
  // const tokenRequest = {
  //   scopes: apiConfig.b2cScopes,  // e.g. ["https://fabrikamb2c.onmicrosoft.com/helloapi/demo.read"]
  // };

  // https://github.com/Azure-Samples/active-directory-b2c-javascript-msal-singlepageapp/blob/master/JavaScriptSPA/authRedirect.js
  const myMSALObj = new Msal.UserAgentApplication(msalConfig);

  // Register Callbacks for Redirect flow
  myMSALObj.handleRedirectCallback(authRedirectCallBack);

  function authRedirectCallBack(error, response) {
    // Error handling
    if (error) {
      console.log(error);

      // Check for forgot password error
      // Learn more about AAD error codes at https://docs.microsoft.com/en-us/azure/active-directory/develop/reference-aadsts-error-codes
      if (error.errorMessage.indexOf("AADB2C90118") > -1) {
        try {
          // Password reset policy/authority
          myMSALObj.loginRedirect(b2cPolicies.authorities.forgotPassword);
        } catch (err) {
          console.log(err);
        }
      }
    } else {
      console.log('I got a response.', response);

      // We need to reject id tokens that were not issued with the default sign-in policy.
      // "acr" claim in the token tells us what policy is used (NOTE: for new policies (v2.0), use "tfp" instead of "acr")
      // To learn more about b2c tokens, visit https://docs.microsoft.com/en-us/azure/active-directory-b2c/tokens-overview
      if (response.tokenType === "id_token" && response.idToken.claims['acr'] === b2cPolicies.names.forgotPassword) {
        myMSALObj.logout();
        window.alert("Password has been reset successfully. \nPlease sign-in with your new password.");

      } else if (response.tokenType === "id_token" && response.idToken.claims['acr'] === b2cPolicies.names.editProfile) {
        window.alert("Profile has been updated successfully.");

        if (myMSALObj.getAccount()) {
          updateUI();
        }

      } else if (response.tokenType === "id_token" && response.idToken.claims['acr'] === b2cPolicies.names.signUpSignIn) {
        console.log("id_token acquired at: " + new Date().toString());

        if (myMSALObj.getAccount()) {
          updateUI();
        }

      } else if (response.tokenType === "access_token") {
        console.log("access_token acquired at: " + new Date().toString());
        accessToken = response.accessToken;
        logMessage("Request made to Web API:");
        if (accessToken) {
          try {
            callApiWithAccessToken(apiConfig.webApi, accessToken);
          } catch (err) {
            console.log(err);
          }
        }
      } else {
        console.log("Token type is: " + response.tokenType);
      }
    }
  }

  return {
    myMSALObj: myMSALObj,
    loginRequest: loginRequest,
  };
}
