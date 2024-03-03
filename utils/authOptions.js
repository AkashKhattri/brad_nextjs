import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/config/database";
import User from "@/models/User";
import bcryptjs from "bcryptjs";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "Property Pulse",
      credentials: {
        email: {
          label: "Username",
          type: "text",
          placeholder: "jhondoe@email.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Connect to database
        await connectDB();

        if (!credentials.email || !credentials.password) {
          return null;
        }
        // Check if user exists
        const userExists = await User.findOne({ email: credentials.email });

        if (!userExists) {
          return null;
        }

        //Check if password match\
        const passwordMatch = await bcryptjs.compare(
          credentials.password,
          userExists.password
        );
        if (!passwordMatch) {
          return null;
        }

        return userExists;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    // Invoked on successful signin
    async signIn({ account, user, profile }) {
      // Connect to database
      await connectDB();
      // Check if user exists
      let userExists;
      if (profile) {
        userExists = await User.findOne({ email: profile.email });
      } else {
        userExists = await User.findOne({ email: user.email });
      }

      // If not, then add user to database
      if (!userExists && account.provider === "google") {
        // Truncate user name if too long
        const username = profile.name.slice(0, 20);

        await User.create({
          email: profile.email,
          username,
          image: profile.picture,
        });
      }
      // Return true to allow sign in
      return true;
    },
    // Modifies the session object
    async session({ session }) {
      // Get user from database
      const user = await User.findOne({ email: session.user.email });
      // Assign the user id to the session
      session.user.id = user._id.toString();
      session.user.name = user.username;
      // Return session
      return session;
    },
  },
};
