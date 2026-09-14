import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";

import authConfig from "./auth.config";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,

    session: {
        strategy: "jwt",
    },

    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        }),

        Credentials({
            name: "Credentials",

            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                },
                password: {
                    label: "Password",
                    type: "password",
                },
            },

            async authorize(credentials) {
                const email =
                    typeof credentials?.email === "string"
                        ? credentials.email.trim().toLowerCase()
                        : "";

                const password =
                    typeof credentials?.password === "string"
                        ? credentials.password
                        : "";

                if (!email || !password) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: { email },

                    select: {
                        id: true,
                        name: true,
                        email: true,
                        passwordHash: true,
                    },
                });

                if (!user?.passwordHash) {
                    return null;
                }

                const valid = await bcrypt.compare(
                    password,
                    user.passwordHash,
                );

                if (!valid) {
                    return null;
                }

                return {
                    id: user.id,
                    name: user.name ?? "FairTrip traveler",
                    email: user.email ?? undefined,
                };
            },
        }),
    ],

    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "google" && user.email) {
                const email = user.email.trim().toLowerCase();

                const databaseUser = await prisma.user.upsert({
                    where: { email },

                    update: {
                        name: user.name ?? undefined,
                    },

                    create: {
                        email,
                        name: user.name ?? "FairTrip traveler",
                    },

                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                });

                user.id = databaseUser.id;
                user.name = databaseUser.name;
                user.email = databaseUser.email;

                return true;
            }

            return true;
        },

        async jwt({ token, user }) {
            if (user?.id) {
                token.sub = user.id;
                token.userId = user.id;
            }

            return token;
        },

        async session({ session, token }) {
            if (
                session.user &&
                typeof token.sub === "string"
            ) {
                session.user.id = token.sub;
            }

            return session;
        },
    },
});