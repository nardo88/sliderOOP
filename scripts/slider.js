'use strict';
/*
Данные конструктора:
main - селектор обертки слайдера
wrap - селектор блока который оборачивает слайды, т.е. сам слайдер
next - селектор кнопки next
prev - селектор кнопки prev
infinity - флаг будет ли наш слайдер в петле (т.е. бесконечно листаться)
position - позиция первого слайда, по умолчанию = 0
slidesToShow - сколько отображается слайдов на экране одновременно - по умолчанию 3
responsive - это массив в котором будут храниться настройки поведения слайдера при разных расширениях экрана
*/ 

class SliderCarusel {
    constructor({
        main,
        wrap,
        next,
        prev,
        infinity = false,
        position = 0,
        slidesToShow = 3,
        responsive = [],
    }) {
        // если main и wrap не заданы в консоль выводим ошибку о том что эти селекторы обязательны
        if (!main || !wrap) {
            console.warn('slider-carousel: Необходимо 2 свойства, "main" и "wrap"! ');
        }

        this.main = document.querySelector(main);
        this.wrap = document.querySelector(wrap);
        // slides это массив элементов - слайдов
        this.slides = document.querySelector(wrap).children;
        this.next = document.querySelector(next);
        this.prev = document.querySelector(prev);
        this.slidesToShow = slidesToShow;
        // настроки слайдера
        this.options = {
            position,
            // ширина слайда высчитывается в процентах 100 делим на количество слайдов и округляем в меньшую сторонй
            // например у нас 4 слайда 100 делим на 4 получаем ширину слайда 25%
            widthSlides: Math.floor(100 / this.slidesToShow),
            infinity,
            // максимальный показатель позиции - длина массива минус количество отображенных слайдов
            maxPosition: this.slides.length - this.slidesToShow
        }

        this.responsive = responsive
    }
    // инициализация слайдера
    init() {
        // добавляем элементам слайда классы у которых будут свои стили
        this.addGloClass();
        // затем добавляем в DOM тег style где будут прописаны стили для слайдера
        this.addStyle();
        // если селекторы кнопок прокрутки слайдера были переданы
        if (this.prev && this.next) {
            // то запускаем метод контроля слайдера
            this.controlSlider();
        } else {
            // иначе добавляем дефолтные кнопки 
            this.addArrow();
            // и затем запускаем контроль
            this.controlSlider();

        }
        // если были переданы правила поведения слайдера на разных разрешениях экрана
        if (this.responsive){
            // то запускаем инициализация адаптивности слайдера
            this.responseInit();
        }
    }
    // добавляем классы
    addGloClass() {
        this.main.classList.add('glo-slider');
        this.wrap.classList.add('glo-slider__wrap');
        // пробегаемся по массиву со слайдами и добавляем им класс
        for (const item of this.slides) {
            item.classList.add('glo-slider__item');
        }
    }
    // прописываем стили
    addStyle() {
        // получаем тег style с id styleCarousel-style
        let style = document.getElementById('styleCarousel-style');
        // если такого нет то создаем его
        if (!style){
            // это мы делаем что бы при изменении ширины экрана нам не плодить стили
            // создаем
            style = document.createElement('style');
            // задаем ID
            style.id = 'styleCarousel-style';
        }
        // добавляем стили
        style.textContent = `
                .glo-slider{
                    overflow: hidden !important;
                }
                .glo-slider__wrap{
                    display: flex !important;
                    transition: transform 0.5s !important;
                    will-change: transform !important;
                }
                .glo-slider__item{
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center;
                    flex: 0 0 ${this.options.widthSlides}%;
                    margin: auto 0 !important;
                }
                .glo-slider__prev, .glo-slider__next{
                    margin: 0 10px;
                    border: 20px solid transparent;
                    background: transparent;
                    cursor: pointer;
                    outline: none;
                }
                .glo-slider__prev{
                    border-right-color: #19b5fe;
                }
                .glo-slider__next{
                    border-left-color: #19b5fe;
                }
                .glo-slider__prev,
                .glo-slider__next:hover{
                    background: transparent !important;
                }
                
                
            `;
        // вставляем 
        document.head.appendChild(style);
    }
    // вешаем события на кнопки слайдера
    controlSlider() {
        this.prev.addEventListener('click', this.prevSlider.bind(this))
        this.next.addEventListener('click', this.nextSlider.bind(this))
    }
    // показать предыдущий слайдер
    prevSlider() {
        if (this.options.infinity || this.options.position > 0) {
            --this.options.position;
            if (this.options.position < 0) {
                this.options.position = this.options.maxPosition;
            }
            this.wrap.style.transform = `translateX(-${this.options.position * this.options.widthSlides}%)`;
        }
    }
    // показать следующий слайдер
    nextSlider() {
        if (this.options.infinity || this.options.position < this.options.maxPosition) {
            ++this.options.position
            if (this.options.position > this.slides.length - this.slidesToShow) {
                this.options.position = 0;
            }

            this.wrap.style.transform = `translateX(-${this.options.position * this.options.widthSlides}%)`;

        }
    }
    // метод добавления кнопок
    addArrow() {
        // создаем
        this.prev = document.createElement('button');
        this.next = document.createElement('button');
        // добавляем классы
        this.prev.classList.add('glo-slider__prev');
        this.next.classList.add('glo-slider__next');
        // вставляем в main
        this.main.appendChild(this.prev);
        this.main.appendChild(this.next);
    }
    // поведение слайдера в случае изменения ширины экрана
    responseInit() {
        // сохраняем дефолтное количество слайдов
        const slidesToShowDefault = this.slidesToShow;
        // получаем массив со значениями брекпоинтов (точек слома)
        const allResponse = this.responsive.map(item => item.breackpoint);
        // получаем максимальное значение ширины экрана - точки слома
        const maxResponse = Math.max(...allResponse);
        // функция проверки ширины экрана
        const checkResponse = () => {
            // получаем ширину экрана
            const widthWindow = document.documentElement.clientWidth;
            // если ширина экрана меньше точки слома
            if (widthWindow < maxResponse){
                // пробегаемся по массиву со точками слома
                for(let i = 0; i < allResponse.length; i++){
                    // если ширина окна меньше точки слома
                    if (widthWindow < allResponse[i]){
                        // мы меняем количество отображаемых слайдов
                        this.slidesToShow = this.responsive[i].slidesToShow;
                        // пересчитываем ширину слайда
                        this.options.widthSlides = Math.floor(100 / this.slidesToShow);
                        // обновляем стили
                        this.addStyle()
                    } 
                } 
            } else {
                // иначе - т.е. ширина окна вернулось в HD размер мы восстанавливаем
                // то количество слайдов которое было по дефолту
                this.slidesToShow = slidesToShowDefault;
                // пересчитываем размер слайда
                this.options.widthSlides = Math.floor(100 / this.slidesToShow);
                // и обновляем стили
                this.addStyle()
            }
        };
        // запускаем теперь эту функцию
        checkResponse();
        // и так же вешаем слушатель на браузер и слушаем изменение ширины экрана
        window.addEventListener('resize', checkResponse)
    }
}


export default SliderCarusel