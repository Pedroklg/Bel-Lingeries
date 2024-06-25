import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';

const Slider = () => {
  const slides = [
    '/banners/banner1.png',
    '/banners/banner2.png',
    '/banners/banner3.png',
  ];

  return (
    <Swiper
      slidesPerView={1}
      loop
      autoplay={{ delay: 3000 }}
      className="mySwiper"
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={index}>
          <div className="flex justify-center items-center h-[14rem] sm:h-[22rem] md:h-[26rem] lg:h-[32rem] xl:h-[38rem]">
            <img src={slide} alt={`Slide ${index + 1}`} className="w-full h-auto" />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Slider;
