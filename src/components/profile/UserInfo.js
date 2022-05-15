import { Avatar, Box, Flex, Image, Stat, StatLabel, StatNumber, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import coinsImg from '../../resources/img/coins.png';
import secureFetch from '../../reusable/secureFetch';

export const UserInfo = (props) => {
  const [profiles, setProfiles] = useState([
    {
      discipline: {
        icon_path: "",
        label: "",
        name: "",
      },
      points: 0,

    }
  ])
  const [coins, setCoins] = useState('0')
   
  useEffect(() => {
      getUserProfiles()
        .then(res => {
          setProfiles(res.clanwar_profile)
          setCoins(res.discord_score)
        })
  }, [])

  function getUserProfiles() {
    return secureFetch(`${process.env.REACT_APP_API_URL}/api/users/${props.user.id}/clanwar-profiles`)
      .then(res => res.json())
  }

  return (
    <Flex margin={'0 auto'} direction={'column'} justify={'center'} align={'center'}>
        <Avatar
                  size={'2xl'}
                  src={
                    `https://cdn.discordapp.com/avatars/${props.user.id}/${props.user.avatar}`
                  }
                  alt={'kek'}
                  mb={2}
                />
        <Text fontSize={'20'}>{props.user.username}</Text>
        <Flex align={'center'}>{coins}<Image boxSize='15px' src={coinsImg} alt={'qurultay-icons'}/></Flex>
        <Flex gap={'5'} mt={'2'}>
          {
            profiles.map(p => {
              return (<StatsCard
                key={p.id + 'kek'}
                title={p.discipline.label}
                stat={p.points}
                imgSrc={`${process.env.REACT_APP_API_URL}/${p.discipline.icon_path}`}
            />)
            })
          }
        </Flex>
      </Flex>
  )
}


function StatsCard(props) {
  const { title, stat, imgSrc } = props;
  return (
    <Stat
      px={{ base: 2, md: 4 }}
      py={'5'}
      shadow={'xl'}
      maxW={'400'}
      border={'1px solid'}
      rounded={'lg'}>
      <Flex justifyContent={'space-between'}>
        <Box pl={{ base: 2, md: 4 }}>
          <StatLabel fontWeight={'medium'} isTruncated>
            {title}
          </StatLabel>
          <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
            {stat}
          </StatNumber>
        </Box>
        <Box marginLeft={'5'}>
            <Image boxSize='25px' src={imgSrc} alt={'qurultay-icons'}/>
        </Box>
      </Flex>
    </Stat>
  );
}
