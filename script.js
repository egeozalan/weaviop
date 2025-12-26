const searchQueries = {
    "tr": {
        "happy": ["Tarkan Şımarık", "Kenan Doğulu Çakkıdı", "Serdar Ortaç Dansöz", "Gülşen Bangır Bangır", "Ajda Pekkan Yaz Yaz Yaz", "Demet Akalın Türkan", "Edis Arıyorum", "Zeynep Bastık Ara", "Hadise Dum Tek Tek", "Murat Boz Özledim", "Simge Öpücem", "Sefo Bilmem Mi", "Reynmen Leila", "Yalın Cumhuriyet", "Athena Ben Böyleyim", "Hande Yener Romeo", "Mustafa Sandal Aya Benzer"],
        "neutral": ["Yüzyüzeyken Konuşuruz Dinle Beni Bi", "Madrigal Seni Dert Etmeler", "Dolu Kadehi Ters Tut Gitme", "Kaan Boşnak Bırakma Kendini", "Adamlar Koca Yaşlı Şişko Dünya", "Ezhel Felaket", "Zeynep Bastık Uslanmıyor Bu", "Emir Can İğrek Nalan", "Pinhani Hele Bi Gel", "Canozan Toprak Yağmura", "Mor ve Ötesi Daha Mutlu Olamam", "Teoman İstanbul'da Sonbahar", "Gripin Aşk Nerden Nereye"],
        "energetic": ["Athena 12 Dev Adam", "Duman Senden Daha Güzel", "MaNga Bir Kadın Çizeceksin", "Mor ve Ötesi Cambaz", "Şebnem Ferah Bu Aşk Fazla Sana", "Teoman Papatya", "Hayko Cepkin Fırtınam", "Yüksek Sadakat Haydi Gel İçelim", "Ceza Suspus", "Ezhel Aya", "Gazapizm Heyecanı Yok", "Norm Ender Mekanın Sahibi", "Kurban Yalan"],
        "sad": ["Müslüm Gürses Affet", "Sezen Aksu Vazgeçtim", "Ahmet Kaya Kum Gibi", "Halil Sezai İsyan", "Şebnem Ferah Sil Baştan", "Duman Haberin Yok Ölüyorum", "Teoman Paramparça", "Cem Adrian Herkes Gider Mi", "Sıla Yan Benimle", "Sertab Erener Olsun", "Model Değmesin Ellerimiz", "Feridun Düzağaç Alev Alev", "Yıldız Tilbe Vazgeçtim", "Sezen Aksu Tükeneceğiz", "Müslüm Gürses Nilüfer"]
    },
    "en": {
        "happy": ["Pharrell Williams Happy", "Justin Timberlake Can't Stop the Feeling", "Mark Ronson Uptown Funk", "Taylor Swift Shake It Off", "Katy Perry Roar", "Black Eyed Peas I Gotta Feeling", "Dua Lipa Levitating", "Bruno Mars 24K Magic", "The Weeknd Blinding Lights", "Harry Styles Watermelon Sugar", "BTS Dynamite", "Coldplay Viva La Vida", "Outkast Hey Ya", "Beyonce Crazy In Love"],
        "neutral": ["The Neighbourhood Sweater Weather", "Arctic Monkeys Do I Wanna Know", "Tame Impala The Less I Know The Better", "Coldplay Yellow", "The Weeknd Save Your Tears", "Glass Animals Heat Waves", "Harry Styles As It Was", "Billie Eilish Bad Guy", "Lorde Royals", "Twenty One Pilots Stressed Out", "Vance Joy Riptide", "Hozier Take Me To Church", "George Ezra Budapest"],
        "energetic": ["Imagine Dragons Believer", "Eminem Lose Yourself", "Survivor Eye of the Tiger", "Queen We Will Rock You", "Bon Jovi It's My Life", "Linkin Park Numb", "Nirvana Smells Like Teen Spirit", "AC/DC Highway to Hell", "Kendrick Lamar Humble", "Drake God's Plan", "Travis Scott Sicko Mode", "Metallica Enter Sandman", "Guns N' Roses Sweet Child O' Mine"],
        "sad": ["Adele Someone Like You", "Lana Del Rey Summertime Sadness", "Billie Eilish Lovely", "Tom Odell Another Love", "Coldplay Fix You", "Sam Smith Stay With Me", "Lewis Capaldi Someone You Loved", "John Legend All of Me", "Hozier Take Me To Church", "Evanescence My Immortal", "Olivia Rodrigo Drivers License", "Bruno Mars When I Was Your Man", "James Arthur Say You Won't Let Go", "Ed Sheeran Perfect"]
    }
};

