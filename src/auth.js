const express = require('express');
const { auth } = require('express-oauth2-jwt-bearer');

// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.
const checkJwt = auth({
  audience: process.env.SERVER,
  issuerBaseURL: `https://ilpiatto.us.auth0.com/`,
});

module.exports = checkJwt