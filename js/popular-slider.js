$(document).ready(function () {
  $('.popular-carousel').slick({
    slidesToShow: 2,
    prevArrow: false,
    nextArrow: false,
    infinite: false
  });
  $('.brands-wrapper').slick({
    prevArrow: false,
    nextArrow: false,
    infinite: false,
    responsive: [{
      breakpoint: 10000,
      settings: {
        slidesToShow: 6,
        slidesToScroll: 6,
        settings: 'unslick'
      }
    },
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        centerMode: true,
        variableWidth: true
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 400,
      settings: {
        centerMode: true,
        variableWidth: true
      }
    }
    ]
  });
});