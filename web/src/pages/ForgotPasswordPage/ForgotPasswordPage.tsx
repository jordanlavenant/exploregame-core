"use client"

import { useEffect, useRef, useState } from "react"
import { Link, navigate, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import { toast, Toaster } from "react-hot-toast"

import { Form, Label, TextField, FieldError, Submit } from "@redwoodjs/forms"

import { useAuth } from "src/auth"

const ForgotPasswordPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { isAuthenticated, logIn } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      navigate(routes.home())
    }
  }, [isAuthenticated])

  const emailRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    emailRef?.current?.focus()
  }, [])

  const onSubmit = async (data: { email: string }) => {
    setIsSubmitting(true)
    // const response = await forgotPassword(data.email)
    setIsSubmitting(false)

    // if (response.error) {
    //   toast.error(response.error)
    // } else {
    //   toast.success("Un lien pour réinitialiser votre mot de passe a été envoyé à " + response.email)
    //   router.push(routes.login())
    // }
  }

  return (
    <>
      <Metadata title="Mot de passe oublié" />
      <main className="flex items-center justify-center min-h-screen bg-gray-100">
        <Toaster toastOptions={{ duration: 6000 }} />
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Mot de passe oublié</h2>
              <p className="text-sm text-gray-600 mt-2">Entrez votre email pour réinitialiser votre mot de passe</p>
            </div>
            <Form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label
                  name="email"
                  className="block text-sm font-medium text-gray-700"
                  errorClassName="block text-sm font-medium text-red-500"
                >
                  Email
                </Label>
                <TextField
                  name="email"
                  className="w-full text-black border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                  errorClassName="w-full text-black border border-red-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm p-2"
                  ref={emailRef}
                  validation={{
                    required: {
                      value: true,
                      message: "L'email est requis",
                    },
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "L'email n'est pas valide",
                    },
                  }}
                />
                <FieldError name="email" className="text-sm text-red-500" />
              </div>

              <div className="flex justify-between items-center">
                <Submit
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Envoi en cours..." : "Réinitialiser"}
                </Submit>
                <Link to={routes.login()} className="text-sm text-blue-600 hover:underline">
                  Retour à la connexion
                </Link>
              </div>
            </Form>
          </div>
        </div>
      </main>
    </>
  )
}

export default ForgotPasswordPage