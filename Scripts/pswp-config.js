var openPhotoSwipe = function(idx) {
    var pswpElement = document.querySelectorAll('.pswp')[0];

    // build items array
    var items = [
        {
            src: 'Content/realizations/1.jpg',
            w: 628,
            h: 419
        },
        {
            src: 'Content/realizations/2.jpg',
            w: 697,
            h: 591
        },
        {
            src: 'Content/realizations/3.jpg',
            w: 1500,
            h: 1500
        },
        {
            src: 'Content/realizations/4.jpg',
            w: 1000,
            h: 750
        },
        {
            src: 'Content/realizations/5.jpg',
            w: 500,
            h: 381
        },
        {
            src: 'Content/realizations/6.jpg',
            w: 600,
            h: 814
        },
        {
            src: 'Content/realizations/7.jpg',
            w: 960,
            h: 960
        },
        {
            src: 'Content/realizations/8.jpg',
            w: 960,
            h: 960
        },
        {
            src: 'Content/realizations/9.jpg',
            w: 540,
            h: 960
        },
        {
            src: 'Content/realizations/10.jpg',
            w: 720,
            h: 960
        },
        {
            src: 'Content/realizations/11.jpg',
            w: 960,
            h: 540
        },
        {
            src: 'Content/realizations/12.jpg',
            w: 533,
            h: 960
        }
        
    ];
    
    // define options (if needed)
    var options = {
        showAnimationDuration: 0,
        hideAnimationDuration: 0,
        index: idx
    };

    // Initializes and opens PhotoSwipe
    var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
    gallery.init();
}