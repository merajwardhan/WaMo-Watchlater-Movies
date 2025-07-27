// Those extra function that we require are given below
// Utility functions for Google OAuth

export async function exchangeCodeForTokens(code){
  const tokenUrl = 'https://oauth2.googleapis.com/token'

  const response = await fetch(tokenUrl, {
    method : 'POST',
    headers : {
      'Content-Type' : 'application/x-www-form-urlencoded'
    },
    body : new URLSearchParams({
      client_id : process.env.GOOGLE_CLIETN_ID,
      client_secret : process.env.GOOGLE_CLIETN_SECRET,
      code , // shorthand for code : code
      grant_type : 'authorization_code', //This is the "code" that we got earlier and are telling the server that we have this code provide the userinformation for this code
      redirect_url : 'http://localhost:3000/api/auth/google/callback'
    })
  })

  if(!response.ok) {
    errorText = await response.text(); //parse the response to text to see what messed up
    throw new Error(`Error while exchaning code for token : 
      \nResponse status : ${response.status}
      \nResponse Text : ${errorText}`);
  }

  const data = await response.json();
  console.log(`The response json is : ${data}`);
  return data
}

export async function getUserInfo(accessToken) {
  try {
    const response = await fetch('https://googleapi.com/oauth/v2/userinfo',{
      headers : {
        'Authorization' : `Bearer ${accessToken}`//although we can write headers in upper lower whatever case, it's good practice to write them gramatically 
      }
    })

    if(!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error while exchaning access token for userInfo
        \nResponse Status : ${response.status}
        \nResponse Text : ${errorText}`)
    }

    return await response.json(); 
  } catch (error) {
    if(error.name === 'TypeError') throw new Error(`Network Error , Could not reach Google API for accessToken conversion`)
    throw error;
  }
}
// export async function exchangeCodeForTokens(code) {
//   const tokenUrl = 'https://oauth2.googleapis.com/token'
  
//   const response = await fetch(tokenUrl, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//     },
//     body: new URLSearchParams({
//       client_id: process.env.GOOGLE_CLIENT_ID,
//       client_secret: process.env.GOOGLE_CLIENT_SECRET,
//       code: code,
//       grant_type: 'authorization_code',
//       redirect_uri: process.env.REDIRECT_URI || 'http://localhost:3000/auth/google/callback',
//     }),
//   })

//   if (!response.ok) {
//     const errorText = await response.text()
//     throw new Error(`Token exchange failed: ${response.status} - ${errorText}`)
//   }

//   const tokenData = await response.json()
//   return tokenData
// }

// export async function getUserInfo(accessToken) {
//   const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
//     headers: {
//       'Authorization': `Bearer ${accessToken}`,
//     },
//   })

//   if (!response.ok) {
//     const errorText = await response.text()
//     throw new Error(`Failed to fetch user info: ${response.status} - ${errorText}`)
//   }

//   const userInfo = await response.json()
//   return userInfo
// }

// // Optional: Refresh access token
// export async function refreshAccessToken(refreshToken) {
//   const tokenUrl = 'https://oauth2.googleapis.com/token'
  
//   const response = await fetch(tokenUrl, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//     },
//     body: new URLSearchParams({
//       client_id: process.env.GOOGLE_CLIENT_ID,
//       client_secret: process.env.GOOGLE_CLIENT_SECRET,
//       refresh_token: refreshToken,
//       grant_type: 'refresh_token',
//     }),
//   })

//   if (!response.ok) {
//     const errorText = await response.text()
//     throw new Error(`Token refresh failed: ${response.status} - ${errorText}`)
//   }

//   return await response.json()
// }