const oracleKeywords = ["Fate", "Destiny", "Time", "Sign", "Miracle", "Answer", "Future", "Dream", "Chance", "Karma", "Lucky", "Hope", "Believe", "Change", "Wait", "Go", "Stop", "Yes", "No"];
const oracleMessages = ["Cevap bu şarkının sözlerinde gizli... 📜", "Evren sana bu ritimle bir işaret gönderiyor. 🌌", "Bunu dinle ve kalbini takip et. ❤️", "Şu an ihtiyacın olan enerji tam olarak bu. ⚡", "Bu şarkı sana birini hatırlatacak... 💭", "Kararsız kalma, şarkının adı sana yolu gösterecek. 🛣️", "Yarın senin için şanslı bir gün olabilir, bu senin marşın! 🍀"];
const vibeQuotes = ["Bu şarkı tam eski sevgiliyi stalklamalık... 🕵️‍♂️", "Sesini biraz daha aç, komşular da dinlesin. 🔊", "Şu an hayatın bir film şeridi gibi geçiyor mu? 🎬", "Bu ritim kalp atışlarınla senkronize. ❤️", "Modun düştüyse bu seni yukarı çekecek. 🚀", "Sadece gözlerini kapat ve hisset. 😌", "Bu parça +10 karizma ekliyor. 😎", "Gece uzun, liste sağlam. 🔥"];

let currentMoodContext = ""; 
let nopeCounter = 0; 
let selectedLanguage = 'en'; 
let currentPlaylist = [];
let cardStack = document.getElementById('cardStack');
let topCard = null; 
let currentAudio = null; 
let historyStack = []; 

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let isMuted = false;

const sfx = {
    click: () => {
        if (isMuted) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
    },
    like: () => {
        if (isMuted) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
    },
    nope: () => {
        if (isMuted) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(50, audioCtx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
    },
    success: () => {
        if (isMuted) return;
        [440, 554, 659].forEach((freq, i) => {
            setTimeout(() => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'triangle';
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start();
                osc.stop(audioCtx.currentTime + 0.3);
            }, i * 100);
        });
    }
};

function toggleMute() {
    isMuted = !isMuted;
    const btn = document.querySelector('.mute-btn i');
    if (isMuted) {
        btn.classList.remove('fa-volume-up');
        btn.classList.add('fa-volume-mute');
        showNotification("🔇 Sesler Kapalı");
    } else {
        btn.classList.remove('fa-volume-mute');
        btn.classList.add('fa-volume-up');
        sfx.success();
        showNotification("🔊 Sesler Açık");
    }
}

const stepLanguage = document.getElementById('step-language');
const stepLocation = document.getElementById('step-location');
const stepMood = document.getElementById('step-mood');
const stepResult = document.getElementById('step-result');
const cityInput = document.getElementById('cityInput');
const getWeatherBtn = document.getElementById('getWeatherBtn');
const geoBtn = document.getElementById('geoBtn');

if(getWeatherBtn) {
    getWeatherBtn.addEventListener('click', () => {
        if(!cityInput.value) { alert("Lütfen bir şehir girin! 🌍"); return; }
        mockWeatherProcess();
    });
}

if(geoBtn) {
    geoBtn.addEventListener('click', () => {
        geoBtn.innerText = "Konum alınıyor...";
        setTimeout(() => mockWeatherProcess(), 1000);
    });
}

document.querySelectorAll('.mood-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const mood = this.getAttribute('data-mood');
        startTinderFlow(mood);
    });
});

async function fetchTrackData(query) {
    try {
        const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=1`);
        const data = await response.json();
        if (data.resultCount > 0) {
            const track = data.results[0];
            const highResImage = track.artworkUrl100.replace('100x100', '600x600');
            const spotifySearchLink = `https://open.spotify.com/search/${encodeURIComponent(track.artistName + " " + track.trackName)}`;
            return {
                title: track.trackName,
                artist: track.artistName,
                img: highResImage,
                url: spotifySearchLink,
                preview: track.previewUrl
            };
        }
        return null;
    } catch (error) {
        return null;
    }
}

function selectLanguage(lang) {
    selectedLanguage = lang;
    stepLanguage.classList.add('hidden');
    stepLanguage.classList.remove('active');
    setTimeout(() => {
        stepLocation.classList.remove('hidden');
        stepLocation.classList.add('active');
    }, 100);
}

