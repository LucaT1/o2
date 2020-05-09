import * as React from 'react'
import { Head, SSG } from '@quercia/quercia'
import { styled } from 'goober'
import snarkdown from 'snarkdown'

import { Repository, Tree as ITree, User } from '../types/data'
import Skeleton from '../components/skeleton'

import _Container from '../components/repository/container'
import Layout from '../components/repository/layout'
import Empty from '../components/repository/empty'
import Tree from '../components/repository/tree'
import Branch from '../components/repository/branch'

export interface RepositoryProps {
  account: User
  repository: Repository
  tree: ITree
  readme: string
}

const Container = styled(_Container)`
  padding: 1.5em;
  overflow: auto;
`

const Description = styled('div')`
  display: flex;
  justify-content: space-between;
  text-overflow: ellipsis;
`

export default ({ repository, tree, account, readme }: RepositoryProps) => {
  return (
    <>
      <Head>
        <title>
          {typeof repository === 'object'
            ? `${repository.owner}/${repository.name}`
            : 'repository'}{' '}
          - o2
        </title>
        <meta name='description' content='a git repository on the o2 service' />
      </Head>
      <Layout repository={repository} page='Overview'>
        {SSG ? (
          <Skeleton width='100%' height='2em' />
        ) : (
          <Description>
            <code>{repository.description}</code>
            <Branch current='master' branches={['master', 'test']} />
          </Description>
        )}
        {!tree && !SSG && <Empty repository={repository} account={account} />}
        {(tree || SSG) && <Tree repository={repository} tree={tree} />}
        {readme && (
          <Container dangerouslySetInnerHTML={{ __html: snarkdown(readme) }} />
        )}
      </Layout>
    </>
  )
}
