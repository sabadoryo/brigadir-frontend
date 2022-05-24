import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import React from 'react'
import { WinLoseStat } from './stats/WinLoseStat'

export const Stats = () => {
  return (
    <Tabs variant='soft-rounded' isFitted>
      <TabList>
        <Tab>Союзники</Tab>
        <Tab>Дисциплины</Tab>
        <Tab>Лучший игрок</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <WinLoseStat 
          item_avatar_type={'discordAvatar'}
          item_title={'name'}
          page_text={'Teammates Stats'}
          win_text_top={'wins'}
          win_text_bottom={'Выиграно'}
          lose_text_top={'loses'}
          lose_text_bottom={'Проиграно'}
          stat_url_path={'teammates-stats'}
          ></WinLoseStat>
        </TabPanel>
        <TabPanel>
        <WinLoseStat 
          item_avatar_type={'disciplineIcon'}
          item_title={'label'}
          page_text={'Clanwars Stats'}
          win_text_top={'wins'}
          win_text_bottom={'Выиграно'}
          lose_text_top={'loses'}
          lose_text_bottom={'Проиграно'}
          stat_url_path={'clanwars-stats'}
          ></WinLoseStat>
        </TabPanel>
        <TabPanel>
        <WinLoseStat 
          item_avatar_type={'disciplineIcon'}
          item_title={'label'}
          page_text={'MVP Stats'}
          win_text_top={'pog_times'}
          win_text_bottom={'MVP'}
          stat_url_path={'pog-stats'}
          ></WinLoseStat>
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}
