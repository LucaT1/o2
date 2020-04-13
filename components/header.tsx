import * as React from 'react'
import { usePage, navigate } from '@quercia/quercia'
import styled from '@emotion/styled'
import { darken, lighten } from 'polished'

import { SpacedH4, SpacedLink, Link } from './typography'
import _Logo from './logo'

import Theme from '../types/theme'
import { BaseData } from '../types/data'

const Container = styled.nav<{ theme?: Theme }>`
  position: sticky;
  top: 0;
  left: 0;
  right: 0;

  /* 2.5 ems - the border (0.0625em) */
  height: 2.4375em;
  line-height: 2.5em;
  padding: 0 2vw;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  div {
    display: flex;
  }

  background: ${({ theme }) =>
    theme.dark
      ? darken(0.1)(theme.background)
      : lighten(0.5)(theme.background)};
  border-bottom: 1px solid
    ${({ theme }) =>
      theme.dark
        ? lighten(0.2)(theme.background)
        : darken(0.2)(theme.background)};
`

// height = 2.4375em
const Logo = styled(_Logo)<React.SVGProps<SVGSVGElement>>`
  height: 0.75em;
  margin: 0.85em;
  cursor: pointer;
`

const Header: React.FunctionComponent = () => {
  const props = usePage()[1] as BaseData

  return (
    <Container>
      <div>
        <Logo onClick={() => navigate('/')} />
        <SpacedH4 known>o2</SpacedH4>
      </div>
      <div>
        {props.account ? (
          <>
            <SpacedLink to='/add'>+</SpacedLink>
            <SpacedH4>
              <Link known to={`/${props.account.username}`}>
                {props.account.username}
              </Link>
            </SpacedH4>
            <SpacedLink to='/logout'>⟶</SpacedLink>
          </>
        ) : (
          <>
            <SpacedLink known to='/login'>
              login
            </SpacedLink>
            <a style={{ userSelect: 'none' }}>/</a>
            <SpacedLink known to='/register'>
              register
            </SpacedLink>
          </>
        )}
      </div>
    </Container>
  )
}

if (process.env.NODE_ENV !== 'production') {
  Header.displayName = 'Header'
}

export default Header