function goBack(targetStepId) {
    const activeStep = document.querySelector('.card.active');
    if(activeStep) {
        activeStep.classList.remove('active');
        activeStep.classList.add('hidden');
    }
    const targetStep = document.getElementById(targetStepId);
    setTimeout(() => {
        targetStep.classList.remove('hidden');
        targetStep.classList.add('active');
    }, 100);
}

function mockWeatherProcess() {
    stepLocation.classList.add('hidden');
    stepLocation.classList.remove('active');
    const weathers = ['Güneşli ☀️', 'Yağmurlu 🌧️', 'Bulutlu ☁️', 'Karlı ❄️'];
    const wText = weathers[Math.floor(Math.random()*weathers.length)];
    document.getElementById('weatherText').innerText = wText;
    stepMood.classList.remove('hidden');
    setTimeout(() => stepMood.classList.add('active'), 100);
}

async function startTinderFlow(mood) {
    currentMoodContext = mood;
    cardStack.innerHTML = "<h3 style='color:black; font-weight:900; text-align:center; margin-top:100px;'>Şarkılar Hazırlanıyor... 🎧</h3>";
    stepMood.classList.add('hidden');
    stepMood.classList.remove('active');
    stepResult.classList.remove('hidden');
    let queryList = [];
    if (selectedLanguage === 'mix') {
        const trList = searchQueries['tr'][mood] || searchQueries['tr']['happy'];
        const enList = searchQueries['en'][mood] || searchQueries['en']['happy'];
        queryList = [...trList, ...enList];
    } else {
        queryList = searchQueries[selectedLanguage][mood] || searchQueries[selectedLanguage]['happy'];
    }
    queryList.sort(() => Math.random() - 0.5);
    const promises = queryList.map(query => fetchTrackData(query));
    const results = await Promise.all(promises);
    currentPlaylist = results.filter(item => item !== null);
    cardStack.innerHTML = ""; 
    historyStack = []; 
    if (currentPlaylist.length === 0) {
        cardStack.innerHTML = "<h3>Şarkı bulunamadı :(</h3>";
        return;
    }
    currentPlaylist.forEach(song => createCard(song));
    initSwipeLogic();
}

function toggleAudio(btn, audioId) {
    if(event) event.stopPropagation(); 
    const audio = document.getElementById(`audio-${audioId}`);
    const icon = btn.querySelector('i');
    if (!audio) return;
    if (audio.paused) {
        if(currentAudio && currentAudio !== audio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
            document.querySelectorAll('.play-overlay i').forEach(i => {
                i.classList.remove('fa-pause');
                i.classList.add('fa-play');
            });
            document.querySelectorAll('.playing-vinyl').forEach(el => {
                el.classList.remove('playing-vinyl');
                el.classList.add('paused-vinyl');
            });
        }
        audio.play();
        updatePet('playing');
        currentAudio = audio;
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
        const card = btn.closest('.tinder-card');
        if(card) {
            card.classList.add('playing-vinyl');
            card.classList.remove('paused-vinyl');
        }
    } else {
        audio.pause();
        updatePet('paused');
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
        const card = btn.closest('.tinder-card');
        if(card) {
            card.classList.remove('playing-vinyl');
            card.classList.add('paused-vinyl');
        }
    }
    audio.onended = () => {
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
        const card = btn.closest('.tinder-card');
        if(card) {
            card.classList.remove('playing-vinyl');
            card.classList.add('paused-vinyl');
        }
    };
}

function changeSpeed(btn, audioId) {
    if(event) event.stopPropagation(); 
    const audio = document.getElementById(`audio-${audioId}`);
    const label = btn.querySelector('.speed-label');
    if(!audio) return;
    let currentRate = audio.playbackRate;
    if (currentRate === 1) {
        audio.playbackRate = 1.25;
        if(label) label.innerText = "🐇 1.25x";
        btn.style.backgroundColor = "#ffeaa7";
        btn.style.color = "black";
    } else if (currentRate === 1.25) {
        audio.playbackRate = 0.85;
        if(label) label.innerText = "🐢 0.85x";
        btn.style.backgroundColor = "#74b9ff";
    } else {
        audio.playbackRate = 1.0;
        if(label) label.innerText = "1x";
        btn.style.backgroundColor = ""; 
        btn.style.color = "white";
    }
}

