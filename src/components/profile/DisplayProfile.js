import { CloseIcon } from '@chakra-ui/icons'
import { Box, Flex, Heading, Spinner, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import secureFetch from '../../reusable/secureFetch'
import { UserInfo } from './UserInfo'

export const DisplayProfile = () => {
  const [user, setUser] = useState({id: null})
  const params = useParams()
  const [userNotFound, setUserNotFound] = useState(false)
  const [loading ,setLoading] = useState(true)

  useEffect(() => {
    getUser().then(res => {
      if (res.success) {
        setUser(res.data)
        setLoading(false)
      } else {
        setLoading(false)
      }
    }).catch(err => {
      console.log(err)
    })
    
    return () => {
      
    }
  }, [])
  
  function getUser() {
    return secureFetch(`${process.env.REACT_APP_API_URL}/api/users/${params.discord_id}/info`)
      .then(res => res.json())
  }

  return (
    <Flex direction={'column'} gap={5}>

    {!loading ? (
      user.id ? (
        <UserInfo user={user}/>
      ) : (
        <UserNotFoundComponent/>
      )
    ) : (
      <Spinner margin={'0 auto'}></Spinner>
    )}
    </Flex>
  )
}

function UserNotFoundComponent() {
  return (
    <Box textAlign="center" py={10} px={6}>
      <Box display="inline-block">
        <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          bg={'red.500'}
          rounded={'50px'}
          w={'55px'}
          h={'55px'}
          textAlign="center">
          <CloseIcon boxSize={'20px'} color={'white'} />
        </Flex>
      </Box>
      <Heading as="h2" size="xl" mt={6} mb={2}>
        Пользователь не найден
      </Heading>
      <Text color={'gray.500'}>
        Этот пользователь не зарегестрирован в нашей базе данных
      </Text>
    </Box>
  )
}