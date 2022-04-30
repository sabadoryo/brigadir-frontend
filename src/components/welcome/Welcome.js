import {
    Box,
    Stack,
    Text,
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    useColorModeValue
} from '@chakra-ui/react';
import React, {useEffect, useState} from 'react'
import secureFetch from '../../reusable/secureFetch';
import './welcome.css'


const openingDate = new Date('04-24-2022')

function StatsCard(props) {
    const {title, stat} = props;
    return (
        <Stat
            px={{ base: 4, md: 8 }}
            py={'5'}
            shadow={'xl'}
            border={'1px solid'}
            borderColor={useColorModeValue('gray.800', 'gray.500')}
            rounded={'lg'}
            borderRadius={'8px'}
            height={'120px'}
            cursor={'crosshair'}
            transition={'all 2s'}
            _hover={{
                animationDirection: 'alternate',
                transition: 'all 2s',
                transform: 'rotate3d(1, 1, 1, 360deg);',
            }}
            userSelect={'none'}
            boxShadow={'0px 0px 0px'}
            backdropFilter={'blur(5px)'}
        >
            <StatLabel fontWeight={'medium'} isTruncated>
                {title}
            </StatLabel>
            <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
                {stat}
            </StatNumber>
        </Stat>
    );
}


export const Welcome = () => {
    const [stats, setStats] = useState({maxPlayedDiscipline: {name: ''}, maxPogLooter: {name: ''}});

    useEffect(() => {
        getMainPageStats()
            .then(data => {
                setStats(data)
            })
    }, [])

    return (
        <Stack
            height={'100vh'}
            // bg={useColorModeValue('gray.50', 'gray.800')}
            py={16}
            overflow={'none'}
            px={8}
            align={'center'}
            position={'relative'}
        >

            <Text
                fontSize={{base: 'xl', md: '2xl'}}
                textAlign={'center'}
                // marginTop={100}
                maxW={'3xl'}>
                Статистика сайта:
            </Text>
            <Box maxW="7xl" mx={'auto'} pt={5} px={{base: 2, sm: 12, md: 17}}>
                <SimpleGrid columns={{base: 3, md: 3}} spacing={{base: 5, lg: 5}}>
                    <StatsCard title={'Всего было сыграно'} stat={`${stats.clanWarsCount} квшек`}/>
                    <StatsCard title={'Количество пользователей:'} stat={`${stats.usersCount}`}/>
                    <StatsCard title={'Всего на КВшки было потрачено'} stat={`${stats.overallSpentHours}+ часов`}/>
                    <StatsCard title={'Самая популярная дисциплина'} stat={`${stats.maxPlayedDiscipline.name}`}/>
                    <StatsCard title={'Больше всего МВП у:'} stat={`${stats.maxPogLooter.name}`}/>
                </SimpleGrid>
            </Box>
        </Stack>
    )
}

function getMainPageStats() {
    return secureFetch(`${process.env.REACT_APP_API_URL}/api/stats/main-page`)
        .then(res => res.json())
}