import React, { useEffect } from 'react'
import { Flex, CircularProgress, CircularProgressLabel } from '@chakra-ui/react'
import { useDispatch } from 'react-redux'
import { authenticate } from '../../redux/slices/authSlice'
import secureFetch from '../../reusable/secureFetch'


export function Authenticate() {
  const dispatch = useDispatch()
  const code = (new URLSearchParams(window.location.search)).get('code')

  useEffect(() => {
    const requestOptions = {
      method: 'POST',
      body: new URLSearchParams({ 
        client_id: process.env.REACT_APP_CLIENT_ID,
        client_secret: process.env.REACT_APP_CLIENT_SECRET,
        code: code,
        grant_type: "authorization_code",
        redirect_uri: process.env.REACT_APP_URL
      })
    }

    secureFetch("https://discord.com/api/oauth2/token", requestOptions)
    .then(res => res.json())
    .then(
      async (result) => {
        console.log(result)
        dispatch(authenticate(result))
        window.location.href = "/"
      },
      (error) => {
        console.log(error)
      }
    )
  }, [code, dispatch])

  return (
    <Flex
      flexDirection="column"
      width="100wh"
      height="100vh"
      backgroundColor="gray.200"
      justifyContent="center"
      alignItems="center"
    >
      <CircularProgress isIndeterminate color='green.300' size={200}>
        <CircularProgressLabel fontSize={10}>Вы будете перемещены через несколько секунд</CircularProgressLabel>
      </CircularProgress>
    </Flex>
  )
}


async function getUserInfo(token, dispatch) {
  secureFetch("https://discordapp.com/api/users/@me", {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(
      (result) => {
        localStorage.setItem('id', result.id)
        localStorage.setItem('avatar', result.avatar)
        localStorage.setItem('username', result.username)
      },
      (error) => {
        console.log(error)
      }
    )
}