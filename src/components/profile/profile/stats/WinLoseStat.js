import React, { useEffect, useState } from 'react'
import { Avatar, Flex, Heading, Progress, Stat, StatHelpText, StatLabel, Text } from '@chakra-ui/react'
import secureFetch from '../../../../reusable/secureFetch';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';

export const WinLoseStat = (props) => {
  const data = {
    item_avatar_type: props.item_avatar_type,
    item_title: props.item_title,
    page_text: props.page_text,
    win_text_top: props.win_text_top,
    win_text_bottom: props.win_text_bottom,
    lose_text_top: props.lose_text_top,
    lose_text_bottom: props.lose_text_bottom,
    stat_url_path: props.stat_url_path,
  };

  const user = useSelector((state) => state.auth.user)

  const [items, setItems] = useState([
    {
      [data.item_avatar_type]: '',
      [data.item_title]: '',
      [data.win_text_top]: '',
      [data.win_text_bottom]: '',
      [data.lose_text_bottom]: '',
      [data.lose_text_top]: '',
      [data.stat_url_path]: '',
    }
  ])

  useEffect(() => {
    if (user.id)
      getItems().then(res => {
        setItems(res);
      })
  }, [user])

  function getItems() {
    return secureFetch(`${process.env.REACT_APP_API_URL}/api/users/${user.id}/${data.stat_url_path}`)
      .then(res => res.json())
  }

  function getItemValue(i) {
    return i[data.win_text_top] / (i[data.win_text_top] + i[data.lose_text_top]) * 100;
  }

  function getItemAvatarUrl(item, avatarType) {
    if (avatarType === 'discordAvatar') {
      return `https://cdn.discordapp.com/avatars/${item.discord_id}/${item.avatar_hash}`
    }

    if (avatarType === 'disciplineIcon') {
      return `${process.env.REACT_APP_API_URL}/${item.icon_path}`
    }
  }

  return items.length > 0 ?  (
    <Flex mt={50} gap={40}>
      <Heading maxW={250}>{data.page_text}</Heading>
      <Flex direction={'column'} gap={10}>
        {items.map(i => {
          return (
            <Flex gap={2} alignItems={'center'} key={i.id + 'lol'} justifyContent={'space-between'}>
            <Avatar name='teammate' size={'md'} src={getItemAvatarUrl(i, data.item_avatar_type)} />
            <Text maxW={100} textOverflow={'ellipsis'} whiteSpace={'nowrap'} overflow={'hidden'} fontSize={18}>{i[data.item_title]}</Text>
            <Flex direction={'column'} alignItems={'center'} m={0} p={0}>
              <Stat>
                <StatLabel>
                  <Flex justifyContent={'space-between'}>
                    <div>{i[data.win_text_top]}</div>
                    <div>{i[data.lose_text_top]}</div>
                  </Flex>
                </StatLabel>
                <Progress colorScheme={'green'} bgColor={'#d34545'} width={500} value={getItemValue(i)}></Progress>
                <StatHelpText mb={0}>
                <Flex justifyContent={'space-between'}>
                    <div>{data.win_text_bottom}</div>
                    <div>{data.lose_text_bottom}</div>
                  </Flex>
                </StatHelpText>
              </Stat>
            </Flex>
          </Flex>
          )
        })}
        
      </Flex>
    </Flex>
  ) : (
    <></>
  )
}