function initSwipeLogic() {
    const cards = document.querySelectorAll('.tinder-card');
    if (cards.length === 0) {
        cardStack.innerHTML = `<div style='text-align:center; margin-top:50px;'><h3 style="color:black;">Liste Bitti! 🎵</h3><br><button class='primary-btn' onclick='resetApp()'>Başa Dön</button></div>`;
        return;
    }
    topCard = cards[cards.length - 1]; 
    let isDragging = false;
    let startX = 0;
    let currentX = 0;
    const startDrag = (e) => {
        if(e.target.closest('.play-overlay') || e.target.closest('.speed-control')) return;
        isDragging = true;
        startX = getClientX(e);
        topCard.style.transition = 'none';
    };
    const moveDrag = (e) => {
        if (!isDragging) return;
        currentX = getClientX(e);
        let diff = currentX - startX;
        topCard.style.transform = `translateX(${diff}px) rotate(${diff * 0.1}deg)`;
        const likeBadge = topCard.querySelector('.badge-like');
        const nopeBadge = topCard.querySelector('.badge-nope');
        if (diff > 0) {
            likeBadge.style.opacity = diff / 100;
            nopeBadge.style.opacity = 0;
        } else {
            nopeBadge.style.opacity = Math.abs(diff) / 100;
            likeBadge.style.opacity = 0;
        }
    };
    const endDrag = () => {
        if (!isDragging) return;
        isDragging = false;
        let diff = currentX - startX;
        const threshold = 100;
        if (diff > threshold) { swipeRight(); } 
        else if (diff < -threshold) { swipeLeft(); } 
        else {
            topCard.classList.add('reset');
            topCard.style.transform = '';
            topCard.querySelector('.badge-like').style.opacity = 0;
            topCard.querySelector('.badge-nope').style.opacity = 0;
            setTimeout(() => topCard.classList.remove('reset'), 300);
        }
    };
    topCard.addEventListener('mousedown', startDrag);
    topCard.addEventListener('touchstart', startDrag);
    document.addEventListener('mousemove', moveDrag);
    document.addEventListener('touchmove', moveDrag);
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);
}

function getClientX(e) {
    return e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
}

function swipeRight() {
    if (!topCard) return;
    if (isBlindMode && !topCard.classList.contains('revealed')) {
        topCard.classList.add('revealed');
        const likeBadge = topCard.querySelector('.badge-like');
        likeBadge.style.opacity = 1;
        setTimeout(() => { finishSwipeRight(); }, 1200);
    } else {
        finishSwipeRight();
    }
}

function finishSwipeRight() {
    updatePet('liked');
    nopeCounter = 0; 
    if(currentAudio) { currentAudio.pause(); currentAudio = null; }
    sfx.like();
    topCard.classList.add('go-right');
    const url = topCard.dataset.url;
    const img = topCard.querySelector('img').src;
    const title = topCard.querySelector('h3').innerText;
    const artist = topCard.querySelector('p').innerText;
    saveToLikes({ title, artist, img, url, mood: currentMoodContext || 'neutral' });
    updateCombo('increase');
    showNotification("Listeye Eklendi 💚");
    checkBadges();
    setTimeout(() => { topCard.remove(); initSwipeLogic(); }, 300);
}

