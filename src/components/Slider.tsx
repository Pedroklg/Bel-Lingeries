import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import Image from 'next/image';

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
          <div className="flex justify-center items-center h-[14rem] xl:h-[40rem]">
            <Image src={slide} alt={`Slide ${index + 1}`} width={2000} height={600} />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Slider;
