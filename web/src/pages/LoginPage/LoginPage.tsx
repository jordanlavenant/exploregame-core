import { useEffect, useRef, useState } from 'react'

import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

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
      toast.error('Mauvais identifiants')
    }
  }

  return (
    <>
      <Metadata title="Login" />
      <main className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-full max-w-md bg-card shadow-lg rounded-lg overflow-hidden border border-border">
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground">Connexion</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Entrez vos identifiants pour accéder à votre compte
              </p>
            </div>
            <Form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label
                  name="email"
                  className="block text-sm font-medium text-foreground"
                  errorClassName="block text-sm font-medium text-destructive"
                >
                  Email
                </Label>
                <TextField
                  name="email"
                  className="w-full bg-input text-foreground border border-input rounded-md shadow-sm focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none sm:text-sm p-2"
                  ref={emailRef}
                  validation={{
                    required: {
                      value: true,
                      message: 'Email is required',
                    },
                  }}
                />
                <FieldError name="email" className="text-sm text-destructive" />
              </div>

              <div className="space-y-2">
                <Label
                  name="password"
                  className="block text-sm font-medium text-foreground"
                  errorClassName="block text-sm font-medium text-destructive"
                >
                  Password
                </Label>
                <div className="relative">
                  <PasswordField
                    name="password"
                    className="w-full bg-input text-foreground border border-input rounded-md shadow-sm focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none sm:text-sm p-2"
                    autoComplete="current-password"
                    validation={{
                      required: {
                        value: true,
                        message: 'Password is required',
                      },
                    }}
                    type={showPassword ? 'text' : 'password'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-2"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                <FieldError
                  name="password"
                  className="text-sm text-destructive"
                />
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <button
                    type="submit"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium py-2 px-4 rounded-md"
                  >
                    Se connecter
                  </button>
                  <Submit>
                    {({ loading }) => (
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 font-medium py-2 px-4 rounded-md"
                      >
                        {loading ? 'Logging in...' : 'Submit'}
                      </button>
                    )}
                  </Submit>
                </div>
                <Link
                  to={routes.forgotPassword()}
                  className="text-sm text-primary hover:underline"
                >
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
