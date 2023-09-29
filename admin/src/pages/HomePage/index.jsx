/*
 *
 * HomePage
 *
 */

import React from 'react';
import { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import pluginId from '../../pluginId';
import { Button } from '@strapi/design-system';
import CryptoJS from 'crypto-js';
import { EmptyStateLayout, Box, BaseHeaderLayout, Crumb, Breadcrumbs, Typography } from '@strapi/design-system';
// import jwt from 'jsonwebtoken';

const HomePage = () => {
  const [loggedUserData, setloggedUserData] = useState();
  useEffect(() => {
    // const userInfo = localStorage.getItem('userInfo'); // in dev mode
    const userInfo = sessionStorage.getItem('userInfo');  // in production mode
    console.log("userInfo");
    console.log(userInfo);
    setloggedUserData(userInfo)
  }, []);

  async function encryptUserInfo(datatoencrypt, secretKey, signatureKey) {
    const encryptedData = CryptoJS.AES.encrypt(datatoencrypt, secretKey).toString();
    const signature = CryptoJS.HmacSHA256(encryptedData, signatureKey).toString();
    return `${encryptedData}.${signature}`;
  }

  async function generateAuthToken(userInfo, secretKey, signatureKey) {
    const payload = {
      data: userInfo,
      exp: Date.now() + (2 * 60 * 60 * 1000)  // 2 hours from now
      // exp: Date.now() + (90)  // 90 sec from now
    };

    const encryptedPayload = CryptoJS.AES.encrypt(JSON.stringify(payload), secretKey).toString();
    const signature = CryptoJS.HmacSHA256(encryptedPayload, signatureKey).toString();

    return `${encryptedPayload}.${signature}`;
  }

  const redirectToWebStories = async (e, typeOfWebsite) => {
    e.preventDefault();


    const secretKey = "This is a supersecret secret key used for special auth purposes for webstories";
    const signatureKey = "This is a supersecret signature secret for webstories";

    console.log("typeOfWebsite");
    console.log(typeOfWebsite);

    console.log("redirectToWebStories");
    console.log("loggedUserData");
    console.log(loggedUserData);
    const loggedUserJSONData = JSON.parse(loggedUserData);
    console.log("loggedUserJSONData");
    console.log(loggedUserJSONData);
    // const domainorip = "15.206.27.72:8080";
    const domainorip = "localhost:8080";
    // const domainorip = "https://abn-webstories-demo-by-rizwan.netlify.app";
    // const domainorip = "abn-webstories-demo-by-rizwan.netlify.app";

    // const encryptedToken = "rizwanrockzz";
    const encryptedUserInfo = await encryptUserInfo(loggedUserData, secretKey, signatureKey);
    console.log("encryptedUserInfo");
    console.log(encryptedUserInfo);
    const encodedUserInfoForBrowser = encodeURIComponent(encryptedUserInfo);

    const authtoken = await generateAuthToken(encryptedUserInfo, secretKey, signatureKey)
    const encodedAuthTokenForBrowser = encodeURIComponent(authtoken);
    console.log("authtoken");
    console.log(authtoken);
    const encryptTypeOfWebsite = await encryptUserInfo(typeOfWebsite, secretKey, signatureKey);
    const encodedTypeOfWebsite = encodeURIComponent(encryptTypeOfWebsite);
    const redirectUrl = `http://${domainorip}/?token=${encodedAuthTokenForBrowser}&userInfo=${encodedUserInfoForBrowser}&website=${encodedTypeOfWebsite}`
    // const redirectUrl = `http://${domainorip}/?token=${encodedAuthTokenForBrowser}&userInfo=${encodedUserInfoForBrowser}&website=${encodedTypeOfWebsite}`

    console.log("Redirecting");
    console.log(redirectUrl);
    window.open(redirectUrl, "_blank");
  }

  return (
    <>
      <Box background="neutral100">
        <BaseHeaderLayout title="Web Stories" as="h2" />
      </Box>

      <Box padding={8} background="neutral100">
        <EmptyStateLayout content="Click the below buttons to go to respective webstories dashboard" action={
          <>
            {loggedUserData ? (
              <>
                <div style={{ marginBottom: "2rem", marginTop: "2rem", display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: "1rem" }}>
                  {/* <Typography ellipsis>For Going To Andhra Jyothi Web Stories Click The Button Below</Typography > */}
                  <Button variant="secondary" onClick={(e) => redirectToWebStories(e, "andhraJyothi")}>Andhra Jyothi Web Stories</Button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: "1rem" }}>
                  {/* <Typography ellipsis>For Going To Chitra Jyothi Web Stories Click The Button Below</Typography > */}
                  <Button variant="secondary" onClick={(e) => redirectToWebStories(e, "chitraJyothi")}>Chitra Jyothi Web Stories</Button>
                </div>
              </>
            ) : (
              <p>Not allowed to view {pluginId}&apos;s HomePage</p>
            )}

          </>
        }
        />
      </Box>



    </>
  );
};

export default HomePage;


{/* <div>
        {loggedUserData ? (
          // <iframe
          //   src="http://3.111.23.240:8080/"
          //   width="100%"
          //   height="100vh"
          //   title="Web Stories Integration With Strapi CMS"
          //   style={{ width: "100%", height: "100vh" }}
          // >
          //   Your browser does not support iframes.
          // </iframe>
          <Button variant="default" onClick={redirectToWebStories}>Web Stories</Button>
        ) : (
          <p>Not allowed to view {pluginId}&apos;s HomePage</p>
        )}
      </div> */}
