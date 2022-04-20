import {
  Flex,
  Heading,
  Stack,
  chakra,
  Box,
  Link,
  Code
} from "@chakra-ui/react";
import { Authenticate } from "./Authenticate";

export default function Login() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code')

  if (!code) {
  return(
      <Flex
      flexDirection="column"
      width="100wh"
      height="100vh"
      backgroundColor="gray.200"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
      >
        <Code color="teal.400">Дарова, работяга</Code>
        <Box minW={{ base: "90%", md: "468px" }}>
        </Box>
      </Stack>
      <Box>
        Чтобы продолжить, 
        <Link color="teal.500" href={process.env.REACT_APP_LOGIN_REDIRECT_URL}>
          нажми
        </Link>
      </Box>
    </Flex>
    )
  } else {
    return <Authenticate code={code}/>
  }
}