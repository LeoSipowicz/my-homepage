const IMAGE_OPTIONS = {
    cup: ['whiteCup', 'blueCup', 'redCup', 'yellowCup'],
    keys: ['keysAllUp', 'keysDownDown', 'keysUpDown', 'keysReturnDown'],
    links: ['glyptoLink', 'rwfLink']
}

const LINK_URLS = {
    glyptoLink: 'https://www.glyptodonnews.com',
    rwfLink: 'https://www.randomweddingfinder.com'
}

let isMuted = false;
let backgroundMusic = null;
let hasStartedAudio = false;

const initAudio = () => {
    backgroundMusic = new Audio('./public/audio/hum.wav');
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.3;
}

const playSound = (soundFile) => {
    if (!isMuted) {
        const audio = new Audio(`./public/audio/${soundFile}`);
        audio.volume = 0.5;
        audio.play().catch(e => console.log('Sound failed:', e));
    }
}

const startBackgroundAudio = () => {
    if (!isMuted && backgroundMusic) {
        backgroundMusic.play()
            .then(() => console.log('Background hum started'))
            .catch(e => console.log('Background hum failed:', e));
    }
}

const stopBackgroundMusic = () => {
    if (backgroundMusic) {
        backgroundMusic.pause();
    }
}

const getNextObject = (imageArray, currentSrc) => {
    const currentFileName = currentSrc.split('/').pop().split('.')[0];
    const currentIndex = imageArray.indexOf(currentFileName);
    const nextIndex = (currentIndex + 1) % imageArray.length;
    const basePath = currentSrc.substring(0, currentSrc.lastIndexOf('/') + 1);
    return `${basePath}${imageArray[nextIndex]}.png`;
}

const showPopup = () => {
    const computer = document.getElementById('computer');
    const currentLink = computer.src.split('/').pop().split('.')[0];
    const url = LINK_URLS[currentLink];
    
    if (url) {
        currentUrl = url;
        const message = document.getElementById('popup-message');
        message.innerHTML = `Do you want to navigate to<br><strong>${url}</strong>?`;
        document.getElementById('popup-overlay').style.display = 'block';
    }
}

const closePopup = () => {
    document.getElementById('popup-overlay').style.display = 'none';
    currentUrl = '';
}

const confirmNavigation = () => {
    if (currentUrl) {
        window.open(currentUrl, '_blank');
    }
    closePopup();
}

const handleRegionClick = async (region) => {
    // Start background audio on first click (browser requirement)
    if (!hasStartedAudio) {
        initAudio();
        startBackgroundAudio();
        hasStartedAudio = true;
    }
    
    const cup = document.getElementById('cup')
    const computer = document.getElementById('computer')
    const keys = document.getElementById('keys')

    if (region === 'cup') {
        playSound(['babing.wav', 'baloing.wav', 'yahoo.wav'][Math.floor(Math.random() * 3)]);
        const nextSrc = getNextObject(IMAGE_OPTIONS['cup'], cup.src)
        cup.src = nextSrc
    }
    if (region === 'computer') {
        playSound('click.wav');
        const nextSrc = getNextObject(IMAGE_OPTIONS['links'], computer.src)
        computer.src = nextSrc
    }
    if (region === 'keyboard-up') {
        playSound('click.wav');
        keys.src = './public/img/keys/keysUpDown.png'
        const nextSrc = getNextObject(IMAGE_OPTIONS['links'], computer.src)
        computer.src = nextSrc
        await new Promise(r => setTimeout(r, 300));
        keys.src = './public/img/keys/keysAllUp.png'
    }
    if (region === 'keyboard-down') {
        playSound('click.wav');
        keys.src = './public/img/keys/keysDownDown.png'
        const nextSrc = getNextObject(IMAGE_OPTIONS['links'], computer.src)
        computer.src = nextSrc
        await new Promise(r => setTimeout(r, 300));
        keys.src = './public/img/keys/keysAllUp.png'
    }
    if (region === 'keyboard-return') {
        playSound('click.wav');
        keys.src = './public/img/keys/keysReturnDown.png'
        await new Promise(r => setTimeout(r, 300));
        keys.src = './public/img/keys/keysAllUp.png'
        showPopup();
    }
}

const toggleMute = () => {
    const muteToggle = document.getElementById('mute-toggle')
    isMuted = !isMuted;
    
    if (isMuted) {
        muteToggle.src = './public/img/icons/mute-icon.svg'
        stopBackgroundMusic();
    } else {
        muteToggle.src = './public/img/icons/speaker-icon.svg'
        startBackgroundAudio();
    }
}