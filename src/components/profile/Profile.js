import React from 'react'
import { Tab, Tabs, TabPanels, TabList, TabPanel,Flex, Spinner} from '@chakra-ui/react'
import { useSelector } from 'react-redux'
import { UserInfo } from './UserInfo';
import { Recalibrate } from './profile/Recalibrate';
import { Stats } from './profile/Stats';

export const Profile = () => {
  const user = useSelector((state) => state.auth.user)

  return (
    <Flex direction={'column'} gap={5}>
      {user.id ? (
        <UserInfo user={user}/>
      ) : (
        <Spinner margin={'0 auto'}></Spinner>
      )}
      <Tabs variant='enclosed-colored' isFitted defaultIndex={1}>
        <TabList>
          <Tab>Статистика</Tab>
          <Tab>Перекалибровка</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Stats></Stats>
          </TabPanel>
          <TabPanel>
            <Recalibrate user={user}></Recalibrate>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  )
}
