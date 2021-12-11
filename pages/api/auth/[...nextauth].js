import NextAuth from "next-auth"
import SpoitifyProvider from "next-auth/providers/spotify"
import spotifyAPI, { LOGIN_URL } from "../../../lib/spotify"

async function refreshAccessToken(){
    try{

        spotifyAPI.setAccessToken(token.accessToken);
        spotifyAPI.setRefreshToken(token.refreshAccessToken);

        const {body: refreshToken } = await spotifyAPI.refreshAccessToken();

        return {
            ...token,
            accessToken: refreshAccessToken.access_token,
            accessTokenExpires: Date.now + refreshAccessToken.expires_at * 1000,

            refreshToken: refreshToken.refresh_token ?? token.refreshToken,
            //replace if new one came back
        }

    }catch(err){
        console.log(err);

        return {
            ...token,
            error: 'Refresh Error Token'
        }
    }
}


export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpoitifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      authorization: LOGIN_URL
    }),
    // ...add more providers here
  ],

  secret: process.env.JWT_SECRET,
  pages: {
      signIn: '/login'
  },
  callbacks: {
      async jwt({token, user, account}){
          // initial sign in
          if(account && user){
              return {
                  ...token,
                  accessToken: account.access_token,
                  refreshToken: account.refresh_token,
                  username: account.providerAccountId,
                  accessTokenExpires: account.expires_at * 1000,
              }
          }


          if(Date.now() < token.accessTokenExpires){
              return token;
          }

          // Access token expires
          return await refreshAccessToken(token);

      },
      async session({session, token}){
          session.user.accessToken = token.accessToken;

          session.user.refreshToken = token.refreshToken;

          session.user.username = token.username;

          return session;
      }
  }
})