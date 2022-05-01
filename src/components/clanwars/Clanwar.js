import { Container, Flex } from '@chakra-ui/react'
import React from 'react'
import Guilds from './Guilds'

export const Clanwar = () => {
  return (
    <Container maxW='container.lg'>
      <Flex>
        <Guilds/>
      </Flex>
    </Container>
  )
}
