import { Container, Flex, Stack } from '@chakra-ui/react'
import React from 'react'
import Guilds from './Guilds'

export const Clanwar = () => {
  return (
    <Container maxW='container.lg'>
      <Flex marginTop={'10%'}>
        <Guilds/>
      </Flex>
    </Container>
  )
}