function swipeLeft() {
    updatePet('noped');
    updateCombo('reset');
    if (!topCard) return;
    nopeCounter++;
    sfx.nope();
    if(nopeCounter === 5) {
        showNotification("🤨 Çok seçicisin! Ama buna bayılacaksın...");
        const secretSong = { title: "Gizli Hazine 💎", artist: "Evrenin Mesajı", img: "https://media1.giphy.com/media/Ju7l5y9osyymQ/200.gif", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", preview: "" };
        setTimeout(() => { createCard(secretSong); initSwipeLogic(); nopeCounter = 0; }, 400);
    }
    if(currentAudio) { currentAudio.pause(); currentAudio = null; }
    const songData = { title: topCard.querySelector('h3').innerText, artist: topCard.querySelector('p').innerText, img: topCard.querySelector('img').src, url: topCard.dataset.url, preview: topCard.querySelector('audio') ? topCard.querySelector('audio').getAttribute('src') : null };
    historyStack.push(songData);
    topCard.classList.add('go-left');
    setTimeout(() => { topCard.remove(); initSwipeLogic(); }, 300);
}

function undo() {
    if (historyStack.length === 0) { alert("Geri alınacak şarkı yok!"); return; }
    document.body.classList.add('rewinding');
    const overlay = document.createElement('div');
    overlay.className = 'vhs-rewind';
    document.body.appendChild(overlay);
    if(typeof sfx !== 'undefined') sfx.click();
    setTimeout(() => {
        document.body.classList.remove('rewinding');
        overlay.remove();
        const songToRestore = historyStack.pop();
        createCard(songToRestore);
        initSwipeLogic();
    }, 600);
}

function manualSwipe(dir) {
    if(dir === 'left') swipeLeft();
    if(dir === 'right') swipeRight();
}

function resetApp() { window.location.reload(); }

function togglePlaylist() {
    const modal = document.getElementById('playlistModal');
    modal.classList.toggle('hidden');
    renderLikes(); 
}

function saveToLikes(song) {
    let likes = JSON.parse(localStorage.getItem('vibeLikes')) || [];
    const exists = likes.some(item => item.title === song.title);
    if(!exists) {
        likes.push(song);
        localStorage.setItem('vibeLikes', JSON.stringify(likes));
    }
}

function renderLikes() {
    const listEl = document.getElementById('likedList');
    const likes = JSON.parse(localStorage.getItem('vibeLikes')) || [];
    if(likes.length === 0) {
        listEl.innerHTML = "<div style='border:3px solid #000; padding:20px; text-align:center; font-weight:bold; background:#fff;'>Henüz analiz yapılacak kadar veri yok. 🤷‍♂️</div>";
        return;
    }
    const counts = { happy: 0, sad: 0, energetic: 0, neutral: 0 };
    likes.forEach(song => {
        if(song.mood && counts[song.mood] !== undefined) counts[song.mood]++;
        else counts['neutral']++;
    });
    let dominantMood = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    let vibeTitle = "", vibeDesc = "", bgColor = "";
    switch(dominantMood) {
        case 'happy': vibeTitle = "NEŞE MAKİNESİ ☀️"; vibeDesc = "Seninle takılan yaşlanmaz!"; bgColor = "#ffeaa7"; break;
        case 'sad': vibeTitle = "MELANKOLİK ŞAİR 🥀"; vibeDesc = "Yağmurlu havalar senden sorulur."; bgColor = "#74b9ff"; break;
        case 'energetic': vibeTitle = "KAOS & ENERJİ ⚡"; vibeDesc = "Hayatın 1.5x hızında akıyor."; bgColor = "#ff7675"; break;
        default: vibeTitle = "COOL & DENGELİ 🧊"; vibeDesc = "Akışına bırakanlardansın."; bgColor = "#a29bfe"; break;
    }
    listEl.innerHTML = "";
    const analysisCard = document.createElement('div');
    analysisCard.className = 'analysis-card';
    analysisCard.style.backgroundColor = bgColor;
    analysisCard.innerHTML = `<span class="analysis-badge">VIBE RAPORU</span><h2 class="analysis-title">${vibeTitle}</h2><p class="analysis-desc">${vibeDesc}</p><div class="analysis-stat">📊 BASKIN MOD: %${Math.round((counts[dominantMood] / likes.length) * 100)} ${dominantMood.toUpperCase()}</div>`;
    listEl.appendChild(analysisCard);
    likes.forEach(song => {
        const item = document.createElement('div');
        item.classList.add('liked-item');
        item.innerHTML = `<img src="${song.img}" alt="cover"><div class="liked-info"><h4>${song.title}</h4><p>${song.artist}</p></div><a href="${song.url}" target="_blank" class="play-link"><i class="fas fa-external-link-alt"></i></a>`;
        listEl.appendChild(item);
    });
}

function exportList() {
    const likes = JSON.parse(localStorage.getItem('vibeLikes')) || [];
    if (likes.length === 0) { alert("Liste boş! 😅"); return; }
    let textToCopy = "🎵 Weaviop Listem:\n\n"; 
    likes.forEach((s, i) => { textToCopy += `${i+1}. ${s.title} - ${s.artist}\n`; });
    textToCopy += `\n(Toplam ${likes.length} şarkı)\n Weaviop ile oluşturuldu! 🎶\nhttps://egeozalan.com/weaviop`;
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textToCopy).then(() => showNotification("✅ Panoya Kopyalandı!"));
    } else {
        fallbackCopyTextToClipboard(textToCopy);
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed"; textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus(); textArea.select();
    try { document.execCommand('copy'); showNotification("✅ Panoya Kopyalandı!"); } catch (err) { alert("Kopyalama başarısız."); }
    document.body.removeChild(textArea);
}

function clearLikes() { localStorage.removeItem('vibeLikes'); renderLikes(); }

function showNotification(msg) {
    const notif = document.getElementById('notification');
    notif.innerText = msg;
    notif.classList.add('show');
    setTimeout(() => { notif.classList.remove('show'); }, 2000); 
}

