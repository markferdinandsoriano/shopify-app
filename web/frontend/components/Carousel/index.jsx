import React, { useState } from "react";
import { Icon } from "@shopify/polaris";
import getNestedObject from "../../utils/getNestedObjects";
import { ArrowLeftMinor, ArrowRightMinor } from "@shopify/polaris-icons";

import "./style.css";

export default function Carousel({ data }) {
  const newData = data
    ? data?.map((items) => {
        return { ...items.node };
      })
    : [];

  const [slide, setSlide] = useState(0);

  const nextSlide = () => {
    setSlide(slide === newData?.length - 1 ? 0 : slide + 1);
  };

  const prevSlide = () => {
    setSlide(slide === 0 ? newData?.length - 1 : slide - 1);
  };

  return (
    <div className="carousel">
      <div onClick={prevSlide} className="arrow arrow-left">
        <Icon source={ArrowLeftMinor} color="base" />
      </div>

      {newData?.map((item, idx) => {
        return (
          <img
            src={item.url}
            alt={item.url}
            key={idx}
            loading="lazy"
            className={slide === idx ? "slide" : "slide slide-hidden"}
          />
        );
      })}
      <div className="arrow arrow-right" onClick={nextSlide}>
        <Icon source={ArrowRightMinor} color="base" />
      </div>

      <span className="indicators">
        {newData.map((_, idx) => {
          return (
            <button
              key={idx}
              className={
                slide === idx ? "indicator" : "indicator indicator-inactive"
              }
              onClick={() => setSlide(idx)}
            ></button>
          );
        })}
      </span>
    </div>
  );
}
