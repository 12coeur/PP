document.addEventListener("DOMContentLoaded", () => {
    // Fonction de conversion vh
    function vh(percent) {
        return window.innerHeight * (percent / 100);
    }

    // Style de base
    const baseFontSize = vh(2);
    document.documentElement.style.setProperty('--base-font-size', `${baseFontSize}px`);
    
    const dynamicStyles = `
        /* Votre CSS dynamique ici */
    `;
    document.head.insertAdjacentHTML('beforeend', `<style>${dynamicStyles}</style>`);

    // ajout de ce addEvant pour calibrer les hauteurs textes.
});
document.addEventListener("DOMContentLoaded", () => {
    const PP = document.getElementById("PP");
    const ParaContainer = document.getElementById("PP-container");
    const plateau = document.getElementById("plateau");
    const obstacle = document.getElementById("obstacle-container");

    if (!PP || !ParaContainer || !plateau || !obstacle) {
        console.error("❌ Éléments manquants !");
        return;
    }

    // Ajouter un second et un troisième obstacle dynamiquement
    const secondObstacle = document.createElement("div");
    secondObstacle.id = "obstacle-container-2";
    secondObstacle.className = "obstacle-container";

    const secondObstacleImg = document.createElement("img");
    secondObstacleImg.id = "obstacle-2";
    secondObstacleImg.src = "Images/obstacle2.gif";
    secondObstacleImg.alt = "Obstacle 2";
    secondObstacleImg.style.width = "100%";
    secondObstacleImg.style.height = "100%";
    secondObstacleImg.style.objectFit = "contain";
    secondObstacleImg.style.display = "block";
    secondObstacleImg.onload = () => console.log("Image obstacle2.gif chargée avec succès");
    secondObstacleImg.onerror = () => console.error("Erreur de chargement de obstacle2.gif");

    secondObstacle.appendChild(secondObstacleImg);
    plateau.appendChild(secondObstacle);

    const thirdObstacle = document.createElement("div");
    thirdObstacle.id = "obstacle-container-3";
    thirdObstacle.className = "obstacle-container";

    const thirdObstacleImg = document.createElement("img");
    thirdObstacleImg.id = "obstacle-3";
    thirdObstacleImg.src = "Images/obstacle3.gif";
    thirdObstacleImg.alt = "Obstacle 3";
    thirdObstacleImg.style.width = "100%";
    thirdObstacleImg.style.height = "100%";
    thirdObstacleImg.style.objectFit = "contain";
    thirdObstacleImg.style.display = "block";
    thirdObstacleImg.onload = () => console.log("Image obstacle3.gif chargée avec succès");
    thirdObstacleImg.onerror = () => console.error("Erreur de chargement de obstacle3.gif");

    thirdObstacle.appendChild(thirdObstacleImg);
    plateau.appendChild(thirdObstacle);

    obstacle.className = "obstacle-container";
    obstacle.style.display = "block";

    // Initialiser les sons pour chaque obstacle
    const sounds = {
        0: new Audio('Sons/son1.mp3'),
        1: new Audio('Sons/son2.mp3'),
        2: new Audio('Sons/son3.mp3')
    };

    // Configurer les sons pour qu'ils puissent être joués plusieurs fois
    Object.values(sounds).forEach(sound => {
        sound.preload = 'auto';
        sound.oncanplaythrough = () => console.log(`Son ${sound.src} chargé avec succès`);
        sound.onerror = () => console.error(`Erreur de chargement du son ${sound.src}`);
        sound.loop = false; // Pas de boucle, le son joue une fois par capture
    });

    loadNoSleepLibrary();

    let wakeLock = null;
    let noSleep = null;

    function loadNoSleepLibrary() {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/nosleep/0.12.0/NoSleep.min.js';
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
            console.log("NoSleep.js chargé avec succès");
            if (typeof NoSleep !== 'undefined') {
                noSleep = new NoSleep();
            }
        };

        script.onerror = () => {
            console.error("Impossible de charger NoSleep.js");
        };
    }

    async function keepScreenAwake() {
        if ('wakeLock' in navigator) {
            try {
                wakeLock = await navigator.wakeLock.request('screen');
                console.log('WakeLock activé');
                wakeLock.addEventListener('release', () => {
                    console.log('WakeLock relâché');
                });
            } catch (err) {
                console.error(`Impossible d'activer WakeLock: ${err.message}`);
            }
        }
        if (noSleep) {
            try {
                noSleep.enable();
                console.log('NoSleep activé');
            } catch (err) {
                console.error(`Impossible d'activer NoSleep: ${err.message}`);
            }
        }
    }

    function releaseScreenAwake() {
        if (wakeLock) {
            wakeLock.release()
                .then(() => console.log('WakeLock relâché'))
                .catch((err) => console.error(`Erreur lors du relâchement WakeLock: ${err.message}`));
            wakeLock = null;
        }
        if (noSleep) {
            noSleep.disable();
            console.log('NoSleep désactivé');
        }
    }

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            keepScreenAwake();
        } else {
            releaseScreenAwake();
        }
    });

    // Détection mobile
    const isMobile = /Android|iPhone|iPad|iPod|Mobile|Tablet|Touch/i.test(navigator.userAgent) || 
                     ('ontouchstart' in window || navigator.maxTouchPoints > 0);
    console.log("Détection mobile:", { isMobile, userAgent: navigator.userAgent, touchSupport: 'ontouchstart' in window, maxTouchPoints: navigator.maxTouchPoints });

    const initDelay = isMobile ? 1000 : 200;

    // Créer la page de règlement
    function showRulesPage() {
        console.log("Affichage de la page de règlement");
        // Masquer le plateau avec visibility pour préserver les dimensions
        plateau.style.visibility = 'hidden';

        const rulesPage = document.createElement('div');
        rulesPage.id = 'rules-page';
        rulesPage.style.position = 'fixed';
        rulesPage.style.top = '0';
        rulesPage.style.left = '0';
        rulesPage.style.width = '100%';
        rulesPage.style.height = '100%';
        rulesPage.style.background = 'rgba(0, 0, 0, 0.8)';
        rulesPage.style.display = 'flex';
        rulesPage.style.flexDirection = 'column';
        rulesPage.style.alignItems = 'center';
        rulesPage.style.justifyContent = 'center';
        rulesPage.style.color = 'white';
        rulesPage.style.fontFamily = 'Arial, sans-serif';
        rulesPage.style.textAlign = 'center';
        rulesPage.style.padding = '20px';
        rulesPage.style.zIndex = '1000';

        const rulesText = document.createElement('div');
        rulesText.innerHTML = `
            <h1>J’irai bouffer ta queue !</h1>
            <p>Voici la règle du jeu : ne jamais laisser partir les oiseaux sans les avoir choppé par la queue, votre score doit toujours être supérieur à celui des oiseaux qui ont réussi à sortir.</p>
            <p>Vous ne pouvez les attraper que par l'arrière.</p>
            <p>Ils n’ont pas tous la même valeur.</p>
            <p>À vous de jouer !</p>
        `;
        rulesText.style.maxWidth = '600px';
        rulesText.style.marginBottom = '20px';
        rulesPage.appendChild(rulesText);

        const playButton = document.createElement('button');
        playButton.innerText = 'Jouer';
        playButton.style.padding = '15px 30px';
        playButton.style.background = '#28a745';
        playButton.style.color = 'white';
        playButton.style.border = 'none';
        playButton.style.borderRadius = '5px';
        playButton.style.cursor = 'pointer';
        playButton.style.fontSize = '18px';
        rulesPage.appendChild(playButton);

        document.body.appendChild(rulesPage);

        // Gestion du bouton "Jouer"
        playButton.addEventListener('click', () => {
            console.log("Clic sur Jouer");
            rulesPage.remove();
            plateau.style.visibility = 'visible';
            plateau.style.display = 'block';
            requestAnimationFrame(() => {
                console.log("Lancement de initJeu avec délai:", initDelay);
                setTimeout(initJeu, initDelay);
            });
        });
    }

    // Afficher la page de règlement au chargement
    showRulesPage();

    function initJeu() {
        console.log("Initialisation du jeu...");
        console.log("Taille du plateau:", plateau.clientWidth, plateau.clientHeight);

        const hasDeviceMotion = 'DeviceMotionEvent' in window &&
            ('ontouchstart' in window || navigator.maxTouchPoints > 0);

        console.log("Détection: ", { isMobile, hasDeviceMotion });
        const useMobileControls = isMobile && hasDeviceMotion;

        const billeSize = isMobile ? 0.15 : 0.1;

        const billeRadius = ParaContainer.offsetWidth / 2;
        console.log("Taille de la bille:", billeRadius * 2, "pixels");

        let posX = plateau.clientWidth / 2;
        let posY = plateau.clientHeight * 0.9;
        let speedX = 0;
        let speedY = 0;
        let accelX = 0;
        let accelY = 0;
        let lastInteractionTime = Date.now();
        let screenLockActive = false;
        let score = 0;
        let score2 = 0;
        let attachedObstacle = null;
        let motionDetected = false;
        let permissionRequested = false;
        let permButton = null;

        const scoreDisplay = document.createElement('div');
        scoreDisplay.id = 'score-display';
        scoreDisplay.style.position = 'absolute';
        scoreDisplay.style.bottom = '10px';
        scoreDisplay.style.left = '10px';
        scoreDisplay.style.padding = '10px 15px';
        scoreDisplay.style.background = 'rgba(0, 0, 0, 0.7)';
        scoreDisplay.style.color = 'white';
        scoreDisplay.style.borderRadius = '10px';
        scoreDisplay.style.fontFamily = 'Arial, sans-serif';
        scoreDisplay.style.fontSize = '16px';
        scoreDisplay.textContent = `Attrapés: ${score}`;
        plateau.appendChild(scoreDisplay);

        const score2Display = document.createElement('div');
        score2Display.id = 'score2-display';
        score2Display.style.position = 'absolute';
        score2Display.style.bottom = '50px';
        score2Display.style.left = '10px';
        score2Display.style.padding = '10px 15px';
        score2Display.style.background = 'rgba(0, 0, 0, 0.7)';
        score2Display.style.color = 'white';
        score2Display.style.borderRadius = '10px';
        score2Display.style.fontFamily = 'Arial, sans-serif';
        score2Display.style.fontSize = '16px';
        score2Display.textContent = `Oiseaux partis: ${score2}`;
        plateau.appendChild(score2Display);

        function detectNavigateur() {
            const ua = navigator.userAgent;
            if (/Chrome/i.test(ua) && !/OPR|MiuiBrowser/i.test(ua)) {
                return 0.15;
            } else if (/Firefox/i.test(ua)) {
                return 0.075;
            } else if (/MiuiBrowser/i.test(ua)) {
                return 0.06;
            } else if (/OPR/i.test(ua)) {
                return 0.065;
            } else {
                return 0.1;
            }
        }

        const physics = {
            friction: 0.93,
            bounce: 0.8,
            mobileSensitivity: detectNavigateur(),
            mousePullFactor: 0.15,
            maxSpeed: 20,
            obstacleBounce: 1.4
        };

        function ensureObstacleSizes(obstaclesData) {
            obstaclesData.forEach(obstacle => {
                const obstacleWidth = plateau.clientWidth * 0.12;
                if (!obstacle.element.style.width || parseFloat(obstacle.element.style.width) !== obstacleWidth) {
                    console.warn(`Correction de la taille de l'obstacle ${obstacle.id}`);
                    obstacle.element.style.width = `${obstacleWidth}px`;
                    obstacle.element.style.height = `${obstacleWidth}px`;
                    obstacle.element.style.background = 'transparent';
                    obstacle.width = obstacleWidth;
                    obstacle.height = obstacleWidth;
                    obstacle.updateElementPosition();
                    const img = obstacle.element.querySelector('img');
                    if (img) {
                        img.style.display = 'block';
                        img.style.width = '100%';
                        img.style.height = '100%';
                        img.style.objectFit = 'contain';
                    }
                }
            });
        }

        const obstaclesData = [];
        const obstacleElements = [obstacle, secondObstacle, thirdObstacle];
        let imagesLoaded = 0;
        const totalImages = obstacleElements.length;

        obstacleElements.forEach((obstacleElement, index) => {
            const imgElement = obstacleElement.querySelector('img') || obstacleElement.getElementsByTagName('img')[0];
            if (imgElement) {
                imgElement.onload = () => {
                    console.log(`Image de l'obstacle ${index} chargée`);
                    imagesLoaded++;
                    if (imagesLoaded === totalImages) {
                        initializeObstacles();
                    }
                };
                imgElement.onerror = () => {
                    console.error(`Erreur de chargement de l'image pour l'obstacle ${index}`);
                    imagesLoaded++;
                    if (imagesLoaded === totalImages) {
                        initializeObstacles();
                    }
                };
                if (imgElement.complete) {
                    imgElement.onload();
                }
            } else {
                console.warn(`Pas d'image trouvée pour l'obstacle ${index}`);
                imagesLoaded++;
                if (imagesLoaded === totalImages) {
                    initializeObstacles();
                }
            }
        });

        function initializeObstacles() {
            obstacleElements.forEach((obstacleElement, index) => {
                console.log(`Initialisation de l'obstacle ${index}...`);

                const obstacleWidth = plateau.clientWidth * 0.12;
                obstacleElement.style.width = `${obstacleWidth}px`;
                obstacleElement.style.height = `${obstacleWidth}px`;
                obstacleElement.style.background = 'transparent';
                obstacleElement.style.display = 'block';
                obstacleElement.style.position = 'absolute';
                obstacleElement.style.pointerEvents = 'none';
                obstacleElement.style.userSelect = 'none';
                obstacleElement.style.zIndex = '1';

                console.log(`Obstacle ${index} - Taille: ${obstacleElement.offsetWidth}x${obstacleElement.offsetHeight}px, Visible: ${obstacleElement.style.display}`);

                const ua = navigator.userAgent;
                let speedYBase;
                if (/Chrome/i.test(ua) && !/OPR|MiuiBrowser/i.test(ua)) {
                    speedYBase = 0.7;
                } else if (/Firefox/i.test(ua)) {
                    speedYBase = 0.6;
                } else if (/MiuiBrowser/i.test(ua)) {
                    speedYBase = 0.65;
                } else if (/OPR/i.test(ua)) {
                    speedYBase = 0.68;
                } else {
                    speedYBase = 0.62;
                }

                const variations = [
                    { maxDrift: 2.5, driftFrequency: 0.05, speedYBase: speedYBase },
                    { maxDrift: 2.7, driftFrequency: 0.04, speedYBase: speedYBase * 1.1 },
                    { maxDrift: 2.3, driftFrequency: 0.06, speedYBase: speedYBase * 0.9 }
                ];

                const obstacleData = {
                    element: obstacleElement,
                    id: index,
                    x: plateau.clientWidth / 2,
                    y: -obstacleWidth - (index * 200),
                    width: obstacleWidth,
                    height: obstacleWidth,
                    speedY: variations[index].speedYBase + Math.random() * 0.1,
                    speedX: 0,
                    maxDrift: variations[index].maxDrift,
                    driftFrequency: variations[index].driftFrequency,
                    baseX: plateau.clientWidth / 2,
                    active: true,

                    resetPosition() {
                        this.baseX = Math.random() * (plateau.clientWidth * 0.6) + (plateau.clientWidth * 0.2);
                        this.x = this.baseX;
                        this.y = -this.height - (Math.random() * 300 + index * 100);
                        this.speedX = 0;
                        this.speedY = variations[this.id].speedYBase + Math.random() * 0.1;
                        this.updateElementPosition();
                        console.log(`Obstacle ${this.id} réinitialisé:`, this.x, this.y, this.speedY, this.element.style.left, this.element.style.top);
                    },

                    updateElementPosition() {
                        this.element.style.left = `${this.x - this.width / 2}px`;
                        this.element.style.top = `${this.y - this.height / 2}px`;
                    },

                    updatePosition() {
                        if (!this.active) return;
                        this.y += this.speedY;
                        if (Math.random() < this.driftFrequency) {
                            this.speedX = (Math.random() * 2 - 1) * this.maxDrift;
                        }
                        this.x += this.speedX;
                        this.speedX += (this.baseX - this.x) * 0.005;
                        if (Math.abs(this.x - this.baseX) > plateau.clientWidth * 0.3) {
                            this.speedX = (this.baseX - this.x) * 0.1;
                        }
                        if (this.x + this.width / 2 > plateau.clientWidth) {
                            this.x = plateau.clientWidth - this.width / 2;
                            this.speedX *= -1;
                        } else if (this.x - this.width / 2 < 0) {
                            this.x = this.width / 2;
                            this.speedX *= -1;
                        }
                        this.updateElementPosition();
                        if (this.id === 0 && Math.random() < 0.01) {
                            console.log(`Obstacle ${this.id} position:`, this.y, "Vitesse:", this.speedY);
                        }
                    }
                };

                obstacleData.resetPosition();
                obstaclesData.push(obstacleData);
            });

            ensureObstacleSizes(obstaclesData);

            const obstacle2 = document.getElementById("obstacle-container-2");
            if (obstacle2) {
                obstacle2.style.display = 'none';
                setTimeout(() => {
                    obstacle2.style.display = 'block';
                    console.log("Obstacle 2 forcé à se réafficher");
                }, 0);
            }
        }

        const calculateRotation = (x, y) => Math.atan2(y, x) * (180 / Math.PI) + 90;

        function requestMotionPermission() {
            keepScreenAwake();
            screenLockActive = true;
            permissionRequested = true;

            if (typeof DeviceMotionEvent?.requestPermission === 'function') {
                DeviceMotionEvent.requestPermission()
                    .then(permissionState => {
                        console.log("Permission accéléromètre:", permissionState);
                        if (permissionState === 'granted') {
                            window.addEventListener('devicemotion', handleMotion);
                            setTimeout(() => {
                                if (!motionDetected) {
                                    console.warn("Accéléromètre autorisé mais pas de données reçues, passage en mode tactile");
                                    fallbackToTouchControls();
                                }
                            }, 1000);
                        } else {
                            console.warn("Permission accéléromètre refusée");
                            fallbackToTouchControls();
                        }
                    })
                    .catch(error => {
                        console.error("Erreur d'autorisation accéléromètre:", error);
                        fallbackToTouchControls();
                    });
            } else {
                console.log("Accéléromètre sans permission requise");
                window.addEventListener('devicemotion', handleMotion);
                setTimeout(() => {
                    if (!motionDetected) {
                        console.warn("Pas de données d'accéléromètre reçues, passage en mode tactile");
                        fallbackToTouchControls();
                    }
                }, 1000);
            }
        }

        const handleMotion = (e) => {
            if (!e.accelerationIncludingGravity) {
                console.warn("Aucune donnée d'accélération disponible");
                return;
            }

            motionDetected = true;
            accelX = -e.accelerationIncludingGravity.x * 0.1 + accelX * 0.9;
            accelY = e.accelerationIncludingGravity.y * 0.1 + accelY * 0.9;
            console.log("Accéléromètre:", { accelX, accelY });

            lastInteractionTime = Date.now();

            if (!screenLockActive) {
                keepScreenAwake();
                screenLockActive = true;
            }
        };

        const fallbackToTouchControls = () => {
            console.log("Passage au mode tactile");
            window.removeEventListener('devicemotion', handleMotion);

            let touchStartX = 0;
            let touchStartY = 0;

            plateau.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
                lastInteractionTime = Date.now();

                if (!screenLockActive) {
                    keepScreenAwake();
                    screenLockActive = true;
                }
            });

            plateau.addEventListener('touchmove', (e) => {
                const touchX = e.touches[0].clientX;
                const touchY = e.touches[0].clientY;

                accelX = (touchX - touchStartX) * 0.05;
                accelY = (touchY - touchStartY) * 0.05;

                touchStartX = touchX;
                touchStartY = touchY;
                lastInteractionTime = Date.now();
                e.preventDefault();
            });
        };

        const initMobileControls = () => {
            // Le bouton accéléromètre sera géré dans gameLoop
        };

        const initPCControls = () => {
            plateau.addEventListener('mousemove', (e) => {
                const rect = plateau.getBoundingClientRect();
                speedX = (e.clientX - rect.left - posX) * physics.mousePullFactor;
                speedY = (e.clientY - rect.top - posY) * physics.mousePullFactor;
                lastInteractionTime = Date.now();
            });
        };

        useMobileControls ? initMobileControls() : initPCControls();

        const updateObstacles = () => {
            obstaclesData.forEach(obstacle => {
                obstacle.updatePosition();

                if (obstacle.y - obstacle.height / 2 > plateau.clientHeight) {
                    if (obstacle === attachedObstacle) {
                        posX = plateau.clientWidth / 2;
                        posY = plateau.clientHeight * 0.9;
                        speedX = 0;
                        speedY = 0;
                        ParaContainer.style.zIndex = '1';
                        attachedObstacle = null;
                    }

                    // Arrêter le son de l'obstacle lorsqu'il atteint le bas
                    const sound = sounds[obstacle.id];
                    if (sound && !sound.paused) {
                        sound.pause();
                        sound.currentTime = 0; // Réinitialiser pour la prochaine lecture
                        console.log(`Son ${obstacle.id} arrêté`);
                    }

                    score2++;
                    score2Display.textContent = `Oiseaux partis: ${score2}`;

                    obstacle.y = -obstacle.height;
                    obstacle.x = Math.random() * (plateau.clientWidth * 0.6) + (plateau.clientWidth * 0.2);
                    obstacle.updateElementPosition();
                }
            });

            if (Math.random() < 0.05) {
                ensureObstacleSizes(obstaclesData);
            }
        };

        const checkCollisions = () => {
            if (posX + billeRadius > plateau.clientWidth) {
                posX = plateau.clientWidth - billeRadius;
                speedX *= -physics.bounce;
            } else if (posX - billeRadius < 0) {
                posX = billeRadius;
                speedX *= -physics.bounce;
            }

            if (posY + billeRadius > plateau.clientHeight) {
                posY = plateau.clientHeight - billeRadius;
                speedY *= -physics.bounce;
            } else if (posY - billeRadius < 0) {
                posY = billeRadius;
                speedY *= -physics.bounce;
            }

            obstaclesData.forEach(obstacle => {
                if (!obstacle.active) return;

                const dx = posX - obstacle.x;
                const dy = posY - obstacle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const minDist = billeRadius + (obstacle.width / 2);

                if (distance < minDist) {
                    if (posY < obstacle.y && dy < 0 && !attachedObstacle) {
                        score++;
                        scoreDisplay.textContent = `Attrapés: ${score}`;
                        attachedObstacle = obstacle;
                        ParaContainer.style.zIndex = '10';
                        lastInteractionTime = Date.now();

                        // Jouer le son correspondant à l'obstacle
                        const sound = sounds[obstacle.id];
                        if (sound) {
                            sound.currentTime = 0; // Réinitialiser pour rejouer
                            sound.play().then(() => {
                                console.log(`Son ${obstacle.id} joué`);
                            }).catch(err => {
                                console.error(`Erreur de lecture du son ${obstacle.id}:`, err);
                            });
                        }
                    } else if (!attachedObstacle) {
                        const angle = Math.atan2(dy, dx);
                        posX = obstacle.x + Math.cos(angle) * minDist;
                        posY = obstacle.y + Math.sin(angle) * minDist;
                        speedX = Math.cos(angle) * physics.obstacleBounce * physics.maxSpeed;
                        speedY = Math.sin(angle) * physics.obstacleBounce * physics.maxSpeed;
                        lastInteractionTime = Date.now();
                    }
                }
            });
        };

        const checkInactivity = () => {
            const inactivityTime = 10000;
            const currentTime = Date.now();

            if (screenLockActive && (currentTime - lastInteractionTime > inactivityTime)) {
                releaseScreenAwake();
                screenLockActive = false;
            }
        };

        const gameLoop = () => {
            // Gestion du bouton accéléromètre sur mobile
            if (isMobile && !permissionRequested && !motionDetected && !permButton) {
                console.log("Création du bouton Utiliser l'accéléromètre dans gameLoop");
                permButton = document.createElement('button');
                permButton.innerText = "Utiliser l'accéléromètre";
                permButton.style.position = 'fixed';
                permButton.style.top = '50%';
                permButton.style.left = '50%';
                permButton.style.transform = 'translate(-50%, -50%)';
                permButton.style.padding = '15px 30px';
                permButton.style.background = '#007bff';
                permButton.style.color = 'white';
                permButton.style.border = 'none';
                permButton.style.borderRadius = '5px';
                permButton.style.cursor = 'pointer';
                permButton.style.fontSize = '18px';
                permButton.style.zIndex = '1000';
                document.body.appendChild(permButton);

                permButton.addEventListener('click', () => {
                    console.log("Clic sur Utiliser l'accéléromètre");
                    requestMotionPermission();
                    permButton.remove();
                    permButton = null;
                });
            }

            if (attachedObstacle) {
                posX = attachedObstacle.x;
                posY = attachedObstacle.y;
                speedX = 0;
                speedY = 0;
            } else {
                if (isMobile) {
                    speedX += accelX * physics.mobileSensitivity;
                    speedY += accelY * physics.mobileSensitivity;
                }

                speedX *= physics.friction;
                speedY *= physics.friction;

                const speed = Math.sqrt(speedX * speedX + speedY * speedY);
                if (speed > physics.maxSpeed) {
                    speedX = (speedX / speed) * physics.maxSpeed;
                    speedY = (speedY / speed) * physics.maxSpeed;
                }

                posX += speedX;
                posY += speedY;
            }

            updateObstacles();
            checkCollisions();
            checkInactivity();

            PP.style.transform = attachedObstacle ? 'rotate(180deg)' : `rotate(${calculateRotation(speedX, speedY)}deg)`;
            ParaContainer.style.left = `${posX - billeRadius}px`;
            ParaContainer.style.top = `${posY - billeRadius}px`;

            requestAnimationFrame(gameLoop);
        };

        console.log("Démarrage de la boucle de jeu...");
        gameLoop();
    }
});