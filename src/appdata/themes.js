const themes = {
    Anime: [
      { src: "https://images.alphacoders.com/135/thumb-1920-1350899.png", font: "'Varela Round', sans-serif", subFont: "'Montserrat', sans-serif", theme: 'anime', imageName: 'Hello', owner: 'Satoshi world' },
      { src: "https://images4.alphacoders.com/134/thumb-1920-1349198.png", font: "'Varela Round', sans-serif", subFont: "'Montserrat', sans-serif", theme: 'anime', imageName: 'Hello', owner: 'Satoshi world' },
      { src: "https://images5.alphacoders.com/138/thumb-1920-1386977.png", font: "'Bubblegum Sans', sans-serif", subFont: "'Montserrat', sans-serif" },
      { src: "https://images8.alphacoders.com/134/thumb-1920-1349195.png", font: "'Bubblegum Sans', sans-serif", subFont: "'Montserrat', sans-serif" },
    ],
    Animal: [
      { src: "https://images.unsplash.com/photo-1534361960057-19889db9621e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", font: "'Pacifico', cursive", subFont: "'Pangolin', cursive" },
      { src: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", font: "'Pacifico', cursive", subFont: "'Pangolin', cursive" },
      { src: "https://images.unsplash.com/photo-1722863579619-5c75dc740b04?q=80&w=1176&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", font: "'Pacifico', cursive", subFont: "'Pangolin', cursive" },
      { src: "https://images.unsplash.com/photo-1472491235688-bdc81a63246e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", font: "'Pacifico', cursive", subFont: "'Pangolin', cursive" },
    ],
    Café: [
      { src: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", font: "'Playfair', serif", subFont: "'Fredoka', sans-serif" },
      { src: "https://plus.unsplash.com/premium_photo-1663932464937-e677ddfc1d55?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", font: "'Playfair', serif", subFont: "'Fredoka', sans-serif" },
      { src: "https://images.unsplash.com/photo-1723612442835-7ed3162f3263?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", font: "'Playfair', serif", subFont: "'Fredoka', sans-serif" },
      { src: "https://images.unsplash.com/photo-1596480695897-0c2d075e2e15?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", font: "'Playfair', serif", subFont: "'Fredoka', sans-serif" },
    ],
    City: [
      { src: "https://images.unsplash.com/photo-1496568816309-51d7c20e3b21?q=80&w=1631&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", font: "'Rubik', sans-serif", subFont: "'Montserrat', sans-serif", theme: 'City', imageName: 'Dubai at sunrise', owner: 'Piotr Chrobot' },
      { src: "https://images.unsplash.com/photo-1548206269-5b8fcd4765bb?q=80&w=1631&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", font: "'Rubik', sans-serif", subFont: "'Montserrat', sans-serif" },
      { src: "https://images.unsplash.com/photo-1692000954654-e4862df11756?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", font: "'Rubik', sans-serif", subFont: "'Montserrat', sans-serif" },
      { src: "https://images.pexels.com/photos/534757/pexels-photo-534757.jpeg", font: "'Bebas Neue', sans-serif", subFont: "'Montserrat', sans-serif" },
      { src: "https://images.unsplash.com/photo-1536599018102-9f803c140fc1?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", font: "'Rubik', sans-serif", subFont: "'Montserrat', sans-serif" },
    ],
    Nature: [
      { src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", font: "'Open Sans', sans-serif", subFont: "'Montserrat', sans-serif" },
      { src: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", font: "'Open Sans', sans-serif", subFont: "'Montserrat', sans-serif" },
      { src: "https://images.unsplash.com/photo-1688344302697-298fe7ab64f1?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", font: "'Open Sans', sans-serif", subFont: "'Montserrat', sans-serif" },
      { src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", font: "'Open Sans', sans-serif", subFont: "'Montserrat', sans-serif" },
    ],
  };

  export default themes;