function checkBadges() {
    const likes = JSON.parse(localStorage.getItem('vibeLikes')) || [];
    const count = likes.length;
    let earnedBadges = JSON.parse(localStorage.getItem('earnedBadges')) || [];
    let badgeTitle = "", badgeIcon = "", badgeId = "";
    if (count === 5) { badgeId = "b5"; badgeTitle = "Müzik Kulağı"; badgeIcon = "👂"; }
    else if (count === 10) { badgeId = "b10"; badgeTitle = "DJ Adayı"; badgeIcon = "🎧"; }
    else if (count === 20) { badgeId = "b20"; badgeTitle = "Ritim Ustası"; badgeIcon = "🥁"; }
    else if (count === 50) { badgeId = "b50"; badgeTitle = "Müzik Gurusu"; badgeIcon = "🌟"; }
    if (badgeId !== "" && !earnedBadges.includes(badgeId)) {
        showBadgeModal(badgeTitle, badgeIcon);
        earnedBadges.push(badgeId);
        localStorage.setItem('earnedBadges', JSON.stringify(earnedBadges));
    }
}

function showBadgeModal(title, icon) {
    const modal = document.getElementById('badgeModal');
    document.getElementById('badgeTitleName').innerText = title;
    document.querySelector('.badge-icon').innerText = icon;
    modal.classList.remove('hidden');
    if(navigator.vibrate) navigator.vibrate([100, 50, 100]);
}

function closeBadge() { document.getElementById('badgeModal').classList.add('hidden'); }

function shareAsStory() {
    if (typeof html2canvas === 'undefined') { alert("Görüntü oluşturucu yüklenemedi. İnternetini kontrol et."); return; }
    const modalContent = document.querySelector('.modal-content');
    const titleEl = document.querySelector('.modal-header h3');
    const closeBtn = document.querySelector('.close-btn');
    const elementsToHide = document.querySelectorAll('.export-btn, .clear-btn, .play-link');
    const originalTitle = titleEl.innerText;
    const originalBg = modalContent.style.background;
    const originalPadding = modalContent.style.padding;
    titleEl.innerText = "🔥 Weaviop Listem";
    titleEl.style.fontSize = "1.8rem"; titleEl.style.textAlign = "center"; titleEl.style.width = "100%";
    closeBtn.classList.add('hide-for-story');
    elementsToHide.forEach(el => el.classList.add('hide-for-story'));
    modalContent.classList.add('story-layout-fix');
    modalContent.style.background = "linear-gradient(to bottom, #1e1e1e, #000000)";
    modalContent.style.padding = "40px 30px";
    document.getElementById('likedList').scrollTop = 0;
    const loadingNotify = document.getElementById('notification');
    loadingNotify.innerText = "📸 Hazırlanıyor...";
    loadingNotify.classList.add('show');
    setTimeout(() => {
        html2canvas(modalContent, { backgroundColor: null, scale: 3, useCORS: true, allowTaint: true, logging: false, scrollY: -window.scrollY }).then(canvas => {
            titleEl.innerText = originalTitle; titleEl.style.fontSize = ""; titleEl.style.textAlign = ""; titleEl.style.width = "";
            closeBtn.classList.remove('hide-for-story');
            elementsToHide.forEach(el => el.classList.remove('hide-for-story'));
            modalContent.classList.remove('story-layout-fix');
            modalContent.style.background = originalBg;
            modalContent.style.padding = originalPadding;
            loadingNotify.classList.remove('show');
            try {
                const link = document.createElement('a');
                link.download = 'weaviopstory.png';
                link.href = canvas.toDataURL('image/png', 1.0);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                showNotification("✅ Story İndirildi!");
            } catch (err) {
                const win = window.open();
                win.document.write('<img src="' + canvas.toDataURL() + '" style="width:100%;"/>');
            }
        }).catch(err => { loadingNotify.classList.remove('show'); alert("Resim oluşturulamadı."); });
    }, 300);
}

