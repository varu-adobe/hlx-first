export default function decorate(block) {
    /* change to ul, li */
    const div = document.createElement('div');
    div.className = 'loop';
    div.id="ad-container";
    block.textContent = '';
    console.log(div);
    block.append(div);
    fetch('https://main--hlx-first--varu-adobe.hlx.live/inside-adobe-schedule.json', {
        method: 'GET'
        })
        .then((response) => {
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            console.log("sheet response", data);
            var ads = data.data;
            let currentAdIndex = 0;

        function playAds() {
            const adContainer = document.getElementById('ad-container');
            const now = Date.now() / 1000;

            while (currentAdIndex < ads.length) {
                const ad = ads[currentAdIndex];
                if (now >= ad.startSchedule && now <= ad.endSchedule) {
                    if (ad.type === 'image') {
                        const img = new Image();
                        img.src = ad.src;
                        img.onerror = function() {
                            incrementAdIndex();
                            playAds();
                        };
                        img.onload = function() {
                            adContainer.innerHTML = '';
                            adContainer.appendChild(img);
                            setTimeout(() => {
                                img.classList.add('visible');
                                setTimeout(() => {
                                    img.classList.remove('visible');
                                    setTimeout(() => {
                                        adContainer.removeChild(img);
                                        incrementAdIndex();
                                        playAds();
                                    }, 1000);
                                }, ad.duration);
                            }, 100);
                        };
                        break;
                    } else if (ad.type === 'video') {
                        const video = document.createElement('video');
                        video.src = ad.src;
                        video.onerror = function() {
                            incrementAdIndex();
                            playAds();
                        };
                        video.onended = function() {
                            video.classList.remove('visible');
                            setTimeout(() => {
                                adContainer.removeChild(video);
                                incrementAdIndex();
                                playAds();
                            }, 1000);
                        };
                        video.oncanplay = function() {
                            adContainer.innerHTML = '';
                            adContainer.appendChild(video);
                            video.play();
                            setTimeout(() => {
                                video.classList.add('visible');
                            }, 100);
                        };
                        video.muted = true;
                        video.playsInline = true;
                        break;
                    }
                } else {
                    incrementAdIndex();
                }
            }
        }

        function incrementAdIndex() {
            currentAdIndex = (currentAdIndex + 1) % ads.length;
        }

        playAds();

        })
        .catch((error) => {
            console.error('There was a problem with the fetch operation:', error);
        });
  }