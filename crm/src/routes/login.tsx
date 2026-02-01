import { useForm } from '@tanstack/react-form'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import React, { useEffect } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { authClient } from '@/lib/auth-client'

const formSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
})

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()

  const { data: session } = authClient.useSession()

  // Redirect if already logged in
  if (session?.user) {
    navigate({ to: '/dashboard' })
    return null
  }

  // Test counter to see if component is reactive
  const [testCounter, setTestCounter] = React.useState(0)

  // Test if component is rendering
  useEffect(() => {
    console.log('🎯 LoginPage component mounted')
    console.log('🔍 Window object:', typeof window !== 'undefined' ? 'exists' : 'undefined')
  }, [])

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onChange: formSchema,
      onBlur: formSchema,
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      console.log('✅ Form submitted with data:', value)
      console.log('📊 Form values:', form.state.values)
      console.log('❌ Form errors:', form.getAllErrors())
      console.log('🔍 Form state:', {
        isValid: form.state.isValid,
        isDirty: form.state.isDirty,
        isSubmitting: form.state.isSubmitting,
      })
      
      try {
        const result = await authClient.signIn.email({
          email: value.email,
          password: value.password,
        })
    
        if (result.error) {
          toast.error(result.error.message || 'Invalid email or password')
        } else {
          toast.success('Login successful, redirecting to dashboard...')
          navigate({ to: '/dashboard' })
        }
      } catch (err) {
        console.error('Login error:', err)
        toast.error('An error occurred. Please try again.')
      }
    },
    onSubmitInvalid: ({ value }) => {
      console.log('❌ Form validation failed')
      console.log('📊 Form values:', value)
      console.log('❌ Form errors:', form.getAllErrors())
      console.log('🔍 Form state:', {
        isValid: form.state.isValid,
        isDirty: form.state.isDirty,
        errors: form.state.errors,
      })
      toast.error('Please fill in all required fields correctly')
    },
  })

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Login
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the dashboard
          </CardDescription>
          {/* Debug indicator */}
          {process.env.NODE_ENV === 'development' && (
            <div className="text-xs text-muted-foreground text-center mt-2">
              Component rendered. Test counter: {testCounter}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <form
            id="login-form"
            noValidate
            onSubmit={form.handleSubmit}
            onReset={(e) => {
              e.preventDefault()
              console.log('🔄 Form reset triggered')
            }}
          >
            <FieldGroup>
              <form.Field
                name="email"
                children={(field) => {
                  const isInvalid =
                    (field.state.meta.isTouched || field.state.meta.isDirty) && 
                    !field.state.meta.isValid
                  
                  // Debug logging
                  if (field.state.meta.isTouched || field.state.meta.isDirty) {
                    console.log('📧 Email field state:', {
                      value: field.state.value,
                      isTouched: field.state.meta.isTouched,
                      isDirty: field.state.meta.isDirty,
                      isValid: field.state.meta.isValid,
                      errors: field.state.meta.errors,
                    })
                  }
                  
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="email"
                        value={field.state.value}
                        onBlur={(e) => {
                          console.log('👆 Email onBlur triggered', e)
                          field.handleBlur()
                        }}
                        onChange={(e) => {
                          const newValue = e.target.value
                          setTestCounter((prev) => prev + 1)
                          console.log('⌨️ Email onChange EVENT FIRED:', newValue)
                          console.log('⌨️ Event object:', e)
                          field.handleChange(newValue)
                          console.log('⌨️ After handleChange, field value:', field.state.value)
                          // Also try window.alert as a fallback test
                          if (newValue.length === 1) {
                            console.warn('FIRST CHARACTER TYPED - Email field is working!')
                          }
                        }}
                        onInput={(e) => {
                          console.log('⌨️ Email onInput EVENT FIRED:', (e.target as HTMLInputElement).value)
                        }}
                        aria-invalid={isInvalid}
                        placeholder="Enter your email"
                        autoComplete="email"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                      {/* Debug info */}
                      {process.env.NODE_ENV === 'development' && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Touched: {field.state.meta.isTouched ? '✓' : '✗'} | 
                          Valid: {field.state.meta.isValid ? '✓' : '✗'} | 
                          Errors: {field.state.meta.errors.length}
                        </div>
                      )}
                    </Field>
                  )
                }}
              />
              <form.Field
                name="password"
                children={(field) => {
                  const isInvalid =
                    (field.state.meta.isTouched || field.state.meta.isDirty) && 
                    !field.state.meta.isValid
                  
                  // Debug logging
                  if (field.state.meta.isTouched || field.state.meta.isDirty) {
                    console.log('🔒 Password field state:', {
                      value: field.state.value ? '***' : '',
                      isTouched: field.state.meta.isTouched,
                      isDirty: field.state.meta.isDirty,
                      isValid: field.state.meta.isValid,
                      errors: field.state.meta.errors,
                    })
                  }
                  
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="password"
                        value={field.state.value}
                        onBlur={(e) => {
                          console.log('👆 Password onBlur triggered', e)
                          field.handleBlur()
                        }}
                        onChange={(e) => {
                          const newValue = e.target.value
                          console.log('⌨️ Password onChange EVENT FIRED:', newValue ? '***' : '')
                          console.log('⌨️ Event object:', e)
                          field.handleChange(newValue)
                          console.log('⌨️ After handleChange, field value length:', field.state.value.length)
                        }}
                        onInput={(e) => {
                          console.log('⌨️ Password onInput EVENT FIRED:', (e.target as HTMLInputElement).value ? '***' : '')
                        }}
                        aria-invalid={isInvalid}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                      {/* Debug info */}
                      {process.env.NODE_ENV === 'development' && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Touched: {field.state.meta.isTouched ? '✓' : '✗'} | 
                          Valid: {field.state.meta.isValid ? '✓' : '✗'} | 
                          Errors: {field.state.meta.errors.length}
                        </div>
                      )}
                    </Field>
                  )
                }}
              />
            </FieldGroup>
            <div className="mt-6">
              <Button 
                type="submit" 
                className="w-full"
                disabled={form.state.isSubmitting}
              >
                {form.state.isSubmitting ? 'Signing in...' : 'Sign in'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

