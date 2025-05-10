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

    // Ajouter un curseur pour régler la vitesse des obstacles
    const speedSliderContainer = document.createElement('div');
    speedSliderContainer.id = 'speed-slider-container';
    speedSliderContainer.style.position = 'absolute';
    speedSliderContainer.style.top = '10px';
    speedSliderContainer.style.right = '10px';
    speedSliderContainer.style.padding = '10px';
    speedSliderContainer.style.background = 'rgba(0, 0, 0, 0.7)';
    speedSliderContainer.style.borderRadius = '10px';
    speedSliderContainer.style.color = 'white';
    speedSliderContainer.style.fontFamily = 'Arial, sans-serif';
    speedSliderContainer.style.fontSize = '14px';
    speedSliderContainer.style.zIndex = '1000';

    const speedSliderLabel = document.createElement('div');
    speedSliderLabel.textContent = 'Vitesse obstacles: 0.7';
    speedSliderLabel.style.marginBottom = '5px';

    const speedSlider = document.createElement('input');
    speedSlider.type = 'range';
    speedSlider.min = '0.1';
    speedSlider.max = '2.0';
    speedSlider.step = '0.1';
    speedSlider.value = '0.7';
    speedSlider.style.width = '100px';

    speedSliderContainer.appendChild(speedSliderLabel);
    speedSliderContainer.appendChild(speedSlider);
    plateau.appendChild(speedSliderContainer);

    // Charger NoSleep.js pour iOS
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

    const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || window.orientation !== undefined;
    const initDelay = isMobile ? 1000 : 200;

    setTimeout(initJeu, initDelay);

    function initJeu() {
        console.log("Initialisation du jeu...");
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
        scoreDisplay.textContent = `Queues bouffées: ${score}`;
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

                // Vitesse de base définie par le curseur
                let speedYBase = parseFloat(speedSlider.value);

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

            // Mettre à jour la vitesse des obstacles lorsque le curseur change
            speedSlider.addEventListener('input', () => {
                const newSpeed = parseFloat(speedSlider.value);
                speedSliderLabel.textContent = `Vitesse obstacles: ${newSpeed.toFixed(1)}`;
                obstaclesData.forEach((obstacle, index) => {
                    const variations = [
                        { speedYBase: newSpeed },
                        { speedYBase: newSpeed * 1.1 },
                        { speedYBase: newSpeed * 0.9 }
                    ];
                    obstacle.speedY = variations[index].speedYBase + Math.random() * 0.1;
                });
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

        const initMobileControls = () => {
            let motionDetected = false;

            const handleMotion = (e) => {
                if (!e.accelerationIncludingGravity) return;

                motionDetected = true;

                accelX = -e.accelerationIncludingGravity.x * 0.1 + accelX * 0.9;
                accelY = e.accelerationIncludingGravity.y * 0.1 + accelY * 0.9;

                lastInteractionTime = Date.now();

                if (!screenLockActive) {
                    keepScreenAwake();
                    screenLockActive = true;
                }
            };

            const requestMotionPermission = () => {
                const permButton = document.createElement('button');
                permButton.innerText = "Utiliser l'accéléromètre";
                permButton.style.position = "absolute";
                permButton.style.top = "50%";
                permButton.style.left = "50%";
                permButton.style.transform = "translate(-50%, -50%)";
                permButton.style.padding = "15px";
                permButton.style.zIndex = "1000";
                permButton.style.background = "#007bff";
                permButton.style.color = "white";
                permButton.style.border = "none";
                permButton.style.borderRadius = "5px";

                permButton.addEventListener('click', () => {
                    keepScreenAwake();
                    screenLockActive = true;

                    if (typeof DeviceMotionEvent?.requestPermission === 'function') {
                        DeviceMotionEvent.requestPermission()
                            .then(permissionState => {
                                if (permissionState === 'granted') {
                                    window.addEventListener('devicemotion', handleMotion);

                                    setTimeout(() => {
                                        if (!motionDetected) {
                                            console.warn("Accéléromètre autorisé mais pas de données reçues, passage en mode tactile");
                                            fallbackToTouchControls();
                                        }
                                    }, 1000);
                                } else {
                                    fallbackToTouchControls();
                                }
                                permButton.remove();
                            })
                            .catch(error => {
                                console.error("Erreur d'autorisation:", error);
                                fallbackToTouchControls();
                                permButton.remove();
                            });
                    } else {
                        window.addEventListener('devicemotion', handleMotion);

                        setTimeout(() => {
                            if (!motionDetected) {
                                console.warn("Pas de données d'accéléromètre reçues, passage en mode tactile");
                                fallbackToTouchControls();
                            }
                        }, 1000);
                        permButton.remove();
                    }
                });

                plateau.appendChild(permButton);
            };

            const fallbackToTouchControls = () => {
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

            requestMotionPermission();
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
                        scoreDisplay.textContent = `Queues bouffées: ${score}`;
                        attachedObstacle = obstacle;
                        ParaContainer.style.zIndex = '10';
                        lastInteractionTime = Date.now();
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