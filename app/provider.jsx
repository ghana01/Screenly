
"use client"

import React, { useEffect, useState, useContext } from 'react'
import { supabase } from '@/services/supabaseClient'
import { UserDetailContext } from '@/context/UserDetailContext'

/**
 * Provider Component
 * - Watches for user authentication (Google sign-in)
 * - Automatically stores user data in Supabase database
 * - Provides user data to all child components via context
 */
function Provider({ children }) {
    // State to store the current user's database record
    const [currentUser, setCurrentUser] = useState()

    useEffect(() => {
        /**
         * Check if user exists in database, if not create a new record
         * @param {Object} authenticatedUser - User object from Supabase auth
         */
        async function saveUserToDatabase(authenticatedUser) {
            // Exit if no user or email provided
            if (!authenticatedUser?.email) {
                console.log('No authenticated user found')
                return
            }

            try {
                // STEP 1: Check if user already exists in database
                const { data: existingUsers, error: fetchError } = await supabase
                    .from('User')
                    .select('*')
                    .eq('email', authenticatedUser.email)

                if (fetchError) {
                    console.error('Database error while checking user:', fetchError.message)
                    return
                }

                // STEP 2: If user exists, update state and exit
                if (existingUsers && existingUsers.length > 0) {
                    const userFromDatabase = existingUsers[0]
                    console.log('✅ User found in database:', userFromDatabase.email)
                    setCurrentUser(userFromDatabase)
                    return
                }

                // STEP 3: User doesn't exist, prepare new user data
                const newUserData = {
                    email: authenticatedUser.email,
                    name: authenticatedUser.user_metadata?.full_name || authenticatedUser.email,
                    picture: authenticatedUser.user_metadata?.picture || null,
                }

                console.log('Creating new user in database:', newUserData.email)

                // STEP 4: Insert new user into database
                const { data: insertedUser, error: insertError } = await supabase
                    .from('User')
                    .insert([newUserData])
                    .select()

                if (insertError) {
                    const errorMessage = insertError?.message || JSON.stringify(insertError)
                    const isDuplicateError = errorMessage.toLowerCase().includes('duplicate') || 
                                           errorMessage.toLowerCase().includes('unique')

                    if (isDuplicateError) {
                        // Another process created the user at the same time (race condition)
                        console.log('⚠️ User was just created by another process, fetching...')
                        
                        // Fetch the user that was just created
                        const { data: refetchedUsers } = await supabase
                            .from('User')
                            .select('*')
                            .eq('email', authenticatedUser.email)

                        if (refetchedUsers && refetchedUsers[0]) {
                            setCurrentUser(refetchedUsers[0])
                        }
                    } else {
                        console.error('❌ Error inserting user into database:', errorMessage)
                    }
                } else {
                    // Successfully created new user
                    const newUserRecord = insertedUser?.[0]
                    console.log('✅ New user created in database:', newUserRecord?.email)
                    setCurrentUser(newUserRecord)
                }
            } catch (unexpectedError) {
                console.error('❌ Unexpected error saving user:', unexpectedError)
            }
        }

        /**
         * Initialize: Check if user is already signed in when page loads
         */
        async function checkCurrentUser() {
            const { data, error } = await supabase.auth.getUser()
            
            if (error) {
                console.log('Error checking current user:', error.message)
                return
            }

            const authenticatedUser = data?.user
            if (authenticatedUser) {
                console.log('Found signed-in user on page load:', authenticatedUser.email)
                await saveUserToDatabase(authenticatedUser)
            }
        }

        // Run initial check on component mount
        checkCurrentUser()

        /**
         * Listen for authentication state changes (sign in/out events)
         */
        const { data: authSubscription } = supabase.auth.onAuthStateChange(
            async (authEvent, session) => {
                console.log('🔐 Auth event:', authEvent)

                if (authEvent === 'SIGNED_IN') {
                    const authenticatedUser = session?.user
                    if (authenticatedUser) {
                        await saveUserToDatabase(authenticatedUser)
                    }
                }

                if (authEvent === 'SIGNED_OUT') {
                    console.log('👋 User signed out')
                    setCurrentUser(null)
                }
            }
        )

        // Cleanup: Unsubscribe from auth changes when component unmounts
        return () => {
            try {
                authSubscription?.subscription?.unsubscribe()
            } catch (cleanupError) {
                // Silently ignore cleanup errors
            }
        }
    }, [])

    return (
        <UserDetailContext.Provider value={{ user: currentUser, setUser: setCurrentUser }}>
            {children}
        </UserDetailContext.Provider>
    )
}

export default Provider

/**
 * Custom hook to access user data from anywhere in the app
 * @returns {Object} { user, setUser }
 * 
 * Usage example:
 * const { user, setUser } = useUser()
 * console.log(user.email)
 */
export const useUser = () => {
    const userContext = useContext(UserDetailContext)
    
    if (!userContext) {
        throw new Error('useUser must be used within a Provider component')
    }
    
    return userContext
}
