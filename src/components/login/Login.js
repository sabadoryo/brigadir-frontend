import {Authenticate} from "./Authenticate";

import './login.scss';

import kurultayImg from '../../resources/img/kurultay-img.svg'
import {Container} from "@chakra-ui/react";

export default function Login() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code')

    if (!code) {
        return (
            <div className='login'>
                <Container maxW="1200px" className="login__container">
                    <div className="login__box">
                        <img src={kurultayImg} alt="" className="login__img"/>

                        <h1 className="login__heading">
                            С возвращением, воин!
                        </h1>

                        <a href={process.env.REACT_APP_LOGIN_REDIRECT_URL} className="login__btn">Войти</a>
                    </div>
                </Container>
            </div>
        )
    } else {
        return <Authenticate code={code}/>
    }
}