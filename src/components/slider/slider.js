import './slider.scss';
import slider from './slider.svg';

export default function Slider() {
    return (
        <div className="slider">
            <img src={slider} alt="" className="slider__img"/>
            <p className="slider__text">Пожалуйста, подождите...</p>
        </div>
    )
}