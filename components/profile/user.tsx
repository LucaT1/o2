import * as React from 'react'
import { usePrerender } from '@quercia/quercia'
import { styled } from 'goober'
import format from 'tinydate'

import { H2, H4, SpacedH4, A } from '../typography'
import Skeleton from '../skeleton'
import Image from '../image'

import { ProfileProps } from '../../pages/profile'

const User = styled('section')`
  width: 15em;
  padding: 0 2.5em;

  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 960px) {
    width: 100%;
    padding: 0 1em;
    flex-direction: row;
  }

  @media (max-width: 380px) {
    flex-direction: column;
  }
`

const Info = styled('div')`
  padding-left: 0;

  @media (max-width: 960px) {
    padding-left: 1em;
  }
`

const Picture = styled(Image)`
  width: 10em;
  height: 10em;
  border-radius: 50%;
`

const Line = styled('div')`
  width: 10em;
  display: flex;
  flex-direction: row;
`

const Description = styled(Line)`
  margin-top: 1em;
`

const Profile = ({ user }: ProfileProps) => (
  <User>
    <Picture src={user?.picture + '?s=300'} />
    <Info>
      <Line>
        <H2>{user?.username}</H2>
      </Line>
      <Line>
        <H4>{user?.firstname}</H4>
        <SpacedH4>{user?.lastname}</SpacedH4>
      </Line>
      <Description>
        <A known>📍</A>
        <A>{user?.location}</A>
      </Description>
      <Description>
        {usePrerender() ? (
          <Skeleton width='100%' height='5em' />
        ) : (
          <code>{user.description}</code>
        )}
      </Description>
    </Info>
  </User>
)

if (process.env.NODE_ENV !== 'production') {
  ;(User as any).displayName = 'User'
}

export default Profile
