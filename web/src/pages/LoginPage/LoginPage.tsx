import { useEffect, useRef, useState } from 'react'

import {
  Form,
  Label,
  TextField,
  PasswordField,
  Submit,
  FieldError,
} from '@redwoodjs/forms'
import { Link, navigate, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import { toast, Toaster } from '@redwoodjs/web/toast'

import { useAuth } from 'src/auth'

const LoginPage = () => {
  const { isAuthenticated, logIn } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      navigate(routes.home())
    }
  }, [isAuthenticated])

  const emailRef = useRef<HTMLInputElement>(null)
  const [showPassword, setShowPassword] = useState(false)
  useEffect(() => {
    emailRef.current?.focus()
  }, [])

  const onSubmit = async (data: Record<string, string>) => {
    const response = await logIn({
      username: data.email,
      password: data.password,
    })

    if (response.message) {
      toast(response.message)
    } else if (response.error) {
      toast.error(response.error)
    } else {
      toast.success('Welcome back!')
    }
  }

  return (
    <>
      <Metadata title="Login" />
      <main className="flex items-center justify-center min-h-screen bg-gray-900">
        <Toaster toastOptions={{ duration: 6000 }} />
        <div className="w-full max-w-md bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white">Connexion</h2>
              <p className="text-sm text-gray-400 mt-2">Entrez vos identifiants pour accéder à votre compte</p>
            </div>
            <Form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label
                  name="email"
                  className="block text-sm font-medium text-gray-300"
                  errorClassName="block text-sm font-medium text-red-500"
                >
                  Email
                </Label>
                <TextField
                  name="email"
                  className='w-full text-white bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2'
                  ref={emailRef}
                  validation={{
                    required: {
                      value: true,
                      message: "Email is required",
                    },
                  }}
                />
                <FieldError name="email" className="text-sm text-red-500" />
              </div>

              <div className="space-y-2">
                <Label
                  name="password"
                  className="block text-sm font-medium text-gray-300"
                  errorClassName="block text-sm font-medium text-red-500"
                >
                  Password
                </Label>
                <div className="relative">
                  <PasswordField
                    name="password"
                    className='w-full text-white bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2'
                    autoComplete="current-password"
                    validation={{
                      required: {
                        value: true,
                        message: "Password is required",
                      },
                    }}
                    type={showPassword ? "text" : "password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <img src="/oeil-fermer.png" alt="Hide password" className="h-5 w-5 text-gray-400" />
                    ) : (
                      <img src="/oeil.png" alt="Show password" className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                <FieldError name="password" className="text-sm text-red-500" />
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <button
                    type='submit'
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Se connecter
                  </button>
                  <Submit>
                    {({ loading }) => (
                      <button type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Submit"}
                      </button>
                    )}
                  </Submit>
                </div>
                <Link to={routes.forgotPassword()} className="text-sm text-blue-400 hover:underline">
                  mot de passe oublié ?
                </Link>
              </div>
            </Form>
          </div>
        </div>
      </main>
    </>
  )
}

export default LoginPage