async function openOracle() {
    const modal = document.getElementById('oracleModal');
    const loading = document.getElementById('oracleLoading');
    const result = document.getElementById('oracleResult');
    modal.classList.remove('hidden');
    loading.classList.remove('hidden');
    result.classList.add('hidden');
    const randomKeyword = oracleKeywords[Math.floor(Math.random() * oracleKeywords.length)];
    try {
        const response = await fetch(`https://itunes.apple.com/search?term=${randomKeyword}&media=music&limit=20`);
        const data = await response.json();
        if (data.resultCount > 0) {
            const randomSong = data.results[Math.floor(Math.random() * data.results.length)];
            const randomMsg = oracleMessages[Math.floor(Math.random() * oracleMessages.length)];
            document.getElementById('oracleImg').src = randomSong.artworkUrl100.replace('100x100', '400x400');
            document.getElementById('oracleTitle').innerText = randomSong.trackName;
            document.getElementById('oracleArtist').innerText = randomSong.artistName;
            document.querySelector('.fortune-text').innerText = `"${randomMsg}"`;
            const spotifyQuery = encodeURIComponent(randomSong.artistName + " " + randomSong.trackName);
            const linkBtn = document.getElementById('oracleLink');
            linkBtn.href = `https://open.spotify.com/search/${spotifyQuery}`;
            linkBtn.innerHTML = '<i class="fab fa-spotify"></i> Spotify\'da Gör';
            linkBtn.style.backgroundColor = '#1DB954';
            linkBtn.style.color = 'white';
            setTimeout(() => {
                loading.classList.add('hidden');
                result.classList.remove('hidden');
                if(sfx && typeof sfx.success === 'function') { sfx.success(); }
            }, 1500);
        } else { alert("Evren şu an meşgul... Tekrar dene."); closeOracle(); }
    } catch (error) { alert("Bağlantı hatası! Fal bakılamadı."); closeOracle(); }
}

function closeOracle() { document.getElementById('oracleModal').classList.add('hidden'); }

let isBlindMode = false;
function toggleBlindMode() {
    isBlindMode = !isBlindMode;
    const btn = document.querySelector('.blind-mode-btn');
    if (isBlindMode) {
        document.body.classList.add('blind-active');
        btn.classList.add('active');
        showNotification("🕵️ Gizemli Mod: AÇIK");
    } else {
        document.body.classList.remove('blind-active');
        btn.classList.remove('active');
        showNotification("👀 Gizemli Mod: KAPALI");
    }
}

function createCard(song) {
    const el = document.createElement('div');
    el.classList.add('tinder-card');
    el.dataset.url = song.url; 
    let audioHtml = "";
    let playBtnHtml = "";
    const visualizerHtml = `<div class="visualizer-container" id="vis-${song.preview ? 'enabled' : 'disabled'}"><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div></div>`;
    if(song.preview) {
        const uniqueId = Math.random().toString(36).substr(2, 9);
        audioHtml = `<audio src="${song.preview}" id="audio-${uniqueId}"></audio>`;
        playBtnHtml = `<div class="play-overlay" onclick="toggleAudio(this, '${uniqueId}')"><i class="fas fa-play"></i></div>`;
    }
    el.innerHTML = `<div class="status-badge badge-like">LIKE</div><div class="status-badge badge-nope">NOPE</div><div style="position:relative; width:100%;"><img src="${song.img}" draggable="false" alt="${song.title}"><div class="blind-overlay">?</div>${playBtnHtml}</div>${audioHtml}<div class="song-info">${visualizerHtml}<h3>${song.title}</h3><p>${song.artist}</p><p class="vibe-quote">"${vibeQuotes[Math.floor(Math.random() * vibeQuotes.length)]}"</p></div>`;
    cardStack.appendChild(el);
}

document.addEventListener('click', (e) => {
    if (e.target.closest('button') || e.target.closest('.tinder-card') || e.target.closest('a')) {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        if(!e.target.closest('.play-overlay')) { sfx.click(); }
    }
});

let likeCombo = 0; 
function updateCombo(action) {
    const comboEl = document.getElementById('combo-counter');
    const comboNum = document.getElementById('combo-num');
    if (action === 'increase') {
        likeCombo++;
        if (likeCombo > 1) {
            comboEl.classList.remove('hidden');
            comboNum.innerText = likeCombo;
            comboEl.classList.remove('combo-shake');
            void comboEl.offsetWidth;
            comboEl.classList.add('combo-shake');
            if(likeCombo % 5 === 0 && typeof sfx !== 'undefined') { sfx.success(); }
        }
    } else {
        likeCombo = 0;
        comboEl.classList.add('hidden');
    }
}

