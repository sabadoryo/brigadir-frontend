import { Avatar, Box, Button, Container, Divider, Flex, FormControl, FormLabel, Heading, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Radio, RadioGroup, Stack, Text, useColorModeValue, useDisclosure } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import Timer from 'react-timer-wrapper';
import Timecode from 'react-timecode';
import secureFetch from '../../reusable/secureFetch';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';

export const Game = () => {
  const [clanwar, setClanwar] = useState({
    name: "",
    team_clanwar_teamA_idToteam: {
      name : "",
      team_members: [
        {
          users: {
            name: ""
          }
        }
      ]
    },
    team_clanwar_teamB_idToteam: {
      name : "",
      team_members: [
        {
          users: {
            name: ""
          }
        }
      ]
    },
    start_time: null,
    discipline: {
      name: ""
    },
    team_clanwar_winner_idToteam: {
      name : "",
      team_members: [
        {
          users: {
            name: ""
          }
        }
      ]
    },
    Queue: {
      users: {
        id: "",
        discord_id: null,
      }
    }
  });
  const params = useParams()
  const [timeGone, setTimeGone] = useState(1000)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [winnerId, setWinnerId] = useState()
  const user = useSelector((state) => state.auth.user)


  useEffect(() => {
    getClanwar().then(res => {
      setClanwar(res)
      console.log(new Date(res.start_time))
      const diff = (new Date()).getTime() - (Date.parse(res.start_time))

      setTimeGone(diff)
    })
  }, [])

  function getClanwar() {
    return secureFetch(`${process.env.REACT_APP_API_URL}/api/games/${params.game_id}`)
      .then(res => res.json())
  }

  async function endClanwar(){
    const requestOptions = {
      headers: {Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json'},
      method: 'POST',
      body: JSON.stringify({
          winner_id: winnerId
      })
  }

    const clanwar = await secureFetch(`${process.env.REACT_APP_API_URL}/api/games/${params.game_id}/end`, requestOptions)
      .then(res => res.json())
      .catch(err => console.log(err))

    onClose()

    setClanwar(clanwar)
  }

  function isAuthUserHost() {
    return clanwar.Queue.users.discord_id === user.id
  }

  return (
    <Container height={'100vh'} maxWidth={'100vw'}>
      <Text>{clanwar.team_clanwar_teamA_idToteam.name}</Text>
      <Flex direction={'column'} gap={75} align={'center'}>
        <Flex justify={'center'} align={'center'} gap={50} marginTop={'5%'}>
          {clanwar.team_clanwar_teamA_idToteam.team_members.map((m) => {
            return (<Box textAlign={'center'} key={m.id + 'id'}>
              <Avatar
                size={'2xl'}
                src={
                  `https://cdn.discordapp.com/avatars/${m.users.discord_id}/${m.users.avatar_hash}`
                }
                alt={m.name}
                mb={2}
              />

              <Text fontWeight={600} fontSize={20}>{m.users.name}</Text>
              <Text fontSize={'sm'} color={'gray.600'}>
                Звание
              </Text>
          </Box>)
          })}
        </Flex>
        <Divider></Divider>
        <Flex direction={'column'} align={'center'} justify={'center'} gap={5}>
          {!clanwar.winner_id ? (
            <>
            <Text>Играют в {clanwar.discipline.name}</Text>
              <Heading>
                <Timer active time={timeGone} duration={null}>
                  <Timecode />
                </Timer>
              </Heading>
            <Button onClick={onOpen} hidden={!isAuthUserHost()}>Закончить игру</Button>
            </>
          ) : (
            <>
            <Text>Игра завершена, победа команды: {clanwar.team_clanwar_winner_idToteam.name}</Text>
            </>
          )}
        </Flex>
        <Divider ></Divider>
        <Flex justify={'center'} align={'center'} gap={50}  marginBottom={'5%'}>
          {clanwar.team_clanwar_teamB_idToteam.team_members.map((m) => {
            return (<Box textAlign={'center'} key={m.id + 'id'}>
              <Avatar
                size={'2xl'}
                src={
                  `https://cdn.discordapp.com/avatars/${m.users.discord_id}/${m.users.avatar_hash}`
                }
                alt={m.name}
                mb={2}
              />

              <Text fontWeight={600} fontSize={20}>{m.users.name}</Text>
              <Text fontSize={'sm'} color={'gray.600'}>
                Звание
              </Text>
          </Box>)
          })}
        </Flex>
      </Flex>
      <Text>{clanwar.team_clanwar_teamB_idToteam.name}</Text>

      <Modal
        isOpen={isOpen}
        trapFocus={false}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Закончить Clan War</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Победитель</FormLabel>
              <RadioGroup onChange={value => setWinnerId(value)} value={winnerId} name="kek">
                <Stack direction='row'>
                  <Radio value={clanwar.team_clanwar_teamA_idToteam.id}>{clanwar.team_clanwar_teamA_idToteam.name}</Radio>
                  <Radio value={clanwar.team_clanwar_teamB_idToteam.id}>{clanwar.team_clanwar_teamB_idToteam.name}</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={endClanwar}>
              Завершить
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
  </Container>
  )
}
