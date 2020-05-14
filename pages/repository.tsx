import { styled } from 'goober'
import * as React from 'react'
import snarkdown from 'snarkdown'

import { Head, SSG } from '@quercia/quercia'

import Branch from '../components/repository/branch'
import C from '../components/base'
import Empty from '../components/repository/empty'
import Layout from '../components/repository/layout'
import Tree from '../components/repository/tree'
import Skeleton from '../components/skeleton'
import { Ref, Repository, Tree as ITree, User } from '../types/data'

export interface RepositoryProps {
  account: User
  repository: Repository
  owns: boolean
  tree: ITree
  refs: Ref[]
  readme: string
}

const Container = styled(C)`
  padding: 1.5em;
  overflow: auto;
`

const Description = styled('div')`
  display: flex;
  justify-content: space-between;
  text-overflow: ellipsis;
`

export default ({
  repository,
  owns,
  tree,
  account,
  readme,
  refs
}: RepositoryProps) => {
  if (!refs) {
    refs = []
  }

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
      <Layout owns={owns} repository={repository} page='Overview'>
        <Description>
          {SSG ? (
            <Skeleton width='70%' height='1.5em' />
          ) : (
            <code>{repository.description}</code>
          )}
          <Branch
            repository={repository}
            current={tree?.branch.name}
            refs={refs}
            disabled={refs.length === 0}
          />
        </Description>
        {!tree && !SSG && <Empty repository={repository} owns={owns} />}
        {(tree || SSG) && <Tree repository={repository} tree={tree} />}
        {readme && (
          <Container dangerouslySetInnerHTML={{ __html: snarkdown(readme) }} />
        )}
      </Layout>
    </>
  )
}
