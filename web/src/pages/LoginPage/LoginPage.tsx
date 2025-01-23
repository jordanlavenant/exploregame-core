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

      <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <Toaster toastOptions={{ duration: 6000 }} />
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Login</h2>
            <p className="text-sm text-gray-600 mt-2">Entrez vos identifiants pour accéder à votre compte</p>
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
                className='w-full text-black border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2'
                ref={emailRef}
                validation={{
                  required: {
                    value: true,
                    message: "Email is required",
                  },
                }}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    type="email"
                    placeholder="Enter your email"
                    className={`w-full text-black ${fieldState.error ? "border-red-500" : ""}`}
                  />
                )}
              />
              <FieldError name="email" className="text-sm text-red-500" />
            </div>

            <div className="space-y-2">
              <Label
                name="password"
                className="block text-sm font-medium text-gray-700"
                errorClassName="block text-sm font-medium text-red-500"
              >
                Password
              </Label>
              <div className="relative">
                <PasswordField
                  name="password"
                  className='w-full text-black border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2'
                  autoComplete="current-password"
                  validation={{
                    required: {
                      value: true,
                      message: "Password is required",
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className={`w-full text-black pr-10 ${fieldState.error ? "border-red-500" : ""}`}
                    />
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {/* {showPassword ? (
                    <EyeOffIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )} */}
                </button>
              </div>
              <FieldError name="password" className="text-sm text-red-500" />
            </div>



            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/login')} // Remplacez par l'action souhaitée
                  className="text-sm text-blue-600 hover:underline"
                >
                  Login
                </button>
                <Submit>
                  {({ loading }) => (
                    <button type="submit" disabled={loading}>
                      {loading ? "Logging in..." : "Submit"}
                    </buttonutton>
                  )}
                </Submit>
              </div>
              <Link to={routes.forgotPassword()} className="text-sm text-blue-600 hover:underline">
                Forgot Password?
              </Link>
            </div>

            {/* <div className="flex justify-between items-center">
              <Submit>
                {({ loading }) => (
                  <Button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                )}
              </Submit>
              <Link to={routes.forgotPassword()} className="text-sm text-blue-600 hover:underline">
                Forgot Password?
              </Link>
            </div> */}

          </Form>
        </div>
      </div>
    </main>
    </>
  )
}

export default LoginPage
