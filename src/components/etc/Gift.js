import { Button, Container, Flex, FormControl, FormLabel, Heading, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Table, TableContainer, Tbody, Td, Text, Tfoot, Th, Thead, Tr, useDisclosure } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import secureFetch from '../../reusable/secureFetch'

const OverlayOne = () => (
  <ModalOverlay
    bg='blackAlpha.300'
    backdropFilter='blur(10px) hue-rotate(90deg)'
  />
)

export default function Gift() {
  const [winner, setWinner] = useState({name: 'Рандомус'})
  const [users, setUsers] = useState([{name: ''}])
  const [probabilities, setProbabilities] = useState([{name: '', value: 0}])

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [overlay, setOverlay] = React.useState(<OverlayOne />)

  useEffect(() => {
    getUsers()
      .then(res => {
        setUsers(res)
      })
    getProbabilities()
      .then(res => {
        setProbabilities(res)
      })
  }, [])

  return (
    <Flex direction={'column'} justifyContent={'center'} align={'center'}>
      <TableContainer>
        <Table size='sm'>
          <Thead>
            <Tr>
              <Th>Чел</Th>
              <Th isNumeric>шанс выигрыша</Th>
            </Tr>
          </Thead>
          <Tbody>
            {probabilities.map(p => {
              return (
                <Tr>
                  <Td>{p.name}</Td>
                  <Td isNumeric>{Math.ceil(p.value)}%</Td>
              </Tr>
              )
            })}
          </Tbody>
        </Table>
      </TableContainer>
      <Flex justify={'center'} align={'center'}>
      <Stack
        spacing={4}
        w={'full'}
        maxW={'md'}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}
        my={12}>
        <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
          (случайный) победитель!
        </Heading>
        <FormControl id="email" isRequired>
          <Input
            color={'blackAlpha.800'}
            value={winner.name}
            isDisabled
          />
        </FormControl>
        <Stack spacing={6}>
          <Button
            bg={'blue.400'}
            color={'white'}
            onClick={() => chooseWinner(setWinner, users, setOverlay, onOpen)}
            _hover={{
              bg: 'blue.500',
            }}>
            Определить
          </Button>
        </Stack>
      </Stack>
      </Flex>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        {overlay}
        <ModalContent>
          <ModalHeader>ПОЗДРАВЛЯЕМ</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>{winner.name}</Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>закрыть</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  )
}

function getUsers() {
  return secureFetch(`${process.env.REACT_APP_API_URL}/api/users`)
    .then(res => res.json())
}

function getWinner() {
  return secureFetch(`${process.env.REACT_APP_API_URL}/api/users/get-winner`)
    .then(res => res.json())
}

async function chooseWinner(setWinner, users, setOverlay, onOpen) {
  const interval = setInterval(() => setWinner(users[Math.floor(Math.random() * users.length)]),200)

  getWinner()
    .then(res => {
      setTimeout(() => {
        clearInterval(interval)
        setWinner(res)
        setOverlay(<OverlayOne />)
        onOpen()
      }, 10000)
    })
}

function getProbabilities() {
  return secureFetch(`${process.env.REACT_APP_API_URL}/api/users/get-probabilities`)
  .then(res => res.json())
}