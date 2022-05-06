import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { dbUsers } from "../../../database";

// import GoogleProvider from "next-auth/providers/google";
// import FacebookProvider from "next-auth/providers/facebook";
// import TwitterProvider from "next-auth/providers/twitter";
// import LinkedinProvider from "next-auth/providers/linkedin";
// import AppleProvider from "next-auth/providers/apple";

// import MicrosoftProvider from "next-auth/providers/microsoft";
// import EmailProvider from "next-auth/providers/email";


//cualquier peticion cae a [...nextauth].js

export default NextAuth({
  // Configure one or more authentication providers
  providers: [

    

    Credentials({
      name: 'Custom Login',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'email@example.com' },
        password: { label: 'Password', type: 'password', placeholder: 'Password' }
      },
      async authorize( credentials ) {
        
        console.log({ credentials });
        // Check if the user exists in the database
        return await dbUsers.checkUserEmailPassword( credentials!.email, credentials!.password );

        // return { name: 'Juan', correo: 'juan@google.com', role: 'admin' };
        // return null;

      }
    }),

    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET
    }),



    // GoogleProvider({
    //     clientId: process.env.GOOGLE_ID,
    //     clientSecret: process.env.GOOGLE_SECRET,
    // }),

    // FacebookProvider({
    //     clientId: process.env.FACEBOOK_ID,
    //     clientSecret: process.env.FACEBOOK_SECRET,
    // }),

    // TwitterProvider({
    //     clientId: process.env.TWITTER_ID,
    //     clientSecret: process.env.TWITTER_SECRET,
    // }),

    // LinkedinProvider({
    //     clientId: process.env.LINKEDIN_ID,
    //     clientSecret: process.env.LINKEDIN_SECRET,
    // }),

    // AppleProvider({
    //     clientId: process.env.APPLE_ID,
    //     clientSecret: process.env.APPLE_SECRET,
    // }),

    // MicrosoftProvider({
    //     clientId: process.env.MICROSOFT_ID,
    //     clientSecret: process.env.MICROSOFT_SECRET,
    // }),


    // //Default email provider Deeplink provider, con esel link enviado se loguea automaticamente
    // EmailProvider({
    //     clientId: process.env.EMAIL_ID,
    //     clientSecret: process.env.EMAIL_SECRET,
    // }),
    // ...add more providers here
  ],

  
  jwt: {
    // secret: process.env.JWT_SECRET, // OBSOLETE
    // maxAge: "1d",
  },

  // Callbacks
  callbacks: {
    async jwt({ token, account, user }) {

      // console.log({ token, account, user });
      if( account ){
        token.accessToken = account.access_token;

        switch( account.type ){
          
          //SOCIAL MEDIA
          case 'oauth':
            //TODO: crear usuario o verificar si existe en mi BD
            token.user = await dbUsers.oAuthToDbUser( user?.email || '', user?.name || '' );
            break;

          //PAGE LOGIN
          case 'credentials':
            token.user = user;
            break;
          
        }
      }

      return token;
    },

    async session({ session, token, user }) {

      // console.log({ session, token, user });
      session.accessToken = token.accessToken;
      session.user = token.user as any;

      return session;
    }
  }
})