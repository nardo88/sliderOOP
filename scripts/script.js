import SliderCarusel from './slider.js'

const carousel = new SliderCarusel({
    main: '.companies-wrapper',
    wrap: '.companies-hor',
    // prev: '#test-left',
    // next: '#test-right',
    slidesToShow: 4,
    infinity: true,

    responsive: [
        {
            breackpoint: 1024,
            slidesToShow: 3
        },
        {
            breackpoint: 768,
            slidesToShow: 2
        },
        {
            breackpoint: 576,
            slidesToShow: 1
        }
    ]
});
carousel.init();