function updatePet(state) {
    const face = document.querySelector('.pet-face');
    const container = document.getElementById('vibe-pet');
    const bubble = document.querySelector('.pet-bubble');
    if(!face || !container) return;
    container.classList.remove('pet-dance', 'pet-sad', 'pet-crazy', 'pet-sleep');
    let mood = currentMoodContext || 'neutral';
    let msg = "";
    if (state === 'playing') {
        if (mood === 'happy') { face.innerText = "😸"; container.classList.add('pet-dance'); msg = "Koptu geliyooor!"; }
        else if (mood === 'sad') { face.innerText = "😿"; container.classList.add('pet-sad'); msg = "Ağlamak yok..."; }
        else if (mood === 'energetic') { face.innerText = "😼"; container.classList.add('pet-crazy'); msg = "Enerji tavan! ⚡"; }
        else { face.innerText = "😺"; container.classList.add('pet-dance'); msg = "Ritim güzel."; }
    } else if (state === 'paused') { face.innerText = "💤"; container.classList.add('pet-sleep'); msg = "Zzz..."; }
    else if (state === 'liked') { face.innerText = "😻"; container.classList.add('pet-dance'); msg = "Buna bayıldım! 💚"; }
    else if (state === 'noped') { face.innerText = "😾"; msg = "Sıradaki gelsin!"; }
    if (bubble && msg !== "") {
        bubble.innerText = msg;
        bubble.classList.add('show');
        if (window.petTimeout) clearTimeout(window.petTimeout);
        window.petTimeout = setTimeout(() => { bubble.classList.remove('show'); }, 3000);
    }
}

function petInteraction() {
    const face = document.querySelector('.pet-face');
    const bubble = document.querySelector('.pet-bubble');
    face.innerText = "💖";
    bubble.innerText = "Beni sevdin!";
    bubble.classList.add('show');
    if(typeof sfx !== 'undefined') sfx.click();
    setTimeout(() => {
        bubble.classList.remove('show');
        if(currentAudio && !currentAudio.paused) { updatePet('playing'); } else { face.innerText = "💤"; }
    }, 1500);
}

const bgStickers = ["🔥", "💀", "💿", "👽", "🤘", "💊", "💣", "💎", "🛹", "🍕", "👁️", "⚡", "👾", "🎸", "🎵", "📀"];
function initGraffitiBackground() {
    const layer = document.getElementById('graffiti-layer');
    if (!layer) return;
    layer.innerHTML = ''; 
    for (let i = 0; i < 40; i++) {
        const el = document.createElement('div');
        const randomIcon = bgStickers[Math.floor(Math.random() * bgStickers.length)];
        const randomX = Math.random() * 90 + 5; 
        const randomY = Math.random() * 90 + 5;
        const randomRot = Math.floor(Math.random() * 90 - 45) + 'deg';
        const randomScale = (Math.random() * 0.6 + 0.6).toFixed(2);
        el.className = 'sticker';
        el.innerText = randomIcon;
        el.style.left = randomX + 'vw';
        el.style.top = randomY + 'vh';
        el.style.fontSize = `${3 * randomScale}rem`;
        el.style.transform = `rotate(${randomRot})`;
        el.style.opacity = "9"; 
        layer.appendChild(el);
    }
}

window.addEventListener('DOMContentLoaded', initGraffitiBackground);

function openReceiptModal() {
    const modal = document.getElementById('receiptModal');
    const listEl = document.getElementById('receipt-list');
    const likes = JSON.parse(localStorage.getItem('vibeLikes')) || [];
    if(likes.length === 0) { alert("Önce birkaç şarkı beğenmelisin!"); return; }
    modal.classList.remove('hidden');
    const now = new Date();
    document.getElementById('receipt-date').innerText = `DATE: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
    listEl.innerHTML = '';
    likes.forEach(song => {
        const min = Math.floor(Math.random() * 4) + 2;
        const sec = Math.floor(Math.random() * 59).toString().padStart(2, '0');
        const item = document.createElement('div');
        item.className = 'receipt-row';
        let cleanTitle = song.title.toUpperCase();
        if(cleanTitle.length > 25) cleanTitle = cleanTitle.substring(0, 25) + "...";
        item.innerHTML = `<span>${cleanTitle}</span><span>${min}:${sec}</span>`;
        listEl.appendChild(item);
    });
    document.getElementById('receipt-count').innerText = likes.length;
}

function downloadReceipt() {
    if (typeof html2canvas === 'undefined') { alert("Görüntüleyici yüklenemedi."); return; }
    const receipt = document.getElementById('receipt-print-area');
    const btn = document.querySelector('.save-receipt-btn');
    btn.innerText = "Yazdırılıyor... 🖨️";
    html2canvas(receipt, { scale: 2, backgroundColor: null }).then(canvas => {
        const link = document.createElement('a');
        link.download = `VibeReceipt_${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        btn.innerText = "🖨️ Fişi Yazdır (PNG)";
        showNotification("✅ Fiş Kesildi!");
        if(typeof sfx !== 'undefined') sfx.success();
    });
}
