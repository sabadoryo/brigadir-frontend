import React from 'react'
import { Tab, Tabs, TabPanels, TabList, TabPanel } from '@chakra-ui/react'

export const Profile = () => {
  return (
    <Tabs variant='enclosed'>
      <TabList>
        <Tab>One</Tab>
        <Tab>Two</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <p>one!</p>
        </TabPanel>
        <TabPanel>
          <p>two!</p>
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}
