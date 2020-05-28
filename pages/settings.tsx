import * as React from 'react'
import { Box, Flex } from 'rebass'
import { Textarea } from '@rebass/forms'
import { useForm } from 'react-hook-form'
import { navigate, Head } from '@quercia/quercia'

import { Parent, Right } from '../components/split'
import Heading from '../components/heading'
import Button from '../components/button'
import Input from '../components/input'
import Label from '../components/label'

import Left from '../components/settings/left'
import Field from '../components/settings/field'

import { User } from '../types/data'

export interface SettingsProps {
  profile: User
  error?: string
}

export default ({ profile, error }: SettingsProps) => {
  const [isLoading, setLoading] = React.useState(
    error && typeof error !== 'string'
  )
  const {
    handleSubmit,
    register,
    errors,
    reset,
    formState: { dirty }
  } = useForm<User>()
  const onSubmit = (data: User) => {
    setLoading(true)

    // instantiate the POST form data
    const body = new FormData()
    body.set('username', data.username)
    body.set('firstname', data.firstname)
    body.set('lastname', data.lastname)
    body.set('location', data.location)
    body.set('description', data.description)

    navigate('/settings', 'POST', {
      body,
      credentials: 'same-origin'
    })
  }

  return (
    <>
      <Head>
        <title>profile settings - o2</title>
        <meta
          name='description'
          content='the settings of a user/organization'
        />
      </Head>
      <Parent py={6} px={[0, 9]}>
        <Left pages={['General']} current='General' base='/settings' />
        <Right
          as='form'
          onSubmit={handleSubmit(onSubmit)}
          flexDirection='column'
          px={[0, 4]}
        >
          <Heading my={3} fontSize='2rem' height={5} width={9}>
            Settings - {profile?.username}
          </Heading>

          <Field
            errors={errors}
            disabled={isLoading}
            name='username'
            placeholder='Username'
            defaultValue={profile?.username}
            description='The username is displayed in your profile and in every repository you own / contribute to.'
            ref={register({
              required: 'Required',
              pattern: {
                value: /^[a-z0-9_-]{3,15}$/,
                message: 'invalid username'
              }
            })}
          />

          <Field
            errors={errors}
            disabled={isLoading}
            name='firstname'
            placeholder='First name'
            defaultValue={profile?.firstname}
            description='Your First name is displayed in your profile and is visible to everybody. You can omit it for privacy concerns.'
            ref={register({
              pattern: {
                value: /^[a-z ,.'-]+$/i,
                message: 'invalid first name'
              }
            })}
          />

          <Field
            errors={errors}
            disabled={isLoading}
            name='lastname'
            placeholder='Last name'
            defaultValue={profile?.lastname}
            description='Follows the same rules as your First name.'
            ref={register({
              pattern: {
                value: /^[a-z ,.'-]+$/i,
                message: 'invalid last name'
              }
            })}
          />

          <Field
            errors={errors}
            disabled={isLoading}
            name='location'
            placeholder='Location'
            defaultValue={profile?.location}
            description='Your location is displayed in your profile. You can of course omit it for privacy concerns.'
            ref={register()}
          />

          <Box px={2} py={4}>
            <Heading known color='primary.default'>
              Description
            </Heading>

            <Input
              as={Textarea}
              css={{
                minWidth: '100%',
                maxWidth: '100%'
              }}
              sx={{ minHeight: 5, height: 7 }}
              disabled={isLoading}
              name='description'
              placeholder='Empty description'
              defaultValue={profile?.description}
              ref={register({
                maxLength: {
                  value: 250,
                  message: 'The description cannot be loger than 250 chars.'
                }
              })}
            />

            <Label htmlFor='description'>A brief description of yourself</Label>
            {errors.description && (
              <Label htmlFor='description' variant='error'>
                {errors.description?.message.toString()}
              </Label>
            )}
          </Box>

          <Flex py={6} px={2} justifyContent='space-between'>
            <Button onClick={() => reset()} disabled={!dirty}>
              Reset
            </Button>
            <Button type='submit' disabled={!dirty}>
              Save
            </Button>
          </Flex>
        </Right>
      </Parent>
    </>
  )
}
