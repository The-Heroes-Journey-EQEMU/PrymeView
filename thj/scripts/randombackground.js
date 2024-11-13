window.onload = function() {
    // Array of image URLs
    const images = [
      '/thj/images/backgrounds/loadscreen01.jpg',
      '/thj/images/backgrounds/loadscreen02.jpg',
      '/thj/images/backgrounds/loadscreen03.jpg',
      '/thj/images/backgrounds/loadscreen04.jpg',
      '/thj/images/backgrounds/loadscreen05.jpg',
      '/thj/images/backgrounds/loadscreen06.jpg',
      '/thj/images/backgrounds/loadscreen07.jpg',
      '/thj/images/backgrounds/loadscreen08.jpg',
      '/thj/images/backgrounds/loadscreen09.jpg',
      '/thj/images/backgrounds/loadscreen10.jpg',
      '/thj/images/backgrounds/loadscreen11.jpg',
      '/thj/images/backgrounds/loadscreen12.jpg',
      '/thj/images/backgrounds/loadscreen13.jpg',
      '/thj/images/backgrounds/loadscreen14.jpg',
      '/thj/images/backgrounds/loadscreen15.jpg'
    ];

    // Select a random image
    const randomImage = images[Math.floor(Math.random() * images.length)];

    // Apply the random image as background
    document.body.style.backgroundImage = `url(${randomImage})`;
  };