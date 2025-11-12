import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../util/supabase'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Recupera la sessione corrente
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Listener per login/logout
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.subscription.unsubscribe()
  }, [])

  const signIn = (email, password) =>
    supabase.auth.signInWithPassword({ email, password })

  const signUp = (email, password, name) => {
    const trimmedName = name?.trim()
    const metadata = {}

    if (trimmedName) metadata.full_name = trimmedName

    return supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    })
  }

  const signOut = () => supabase.auth.signOut()

  return (
    <AuthContext.Provider
      value={{ user: session?.user ?? null, session, signIn, signUp, signOut, loading }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
