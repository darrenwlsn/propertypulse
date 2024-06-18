import connectDB from '@/config/database'
import User from '@/models/User'

import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
    providers: [
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          authorization: {
            params: {
              prompt: "consent",
              access_type: "offline",
              response_type: "code"
            }
          }
        })
      ],
      callbacks: {
        // Invoked on successful signin
        async signIn({ profile }) {
          console.log('profile is ', profile)
          // 1. Connect to database
          await connectDB()
          console.log('database connected')
          // 2. check if user exists
          const userExists = await User.findOne({ email: profile.email })
          console.log('we have userExists ',  userExists)
          // 3. if not, add user to database
          if (!userExists) {
            console.log('creating user')
            // Truncate username if too long
            const username = profile.name.slice(0,20)
            console.log('have username', username)

            await User.create({
              email: profile.email,
              username,
              image: profile.picture
            })
          }
          // 4. return true to allow signin
          return true
        },
        // Modifies the session object
        async session({ session }) {
            // 1. Get user from database
            const user = await User.findOne({ email: session.user.email })
            // 2. Assign the userid to the session
            session.user.id = user._id.toString()
            // 3 . Return the session
            return session
        }
      }
}