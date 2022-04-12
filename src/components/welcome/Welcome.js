import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Flex,
  Center
} from '@chakra-ui/react'
import React from 'react'
import Countdown from 'react-countdown';

const openingDate = new Date('04-24-2022')

export const Welcome = () => {
  return (
    <Flex mt="100" flexDir={'column'} justifyContent={'center'}>
      <iframe title="zavod" src="https://discord.com/widget?id=634799085991231518&theme=dark" width="350" height="500" allowtransparency="true" frameBorder="0" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>

      <Stat ml="75px">
        <StatLabel>До открытия сайта:</StatLabel>
        <StatNumber><Countdown date={openingDate} /></StatNumber>
        <StatHelpText>надеюсь</StatHelpText>
      </Stat>
    </Flex>
  )
}
