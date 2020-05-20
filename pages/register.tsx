import * as React from 'react'
import { useForm } from 'react-hook-form'
import { Box } from 'rebass'
import { Input, Label } from '@rebass/forms'
import { Head, navigate } from '@quercia/quercia'

import Center from '../components/center'
import Button from '../components/button'

interface Data {
  email: string
  username: string
  password: string
}

interface RegisterProps {
  error: string
}

export default ({ error }: RegisterProps) => {
  const [isLoading, setLoading] = React.useState(typeof error == 'string')
  const { handleSubmit, register, errors } = useForm<Data>()

  React.useEffect(() => {
    if (error) {
      setLoading(false)
    }
  }, [error])

  const onSubmit = (data: Data) => {
    setLoading(true)

    // instantiate the POST form data
    const body = new FormData()
    body.set('email', data.email)
    body.set('username', data.username)
    body.set('password', data.password)

    navigate('/register', 'POST', { body, credentials: 'same-origin' })
  }

  return (
    <>
      <Head>
        <title>register - o2</title>
      </Head>
      <Center
        css={{ height: 'calc(100vh - 3.5rem)', flex: 1 }}
        as='form'
        onSubmit={handleSubmit(onSubmit)}
      >
        {error && <h1 style={{ color: 'red' }}>{error}</h1>}

        <Box py={4} width={9}>
          <Input
            name='email'
            placeholder='Email'
            disabled={isLoading}
            ref={register({
              required: 'Required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: 'invalid email address'
              }
            })}
          />
          {errors.email && (
            <Label htmlFor='email' variant='error'>
              {errors.email?.message.toString()}
            </Label>
          )}
        </Box>

        <Box py={4} width={9}>
          <Input
            name='username'
            placeholder='Username'
            disabled={isLoading}
            ref={register({
              required: 'Required',
              pattern: {
                value: /^[a-z0-9_-]{3,15}$/,
                message: 'invalid username'
              }
            })}
          />
          {errors.username && (
            <Label htmlFor='username' variant='error'>
              {errors.username?.message.toString()}
            </Label>
          )}
        </Box>

        <Box py={4} width={9}>
          <Input
            name='password'
            placeholder='Password'
            type='password'
            disabled={isLoading}
            ref={register({
              required: 'Required',
              pattern: {
                value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                message:
                  'invalid password. Must contain at least 8 characters, at least 1 numeric and 1 letter'
              }
            })}
          />
          {errors.password && (
            <Label htmlFor='password' variant='error'>
              {errors.password?.message.toString()}
            </Label>
          )}
        </Box>

        <Button disabled={isLoading} type='submit'>
          Submit
        </Button>
      </Center>
    </>
  )
}
