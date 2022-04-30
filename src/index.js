import React from 'react';
import ReactDOM from 'react-dom';

import {ChakraProvider, ColorModeScript} from '@chakra-ui/react'
import {BrowserRouter} from 'react-router-dom';

import {Provider} from 'react-redux'

import App from './App';

import './index.css';
import theme from "./theme";

import store from './redux/store'

ReactDOM.render(
    <BrowserRouter>
        <ChakraProvider theme={theme}>
                <Provider store={store}>
                    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
                    <App/>
                </Provider>
        </ChakraProvider>

    </BrowserRouter>,
    document.getElementById('root')
);
