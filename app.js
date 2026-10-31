// ==================== АУДИОПЕРЕМЕННЫЕ ====================
const rainAudio = document.getElementById("rainAudio");
const sleepClickAudio = document.getElementById("sleepClickAudio");
const level1Music = document.getElementById("level1Music");
const level2Music = document.getElementById("level2Music");
const level3Music = document.getElementById("level3Music");
const level4Music = document.getElementById("level4Music");
const level6Music = document.getElementById("level5Music"); // Уровень 6 использует ту же музыкальную переменную
const level7Music = document.getElementById("level7Music");
const level8Music = document.getElementById("level8Music");
const level9Music = document.getElementById("level9Music");
const deathMusic = document.getElementById("deathMusic");
const inventoryOpenAudio = document.getElementById("inventoryOpenAudio");
const portalSpawnAudio = document.getElementById("portalSpawnAudio");
const waterPickupAudio = document.getElementById("waterPickupAudio");
const waterUseAudio = document.getElementById("waterUseAudio");
const bandageUseAudio = document.getElementById("bandageUseAudio");
const monster1Audio = document.getElementById("monster1Audio");
const monster2Audio = document.getElementById("monster2Audio");
const monster2DamageAudio = document.getElementById("monster2DamageAudio");
const monster3Audio = document.getElementById("monster3Audio");
const respawnClockAudio = document.getElementById("respawnClockAudio");
const respawnSinkAudio = document.getElementById("respawnSinkAudio");
const shopOpenAudio = document.getElementById("shopOpenAudio");
const shopBuyAudio = document.getElementById("shopBuyAudio");
const equipItemAudio = document.getElementById("equipItemAudio");
const shockerSound = document.getElementById("shockerSound");
const shockerAnimation = document.getElementById("shockerAnimation");
const pageTurnAudio = document.getElementById("pageTurnAudio");
const bossMusic = document.getElementById("bossMusic");
const bossPhase2Music = document.getElementById("bossPhase2Music"); // <--- ДОБАВЬ СЮДА
// ==================== АВТОЗАГРУЗКА ЛОТУСА ====================
let currentLotusSave = null; 

try {
    const savedLotus = JSON.parse(localStorage.getItem("dreamCoreLotusSave"));
    if (savedLotus) {
        currentLotusSave = savedLotus;
    }
} catch(e) {}

document.addEventListener("DOMContentLoaded", () => {
    const lotusGroundElem = document.getElementById("lotusGroundItem");
    if (lotusGroundElem) {
        lotusGroundElem.classList.remove("show-lotus");
        lotusGroundElem.style.display = "none";
    }

    const adminBtnElem = document.getElementById("adminOpenBtn");
    if (adminBtnElem) {
        if (!achievementStats.adminUnlocked) {
            adminBtnElem.classList.remove("show");
            adminBtnElem.style.display = "none"; 
        } else {
            adminBtnElem.classList.add("show");
            adminBtnElem.style.display = "block";
        }
    }
});

let equippedItems = {
    shocker: false,
    glasses: false,
    brokenTimer: false,
    startClock: false,
    antivirusPro: false,
    holyCross: false
};

function fadeOutAudio(audio, duration = 1000) {
    if (!audio) return;
    const startVolume = audio.volume;
    const steps = 20;
    const stepTime = duration / steps;
    let step = 0;

    const fadeInterval = setInterval(() => {
        step++;
        audio.volume = Math.max(0, startVolume * (1 - step / steps));
        if (step >= steps) {
            clearInterval(fadeInterval);
            audio.pause();
            audio.currentTime = 0;
            audio.volume = startVolume;
        }
    }, stepTime);
}

/* =====================================================
   DREAMCORE — СИСТЕМА ДОСТИЖЕНИЙ
   ===================================================== */
const achievementData = [
    { id: 1, name: "Где я?", tier: "easy", how: "Впервые проснись и начни игру." },
    { id: 2, name: "Новичок", tier: "easy", how: "Нажми на любую стрелку 1 раз." },
    { id: 3, name: "Испугался?", tier: "easy", how: "Впервые встреть любого монстра." },
    { id: 4, name: "Осмотрелся", tier: "easy", how: "Открой карту." },
    { id: 5, name: "Почему так темно", tier: "easy", how: "Впервые закрой глаза." },
    { id: 6, name: "Пополнение", tier: "easy", how: "Подбери любой предмет." },
    { id: 7, name: "Ай, больно в ноге", tier: "easy", how: "Впервые получи урон." },
    { id: 8, name: "Страшный сон", tier: "easy", how: "???" },
    { id: 9, name: "Руки не крюки", tier: "normal", how: "Впервые используй предмет из инвентаря." },
    { id: 10, name: "Наелся", tier: "normal", how: "Используй миндальную воду." },
    { id: 11, name: "Подросток", tier: "normal", how: "Используй энергетик." },
    { id: 12, name: "Доктор", tier: "normal", how: "Используй бинт." },
    { id: 13, name: "Прогулка", tier: "normal", how: "Нажми на стрелки суммарно 10 раз." },
    { id: 14, name: "Я в домике", tier: "normal", how: "Закрой глаза когда заметишь фембоя и избеги урона." },
    { id: 15, name: "Уснул дважды", tier: "medium", how: "Доведи энергию до 0% и умри от усталости." },
    { id: 16, name: "Не догоняемый", tier: "medium", how: "Нажми на стрелки суммарно 50 раз." },
    { id: 17, name: "Я сам себе щит", tier: "medium", how: "5 раз закрой глаза во время когда заметишь фембоя и избеги урона." },
    { id: 18, name: "Ну ты просто босс", tier: "medium", how: "Впервые умри." },
    { id: 19, name: "Проголодался", tier: "medium", how: "Доведи показатель голода до 0%." },
    { id: 20, name: "Садовник", tier: "medium", how: "Посадить лотус." },
    { id: 21, name: "Голодовка", tier: "medium", how: "Умереть от голода." },
    { id: 22, name: "Мендалаголик", tier: "hard", how: "Используй 15 бутылок миндальной воды." },
    { id: 23, name: "Остановка сердца", tier: "hard", how: "Используй 15 энергетиков." },
    { id: 24, name: "Медик!!", tier: "hard", how: "Используй 15 бинтов." },
    { id: 25, name: "Ноги не отпали?", tier: "hard", how: "Нажми на стрелки суммарно 100 раз." },
    { id: 26, name: "Непробиваемый", tier: "hard", how: "Получи урон 20 раз." },
    { id: 27, name: "Слепой", tier: "hard", how: "Закрой глаза 30 раз." },
    { id: 28, name: "Родился в капусте", tier: "hard", how: "Использовать сохранение." },
    { id: 29, name: "Откажусь пожалуй", tier: "hard", how: "Открыть интерфейс портальной пушки и выйти, не используя портал." },
    { id: 30, name: "Маскировка", tier: "hard", how: "Встретить фембоя с экипированными очками." },
    { id: 31, name: "POLICE MAN", tier: "hard", how: "Ударить кайлесена электрошокером." },
    { id: 32, name: "Хацкер", tier: "hard", how: "Избавиться от глюкембера с помощью взлома." },
    { id: 33, name: "Как ты ещё не устал?", tier: "veryhard", how: "Нажми на стрелки суммарно 500 раз." },
    { id: 34, name: "Тик-так", tier: "veryhard", how: "Подбери часы возрождения впервые." },
    { id: 35, name: "Наркоман в 15 лет", tier: "veryhard", how: "Используй 50 энергетиков." },
    { id: 36, name: "Познался в развитии", tier: "veryhard", how: "Используй 50 бутылок миндальной воды." },
    { id: 37, name: "Мумия", tier: "veryhard", how: "Используй 50 бинтов." },
    { id: 38, name: "Христос воскрес", tier: "veryhard", how: "Потрать часы возрождения, чтобы спастись от смертельного урона." },
    { id: 39, name: "Я не ошибся дверью?", tier: "veryhard", how: "Войди в дверь, ведущую на второй уровень." },
    { id: 40, name: "Акулёнок", tier: "veryhard", how: "Попади на второй уровень." },
    { id: 41, name: "Инвестор", tier: "veryhard", how: "Купить все предметы в магазине." },
    { id: 42, name: "IKEA 3008", tier: "veryhard", how: "Попасть на уровень 3." },
    { id: 43, name: "2021 ностальгия", tier: "veryhard", how: "Попасть на уровень 4." },
    { id: 44, name: "А ХАГИ-ВАГИ", tier: "veryhard", how: "Попасть на уровень 4." },
    { id: 45, name: "RE:ZERO", tier: "veryhard", how: "Умереть 5 раз." },
    { id: 46, name: "Повидавшего всё", tier: "veryhard", how: "Встретить всех монстров в игре." },
    { id: 47, name: "Беги-беги слонёнок", tier: "veryhard", how: "Попасть на уровень 5." },
    { id: 48, name: "Пятки сверкают", tier: "veryhard", how: "Пройти уровень 5." },
    { id: 49, name: "Слендер мен", tier: "veryhard", how: "Попасть на уровень 6." },
    { id: 50, name: "Вайб нового года", tier: "veryhard", how: "Попасть на уровень 7." },
    { id: 51, name: "Ностальгия 2013", tier: "veryhard", how: "Попасть на уровень 8." },
    { id: 52, name: "Лиминал для детей", tier: "veryhard", how: "Попасть на уровень 9." },
    { id: 53, name: "Пора просыпаться", tier: "veryhard", how: "Попасть на уровень 10." },
    { id: 54, name: "Рекордсмен", tier: "impossible", how: "Нажми на стрелки суммарно 1000 раз." },
    { id: 55, name: "Отказ желудка", tier: "impossible", how: "Используй 150 бутылок миндальной воды." },
    { id: 56, name: "Я забыл, что такое спать!", tier: "impossible", how: "Используй 150 энергетиков." },
    { id: 57, name: "Андрей Евгеньевич Быков", tier: "impossible", how: "Используй 150 бинтов." },
    { id: 58, name: "Я везунчик", tier: "impossible", how: "Найди часы возрождения во второй раз." },
    { id: 59, name: "Приключение на 20 минут", tier: "impossible", how: "Войди в портал." },
    { id: 60, name: "ADMIN", tier: "impossible", how: "Ввести секретный код в меню, чтобы разблокировать админ-панель." },
    { id: 61, name: "Проснулся", tier: "impossible", how: "Победить босса." }
];

const achievementStatsDefaults = {
    started: false, 
    steps: 0, monsters: 0, mapOpened: false, 
    eyesClosed: 0,
    itemsPicked: 0, itemsUsed: 0, damage: 0, waterUsed: 0, energyUsed: 0,
    bandageUsed: 0, monster2Blocked: 0, deaths: 0, fatigueDeath: false,
    
    hungerZero: false, 
    respawnClocksFound: 0, respawnUsed: false, 
    doorEntered: false,
    
    level2: false, 
    portalEntered: false, 
    metMonster5: false, 
    adminUnlocked: false,
    
    portalGunOpenedWithoutUsing: false,
    seenMonster1: false,
    seenMonster2: false,
    seenMonster3: false,
    seenMonster4: false,
    seenMonster5: false
};

function loadAchievementSave() {
    try {
        const saved = JSON.parse(localStorage.getItem("dreamCoreAchievements") || "{}");
        return {
            unlocked: Array.isArray(saved.unlocked) ? saved.unlocked : [],
            stats: { ...achievementStatsDefaults, ...(saved.stats || {}) }
        };
    } catch (error) {
        return { unlocked: [], stats: { ...achievementStatsDefaults } };
    }
}

const achievementSave = loadAchievementSave();
let unlockedAchievements = achievementSave.unlocked;
let achievementStats = achievementSave.stats;

function saveAchievements() {
    try {
        localStorage.setItem("dreamCoreAchievements", JSON.stringify({
            unlocked: unlockedAchievements,
            stats: achievementStats
        }));
    } catch (error) {}
}

const achievementsScreen = document.getElementById("achievementsScreen");
const achievementsOpen = document.getElementById("achievementsOpen");
const achievementsClose = document.getElementById("achievementsClose");
const achievementsList = document.getElementById("achievementsList");
const achievementsProgress = document.getElementById("achievementsProgress");
const achievementDetails = document.getElementById("achievementDetails");
const achievementToast = document.getElementById("achievementToast");
const achievementToastName = document.getElementById("achievementToastName");

let selectedAchievementId = null;
let achievementToastQueue = [];
let achievementToastBusy = false;

function openAchievements() {
    achievementsScreen.classList.add("open");
    renderAchievements();
}

function closeAchievements() {
    achievementsScreen.classList.remove("open");
}

achievementsOpen.addEventListener("click", () => {
    if (achievementsScreen.classList.contains("open")) closeAchievements();
    else openAchievements();
});

achievementsClose.addEventListener("click", closeAchievements);

function renderAchievements() {
    achievementsList.innerHTML = "";
    achievementsProgress.textContent = `Открыто: ${unlockedAchievements.length} / ${achievementData.length}`;

    achievementData.forEach(achievement => {
        const unlocked = unlockedAchievements.includes(achievement.id);
        const card = document.createElement("button");
        card.type = "button";
        card.className = `achievement-card tier-${achievement.tier}` + (unlocked ? " unlocked" : "") + (selectedAchievementId === achievement.id ? " selected" : "");

        card.innerHTML = `
            <span class="achievement-symbol">${unlocked ? "★" : "◇"}</span>
            <span>
                <span class="achievement-card-name">${achievement.id}. ${achievement.name}</span>
                <span class="achievement-card-tier">${achievement.tier === "easy" ? "Лёгкая" : achievement.tier === "normal" ? "Обычная" : achievement.tier === "medium" ? "Трудноватая" : achievement.tier === "hard" ? "Сложная" : achievement.tier === "veryhard" ? "Очень сложная" : "Невозможная"}</span>
            </span>
            <span class="achievement-status">${unlocked ? "✓" : "🔒"}</span>
        `;

        card.addEventListener("click", () => {
            selectedAchievementId = achievement.id;
            showAchievementDetails(achievement);
            renderAchievements();
        });

        achievementsList.appendChild(card);
    });

    if (selectedAchievementId === null) showAchievementDetails(null);
}

function showAchievementDetails(achievement) {
    if (!achievement) {
        achievementDetails.innerHTML = `<h2>Выбери достижение</h2><p>Нажми на любую карточку, чтобы узнать, как её получить.</p>`;
        return;
    }

    const unlocked = unlockedAchievements.includes(achievement.id);
    const tierNames = { easy: "Лёгкая", normal: "Обычная", medium: "Трудноватая", hard: "Сложная", veryhard: "Очень сложная", impossible: "Невозможная" };

    achievementDetails.innerHTML = `
        <div class="achievement-detail-tier tier-${achievement.tier}">${tierNames[achievement.tier]}</div>
        <h2>${achievement.name}</h2>
        <p>${achievement.how}</p>
        ${unlocked ? '<span class="achievement-unlocked-label">✓ ДОСТИЖЕНИЕ ПОЛУЧЕНО</span>' : '<p>🔒 Пока не получено</p>'}
    `;
}

function showAchievementToast(achievement) {
    achievementToastQueue.push(achievement);
    if (!achievementToastBusy) playNextAchievementToast();
}

function playNextAchievementToast() {
    if (achievementToastQueue.length === 0) {
        achievementToastBusy = false;
        return;
    }

    achievementToastBusy = true;
    const achievement = achievementToastQueue.shift();
    achievementToastName.textContent = achievement.name;
    achievementToast.classList.remove("show");

    void achievementToast.offsetWidth;
    achievementToast.classList.add("show");

    setTimeout(() => {
        achievementToast.classList.remove("show");
        setTimeout(playNextAchievementToast, 250);
    }, 4000);
}

function unlockAchievement(identifier) {
    const achievement = achievementData.find(item => item.id === identifier || item.name === identifier);
    if (!achievement || unlockedAchievements.includes(achievement.id)) return;

    unlockedAchievements.push(achievement.id);
    saveAchievements();
    showAchievementToast(achievement);

    if (achievementsScreen.classList.contains("open")) renderAchievements();
}

function checkAchievements() {
    const s = achievementStats;
    if (s.started) unlockAchievement(1);
    if (s.steps >= 1) unlockAchievement(2);
    if (s.monsters >= 1) unlockAchievement(3);
    if (s.mapOpened) unlockAchievement(4);
    if (s.eyesClosed >= 1) unlockAchievement(5);
    if (s.itemsPicked >= 1) unlockAchievement(6);
    if (s.damage >= 1) unlockAchievement(7);
    
    // ID 8 («Страшный сон») теперь выдается честно или по кнопке «Секрет», а не в титрах
    
    if (s.itemsUsed >= 1) unlockAchievement(9);
    if (s.waterUsed >= 1) unlockAchievement(10);
    if (s.energyUsed >= 1) unlockAchievement(11);
    if (s.bandageUsed >= 1) unlockAchievement(12);
    if (s.steps >= 10) unlockAchievement(13);
    if (s.monster2Blocked >= 1) unlockAchievement(14);
    if (s.fatigueDeath) unlockAchievement(15); // <--- Теперь строго смерть от усталости!
    if (s.steps >= 50) unlockAchievement(16);  // <--- «Не догоняемый» за 50 шагов
    if (s.monster2Blocked >= 5) unlockAchievement(17);
    if (s.deaths >= 1) unlockAchievement(18);
    if (s.hungerZero) unlockAchievement(19);
    
    if (s.hungerZero && s.deaths > 0) unlockAchievement(21);
    if (s.waterUsed >= 15) unlockAchievement(22);
    if (s.energyUsed >= 15) unlockAchievement(23);
    if (s.bandageUsed >= 15) unlockAchievement(24);
    if (s.steps >= 100) unlockAchievement(25);
    if (s.damage >= 20) unlockAchievement(26);
    if (s.eyesClosed >= 30) unlockAchievement(27);
    
    if (s.steps >= 500) unlockAchievement(33); // <--- «Как ты ещё не устал?» за 500 шагов
    if (s.respawnClocksFound >= 1) unlockAchievement(34);
    if (s.energyUsed >= 50) unlockAchievement(35);
    if (s.waterUsed >= 50) unlockAchievement(36);
    if (s.bandageUsed >= 50) unlockAchievement(37);
    if (s.respawnUsed) unlockAchievement(38);
    if (s.doorEntered) unlockAchievement(39);
    if (s.level2) unlockAchievement(40);
    
    if (s.steps >= 1000) unlockAchievement(54); // <--- «Рекордсмен» за 1000 шагов
    if (s.waterUsed >= 150) unlockAchievement(55);
    if (s.energyUsed >= 150) unlockAchievement(56);
    if (s.bandageUsed >= 150) unlockAchievement(57);
    if (s.respawnClocksFound >= 2) unlockAchievement(58);
    if (s.portalEntered) unlockAchievement(59);
    
    saveAchievements();
}

function achievementEvent(eventName, value) {
    const s = achievementStats;
    switch (eventName) {
        case "start": s.started = true; break;
        case "step": s.steps++; break;
        case "monster": s.monsters++; break;
        case "map": s.mapOpened = true; break;
        case "eyeClose": s.eyesClosed++; break;
        case "pickup": s.itemsPicked++; if (value === "respawnClock") s.respawnClocksFound++; break;
        case "useItem": s.itemsUsed++; if (value === "water") s.waterUsed++; if (value === "energyDrink") s.energyUsed++; if (value === "bandage") s.bandageUsed++; break;
        case "damage": s.damage++; break;
        case "monster2Blocked": s.monster2Blocked++; break;
        case "death": s.deaths++; if (value === "fatigue") s.fatigueDeath = true; break;
        case "hungerZero": s.hungerZero = true; break;
        case "respawnUsed": s.respawnUsed = true; break;
        case "door": s.doorEntered = true; break;
        case "level2": s.level2 = true; break;
        case "portal": s.portalEntered = true; break;
        
        case "lotusPlant": unlockAchievement(20); break;
        case "hungerDeath": unlockAchievement(21); break;
        case "lotusLoad": unlockAchievement(28); break;
        case "portalGunNoSpawn": unlockAchievement(29); break;
        case "glassesBlock": unlockAchievement(30); break;
        case "shockerUse": unlockAchievement(31); break;
        case "monster5Hack": unlockAchievement(32); break;
        case "allShopBought": unlockAchievement(41); break;
        case "level3": unlockAchievement(42); break;
        case "level4": 
            unlockAchievement(43); 
            unlockAchievement(44); 
            break;
        case "fiveDeaths": unlockAchievement(45); break;
        case "allMonstersSeen": unlockAchievement(46); break;
        case "level5Start": unlockAchievement(47); break;
        case "level5Complete": unlockAchievement(48); break;
        case "level6": unlockAchievement(49); break;
        case "level7": unlockAchievement(50); break;
        case "level8": unlockAchievement(51); break;
        case "level9": unlockAchievement(52); break;
        case "level10": unlockAchievement(53); break;
        case "adminUnlock": s.adminUnlocked = true; unlockAchievement(60); break; // СТРОГО ID 60 (ADMIN)
        case "bossWin": unlockAchievement(61); break; // ID 61 (Проснулся)
        case "meetMonster":
    if (value === 1) s.seenMonster1 = true;
    if (value === 2) s.seenMonster2 = true;
    if (value === 3) s.seenMonster3 = true;
    if (value === 4) s.seenMonster4 = true;
    if (value === 5) s.seenMonster5 = true;

    // Если встретил всех пятерых — выдаем ачивку ID 46
    if (s.seenMonster1 && s.seenMonster2 && s.seenMonster3 && s.seenMonster4 && s.seenMonster5) {
        unlockAchievement(46);
    }
    break;
    }
    checkAchievements();
}

renderAchievements();

respawnClockAudio.volume = 0.7;
respawnSinkAudio.volume = 0.7;

if (rainAudio) {
    rainAudio.volume = 0.5;
    rainAudio.play().catch(() => {
        const startRainOnInteract = () => {
            rainAudio.play();
            window.removeEventListener('click', startRainOnInteract);
            window.removeEventListener('keydown', startRainOnInteract);
        };
        window.addEventListener('click', startRainOnInteract);
        window.addEventListener('keydown', startRainOnInteract);
    });
}

let inventory = document.querySelector(".INVENTORY2");
let container = document.querySelector(".container");
let body = document.querySelector("body");

let HPnumbers = 100;
let HUNGERnumbers = 100;
let ENERGYnumbers = 100;
let isDead = false;

function updateBar(fillId, textId, value) {
    const fill = document.getElementById(fillId);
    const text = document.getElementById(textId);
    fill.style.width = value + "%";
    text.innerHTML = value;

    if (value > 50) fill.style.backgroundColor = "#4CAF50";
    else if (value >= 20) fill.style.backgroundColor = "#FFEB3B";
    else fill.style.backgroundColor = "#F44336";
}

function updateAllBars() {
    updateBar("hpFill", "hpText", HPnumbers);
    updateBar("hungerFill", "hungerText", HUNGERnumbers);
    updateBar("energyFill", "energyText", ENERGYnumbers);
}
updateAllBars();

const sleepingBtn = document.querySelector(".sleeping"); 
const overlay = document.getElementById('overlay');
const whiteFlashBtn = document.getElementById('white-flash-btn');

sleepingBtn.addEventListener('click', () => {
    sleepClickAudio.play();
    overlay.classList.add('active');
    
    // ДОБАВЬ ВОТ ЭТУ СТРОЧКУ:
    sleepingBtn.style.display = 'none'
    
    setTimeout(() => whiteFlashBtn.classList.add('show'), 3000);
});

whiteFlashBtn.addEventListener('click', () => {
    whiteFlashBtn.classList.remove('show');
    overlay.classList.add('flash-white');
    overlay.classList.remove('active');

    rainAudio.pause();
    rainAudio.currentTime = 0;

    if (currentLevel === 1) level1Music.play();
    else if (currentLevel === 2) level2Music.play();

    setTimeout(() => overlay.classList.add('fade-out'), 50);
    setTimeout(() => 
    overlay.classList.remove('flash-white', 'fade-out'), 
    1100);
});

function startNow(){
    achievementEvent("start");
    let startButton = document.querySelector(".startButton");
    let lol = document.querySelector(".lol");

    body.style.backgroundImage = "url('img/level1.jpg')";
    container.style.display = "block";
    startButton.style.display = "none";
    lol.style.display = "none";

    HUNGERtime();
    ENERGYtime();

    const adminBtnElem = document.getElementById("adminOpenBtn");
    if (adminBtnElem && achievementStats.adminUnlocked) {
        adminBtnElem.classList.add("show");
        adminBtnElem.style.display = "block";
    }

    if (inventoryItems.lotus) {
        let hasLotus = false;
        slots.forEach(slot => {
            if (slot.querySelector('img[data-item="lotus"]')) hasLotus = true;
        });
        if (!hasLotus) addItemToInventory("img/lotus_shop.png", "lotus");
    }

    // --- ВЫДАЕМ СТАРТОВЫЕ ЧАСЫ РОВНО 1 РАЗ НА СТАРТЕ, ЕСЛИ ОНИ КУПЛЕНЫ ---
    if (equippedItems && equippedItems.startClock) {
        let hasClock = false;
        slots.forEach(slot => {
            if (slot.querySelector('img[data-item="respawnClock"]')) hasClock = true;
        });
        if (!hasClock) {
            addItemToInventory("img/timeRespawn.png", "respawnClock");
        }
    }
    // ------------------------------------------------------------------

    resetIdleTimer();
}

document.querySelector(".wakeupButton").onclick = function () {
    if (doorTransitionPending && transitionTargetLevel !== null) {
        const destination = transitionTargetLevel; // Здесь теперь хранится 10
        whiteFlashBtn.classList.remove("show");
        overlay.classList.remove("active");
        overlay.classList.add("flash-white");
        transitionTargetLevel = null;

        // ИСПРАВЛЕНИЕ: Здесь должно быть <= 10 (вместо 9!), чтобы пушка пускала на босса
        if (destination >= 1 && destination <= 10) startLevel(destination); 

        setTimeout(() => overlay.classList.add("fade-out"), 50);
        setTimeout(() => {
            overlay.classList.remove("flash-white", "fade-out", "active");
            document.querySelector(".lol").style.display = "none";

            // --- ВОТ СЮДА ВСТАВЬ ВОЗВРАТ КНОПКИ И ШТОРОК ПОСЛЕ ВСПЫШКИ ---
        document.querySelector(".eyesCLOSE").classList.remove("transition-hidden");
        document.getElementById("eyelidsOverlay").classList.remove("transition-hidden");
        // -----------------------------------------------------------

        }, 1100);
    } else {
        startNow();
    }
};

function inventoryON() {
    inventory.style.display = "flex";
    inventoryOpenAudio.currentTime = 0;
    inventoryOpenAudio.play();
    
    document.body.classList.add('inventory-open');
}
document.querySelector(".backpack").onclick = inventoryON;

document.querySelector(".DELETE").onclick = () => {
    inventory.style.display = "none";
    document.body.classList.remove('inventory-open');
};
document.querySelector(".backpack").onclick = inventoryON;

// А ТУТ ДОБАВЬ УДАЛЕНИЕ КЛАССА ПРИ ЗАКРЫТИИ ЧЕРЕЗ КРЕСТИК:
document.querySelector(".DELETE").onclick = () => {
    inventory.style.display = "none";
    document.body.classList.remove('inventory-open'); // <--- ВОТ ЭТУ СТРОКУ
};

// ==================== СИСТЕМА КАРТЫ С ПАУЗОЙ И СТРАНИЦАМИ ====================
let mapInterface = document.querySelector(".MAP2");
let mapButton = document.querySelector(".MAP .map");
let closeMapButton = document.querySelector(".closeMap");
let mapImageElem = document.getElementById("mapImageElem");
let mapPrevBtn = document.getElementById("mapPrevBtn");
let mapNextBtn = document.getElementById("mapNextBtn");

let mapPages = ["img/mapHotBar.png", "img/mapHotBar2.png", "img/mapHotBar3.png", "img/mapHotBar4.png"];
let currentMapPageIndex = 0;
let isGamePaused = false;

function updateMapPageDisplay() {
    if (mapImageElem) {
        mapImageElem.src = mapPages[currentMapPageIndex];
    }
}

mapButton.onclick = () => {
    if (isDead) return;
    isGamePaused = true;
    currentMapPageIndex = 0;
    updateMapPageDisplay();
    mapInterface.style.display = "block";
    achievementEvent("map");

    [level1Music, level2Music, level3Music, level4Music, level5Music].forEach(audio => {
        if (audio && !audio.paused) {
            audio.pause();
            audio.dataset.wasPlaying = "true";
        }
    });
};

closeMapButton.onclick = () => {
    isGamePaused = false;
    mapInterface.style.display = "none";

    [level1Music, level2Music, level3Music, level4Music, level5Music].forEach(audio => {
        if (audio && audio.dataset.wasPlaying === "true") {
            audio.play().catch(() => {});
            audio.dataset.wasPlaying = "false";
        }
    });
};

mapPrevBtn.onclick = () => {
    if (currentMapPageIndex > 0) {
        currentMapPageIndex--;
        updateMapPageDisplay();
        if (pageTurnAudio) { pageTurnAudio.currentTime = 0; pageTurnAudio.play().catch(() => {}); }
    }
};

mapNextBtn.onclick = () => {
    if (currentMapPageIndex < mapPages.length - 1) {
        currentMapPageIndex++;
        updateMapPageDisplay();
        if (pageTurnAudio) { pageTurnAudio.currentTime = 0; pageTurnAudio.play().catch(() => {}); }
    }
};

let hungerInterval = null;
let energyInterval = null;

function HUNGERtime() {
    if (hungerInterval !== null) return;
    hungerInterval = setInterval(() => {
        if (isDead || isGamePaused || currentLevel === 5) return;
        if (HUNGERnumbers > 0) {
            HUNGERnumbers = Math.max(0, HUNGERnumbers - 1);
            updateAllBars();
            if (HUNGERnumbers === 0) achievementEvent("hungerZero");
        }
    }, 800);
}

function ENERGYtime() {
    if (energyInterval !== null) return;
    energyInterval = setInterval(() => {
        if (isDead || isGamePaused || currentLevel === 5) return;
        if (ENERGYnumbers > 0) {
            ENERGYnumbers = Math.max(0, ENERGYnumbers - 1);
            updateAllBars();
            if (ENERGYnumbers === 0) triggerDeathSequence("fatigue");
        }
    }, 1000);
}

setInterval(() => {
    if (isDead || isGamePaused || currentLevel === 5) return;
    if (HUNGERnumbers <= 0) {
        HPnumbers = Math.max(0, HPnumbers - 5);
        achievementEvent("damage");
        updateAllBars();
        if (HPnumbers <= 0) {
            achievementEvent("hungerDeath");
            triggerDeathSequence();
        }
    }
}, 500);

const deathScreenContainer = document.getElementById("deathScreenContainer");
const menuButton = document.getElementById("menuButton");

function triggerDeathSequence(cause) {
    if (isDead) return;

const eyeButton = document.querySelector(".eyesCLOSE"); // Замени селектор на свой класс/ID кнопки глаза
if (eyeButton) {
    eyeButton.style.display = "none"; 
}

    // ===== ГАСИМ ВИДЕО ПОГОНИ ПРИ СМЕРТИ =====
    const chaseVideo = document.getElementById("chaseVideoElement");
    if (chaseVideo) {
        chaseVideo.pause();
        chaseVideo.currentTime = 0;
        chaseVideo.muted = true;
        chaseVideo.removeAttribute("src");
        chaseVideo.load();
    }
    const chaseScreen = document.getElementById("level5ChaseScreen");
    if (chaseScreen) chaseScreen.style.display = "none";
    level5Active = false;
    clearInterval(balanceInterval);
    clearInterval(qteSpawnTimer);

    achievementEvent("death", cause);
    isDead = true;

    if (lotusGroundItem) lotusGroundItem.classList.remove("show-lotus");

// ИСПРАВЛЕННЫЙ ВАРИАНТ:
[level1Music, level2Music, level3Music, level4Music, level6Music, level7Music, level8Music, level9Music].forEach(audio => {
    if (audio) { audio.pause(); audio.currentTime = 0; }
});

    if (achievementStats.deaths >= 5) achievementEvent("fiveDeaths");

    const eyelidsOverlay = document.getElementById("eyelidsOverlay");
    const eyeImg = document.querySelector(".eyeIMG");
    eyelidsOverlay.classList.add("closed");
    eyeImg.src = "img/eyeClose.png";

    setTimeout(() => {
        setTimeout(() => {
            HPnumbers = Math.max(0, HPnumbers - 100);
            updateAllBars();
            deathScreenContainer.style.display = "flex";
            if (deathMusic) { deathMusic.currentTime = 0; deathMusic.play(); }
        }, 2000);
    }, 600);
}

menuButton.onclick = () => {
    if (deathMusic) { deathMusic.pause(); deathMusic.currentTime = 0; }
    location.reload();

    const eyeButton = document.querySelector(".eyesCLOSE");
    if (eyeButton) {
        eyeButton.style.display = "block";
    }
};

const arrowLeft = document.querySelector(".left");
const arrowUp = document.querySelector(".up");
const arrowRight = document.querySelector(".right");

const jumpscareOverlay = document.getElementById("jumpscareOverlay");
const monsterImage = document.getElementById("monsterImage");
const monster2Image = document.getElementById("monster2Image");
const respawnAnimation = document.getElementById("respawnAnimation");
const respawnClockOverlay = document.getElementById("respawnClockOverlay");

let arrows = ['left', 'up', 'right'];
let monsterPosition = ''; 
let activeMonsterType = ''; 
let monster2Timer = null;
let monster2ActionTimeout = null;
let isMonster2Active = false;

function randomizeMonster() {
    if (equippedItems && equippedItems.holyCross && Math.random() < 0.5) {
        monsterPosition = null;
        activeMonsterType = null;
        return;
    }
    let randomIndex = Math.floor(Math.random() * arrows.length);
    monsterPosition = arrows[randomIndex];
    activeMonsterType = Math.random() < 0.5 ? 'monster1' : 'monster2';
}
randomizeMonster();

function tryRespawnFromMonster(damage, monsterType) {
    if (isRespawning || isDead) return false;
    let clockItem = null;

    // --- ВСТАВЬ ЭТОТ БЛОК СЮДА ---
    for (let i = 0; i < slots.length; i++) {
        clockItem = slots[i].querySelector('img[data-item="respawnClock"]');
        if (clockItem) break;
    }

    if (!clockItem) return false;
    achievementEvent("respawnUsed");

    clockItem.remove(); // <--- УДАЛЯЕТ ИЗ ИНВЕНТАРЯ ГАРАНТИРОВАННО
    // ----------------------------

    HPnumbers = damage;
    updateAllBars();
    isRespawning = true;

    clearTimeout(monster2ActionTimeout);
    clearTimeout(monster2Timer);
    isMonster2Active = false;
    
    if (monsterType === "monster3") {
        clearInterval(idleDamageInterval);
        hideMonster3();
        clearTimeout(idleTimer); 
    }

    let monster;
    if (monsterType === "monster1") monster = monsterImage;
    else if (monsterType === "monster2") monster = monster2Image;
    else monster = monster3Image;

    [monsterImage, monster2Image, monster3Image].forEach(m => {
        if (m !== monster) { m.style.display = "none"; m.classList.remove("respawn-sink"); }
    });

    monster.style.display = "block";
    monster.style.opacity = "1";
    monster.classList.remove("respawn-sink");

    respawnAnimation.style.display = "block";
    respawnClockOverlay.style.display = "block";
    respawnAnimation.classList.remove("respawn-sink");
    respawnClockOverlay.classList.remove("respawn-sink");

    respawnSinkAudio.pause();
    respawnClockAudio.currentTime = 0;
    respawnSinkAudio.currentTime = 0;
    respawnSinkAudio.volume = 0.5;
    respawnSinkAudio.play();

    const fadeDuration = 5000;
    const fadeSteps = 50;
    const fadeInterval = fadeDuration / fadeSteps;
    let fadeStep = 0;

    const fadeTimer = setInterval(() => {
        fadeStep++;
        respawnSinkAudio.volume = Math.max(0, 0.5 * (1 - fadeStep / fadeSteps));
        if (fadeStep >= fadeSteps) {
            clearInterval(fadeTimer);
            respawnSinkAudio.pause();
            respawnSinkAudio.currentTime = 0;
            respawnSinkAudio.volume = 0.5;
        }
    }, fadeInterval);

    requestAnimationFrame(() => {
        monster.classList.add("respawn-sink");
        respawnAnimation.classList.add("respawn-sink");
        respawnClockOverlay.classList.add("respawn-sink");
    });

    setTimeout(() => {
        monster.style.display = "none";
        monster.style.opacity = "0";
        monster.classList.remove("respawn-sink");

        respawnAnimation.style.display = "none";
        respawnAnimation.classList.remove("respawn-sink");

        respawnClockOverlay.style.display = "none";
        respawnClockOverlay.classList.remove("respawn-sink");

        isRespawning = false;
        randomizeMonster();
        
        if (monsterType !== "monster3") resetIdleTimer();
    }, 1500);

    return true;
}

function playShockerEffect() {
    const lightningLayer = shockerAnimation ? shockerAnimation.querySelector(".shocker-lightning-layer") : null;
    if (!shockerAnimation || !lightningLayer || !monsterImage) return;

    monster1Audio.pause();
    monster1Audio.currentTime = 0;

    monsterImage.style.display = "block";
    monsterImage.style.transition = "none";
    monsterImage.style.opacity = "1";
    monsterImage.classList.remove("shocker-hit");

    void monsterImage.offsetWidth;
    monsterImage.classList.add("shocker-hit");

    shockerAnimation.style.display = "block";
    lightningLayer.innerHTML = "";

    const lightningTimer = setInterval(() => {
        const bolt = document.createElement("span");
        bolt.className = "shocker-bolt";
        bolt.textContent = "⚡";
        bolt.style.left = `${10 + Math.random() * 80}%`;
        bolt.style.top = `${10 + Math.random() * 75}%`;
        lightningLayer.appendChild(bolt);
        setTimeout(() => bolt.remove(), 450);
    }, 140);

    if (shockerSound) {
        shockerSound.pause();
        shockerSound.currentTime = 0;
        shockerSound.volume = 1;
        shockerSound.play().catch(() => {});
        fadeOutAudio(shockerSound, 2400);
    }

    setTimeout(() => {
        clearInterval(lightningTimer);
        shockerAnimation.style.display = "none";
        lightningLayer.innerHTML = "";
        monsterImage.classList.remove("shocker-hit");
        monsterImage.style.display = "none";
        monsterImage.style.opacity = "0";
        monsterImage.style.transition = "";
        monsterImage.style.transform = "";
    }, 2600);
}

function handleArrowClick(clickedArrowName) {
    if (doorTransitionPending || isDead || isRespawning || isGamePaused || currentLevel === 5) return;

    if (typeof checkLotusStepMovement === "function") checkLotusStepMovement();

    resetIdleTimer();
    achievementEvent("step");
    changeRandomBackground();

    if (clickedArrowName === monsterPosition) {
        achievementEvent("monster");

        if (activeMonsterType === "monster1") {
            achievementEvent("meetMonster", 1); // <--- ДОБАВЬ СЮДА
            const monsterDamage = 25;
            const shockerBlocked = equippedItems && equippedItems.shocker && Math.random() < 0.5;

            if (shockerBlocked) {
                playShockerEffect();
                achievementEvent("shockerUse");
            } else {
                HPnumbers = Math.max(0, HPnumbers - monsterDamage);
                updateAllBars();
                achievementEvent("damage");

                if (HPnumbers <= 0) {
                    if (tryRespawnFromMonster(monsterDamage, "monster1")) return;
                    triggerDeathSequence();
                    return;
                }

                monster1Audio.pause();
                monster1Audio.currentTime = 0;
                monster1Audio.volume = 1;

                monsterImage.classList.remove("shocker-hit");
                monsterImage.style.display = "block";
                monsterImage.style.transition = "none";
                monsterImage.style.opacity = "1";
                monsterImage.style.transform = "";

                monster1Audio.play().catch(() => {});

                setTimeout(() => {
                    monsterImage.style.transition = "opacity 2400ms ease";
                    monsterImage.style.opacity = "0";
                    fadeOutAudio(monster1Audio, 2400);
                }, 100);

                setTimeout(() => {
                    monsterImage.style.display = "none";
                    monsterImage.style.opacity = "0";
                    monsterImage.style.transition = "";
                }, 2600);
            }
        } else {
            achievementEvent("meetMonster", 2); // <--- ДОБАВЬ СЮДА
            isMonster2Active = true;

// ====== ТАМ, ГДЕ ПОЯВЛЯЕТСЯ МОНСТР 2 ======
isMonster2Active = true;
monster2Audio.currentTime = 0;
monster2Audio.play().catch(() => {});

monster2Image.style.display = "block";
monster2Image.style.transition = "none";
monster2Image.style.opacity = "1";

document.querySelector(".eyesCLOSE").classList.add("super-high");
document.getElementById("eyelidsOverlay").classList.add("super-high"); // <--- ДОБАВЬ СЮДА

            monster2Audio.currentTime = 0;
            monster2Audio.play().catch(() => {});

            monster2Image.style.display = "block";
            monster2Image.style.transition = "none";
            monster2Image.style.opacity = "1";

            monster2ActionTimeout = setTimeout(() => {
                if (isMonster2Active) {
                    if (!isEyesClosed && (!equippedItems || !equippedItems.glasses)) {
                        const monsterDamage = 50;
                        HPnumbers = Math.max(0, HPnumbers - monsterDamage);
                        updateAllBars();
                        achievementEvent("damage");

                        if (monster2DamageAudio) {
                            monster2DamageAudio.currentTime = 0;
                            monster2DamageAudio.play().catch(() => {});
                        }

                        if (HPnumbers <= 0) {
                            if (!tryRespawnFromMonster(monsterDamage, "monster2")) triggerDeathSequence();
                        }
                    } else {
                        achievementEvent("monster2Blocked");
                        if (equippedItems && equippedItems.glasses) achievementEvent("glassesBlock");
                    }
                }
            }, 1500);

            monster2Timer = setTimeout(() => hideMonster2(), 2000);
        }
    } else {
        WATERrandom();
        jumpscareOverlay.classList.remove("flash-green");
        jumpscareOverlay.style.transition = "background-color 0s";
        jumpscareOverlay.classList.add("flash-green");

        setTimeout(() => {
            jumpscareOverlay.style.transition = "background-color 0.5s ease";
            jumpscareOverlay.classList.remove("flash-green");
        }, 50);
    }

    randomizeMonster();
}

function hideMonster2() {
// ====== ТАМ, ГДЕ СКРЫВАЕТСЯ МОНСТР 2 (функция hideMonster2) ======
    isMonster2Active = false;
    clearTimeout(monster2ActionTimeout);
    clearTimeout(monster2Timer);

    // ДОБАВЬ ВОТ ЭТУ СТРОЧКУ СЮДА:
    document.querySelector(".eyesCLOSE").classList.remove("super-high");
    document.getElementById("eyelidsOverlay").classList.remove("super-high"); // <--- ДОБАВЬ СЮДА

    monster2Image.style.transition = "opacity 1s ease";
    monster2Image.style.opacity = "0";

    setTimeout(() => {
        if (!isMonster2Active) {
            monster2Image.style.display = "none";
            monster2Image.style.opacity = "0";
        }
    }, 1000);
}

let backgroundImages = ["img/level1.jpg", "img/level1Part2.jpg", "img/level1Part3.jpg"];
let currentBackground = "img/level1.jpg";

function preloadBackgrounds(images) {
    images.forEach(src => { let image = new Image(); image.src = src; });
}
preloadBackgrounds(backgroundImages);

function changeRandomBackground() {
    let availableImages = backgroundImages.filter(image => image !== currentBackground);
    let randomIndex = Math.floor(Math.random() * availableImages.length);
    currentBackground = availableImages[randomIndex];
    body.style.backgroundImage = `url('${currentBackground}')`;
}

arrowLeft.addEventListener('click', () => handleArrowClick('left'));
arrowUp.addEventListener('click', () => handleArrowClick('up'));
arrowRight.addEventListener('click', () => handleArrowClick('right'));

let water = document.querySelector(".WATER");
let energyDrink = document.querySelector(".ENERGYDRINK");
let bandage = document.querySelector(".BANDAGE");
let slots = document.querySelectorAll(".slot");
let respawnClock = document.querySelector(".imgTime");
let respawnClockGround = document.querySelector(".imgTimeClaim");
let isRespawning = false;

let doorSpawn = document.querySelector(".doorSpawn");
let doorImage = document.querySelector(".doorIMG");
let currentLevel = 1;
let doorTransitionPending = false; 
let transitionTargetLevel = null;

doorSpawn.style.display = "none";
water.style.display = "none";
energyDrink.style.display = "none";
bandage.style.display = "none";
respawnClockGround.style.display = "none";

function WATERrandom() {
    if (currentLevel === 5) return;
    if (water.style.display === "block" || energyDrink.style.display === "block" || bandage.style.display === "block" || doorSpawn.style.display === "block" || respawnClockGround.style.display === "block") return;

    let chance = Math.random() * 100;
    if (currentLevel === 1 && chance < 1) doorSpawn.style.display = "block";
    else if (currentLevel === 1 && chance < 2) respawnClockGround.style.display = "block";
    else if (chance < 21) water.style.display = "block";
    else if (chance < 41) energyDrink.style.display = "block";
    else if (chance < 66) bandage.style.display = "block";
}

water.onclick = () => {
    if (!addItemToInventory("img/water.png", "water")) return;
    achievementEvent("pickup", "water");
    water.style.display = "none";
    waterPickupAudio.currentTime = 0;
    waterPickupAudio.play();
};

energyDrink.onclick = () => {
    if (!addItemToInventory("img/energyDrink.png", "energyDrink")) return;
    achievementEvent("pickup", "energyDrink");
    energyDrink.style.display = "none";
    waterPickupAudio.currentTime = 0;
    waterPickupAudio.play();
};

bandage.onclick = () => {
    if (!addItemToInventory("img/bandage.png", "bandage")) return;
    achievementEvent("pickup", "bandage");
    bandage.style.display = "none";
};

respawnClock.onclick = () => {
    if (!addItemToInventory("img/timeRespawn.png", "respawnClock")) return;
    achievementEvent("pickup", "respawnClock");
    respawnClockGround.style.display = "none";
    respawnClockAudio.currentTime = 0;
    respawnClockAudio.play();
};

function addItemToInventory(imgSrc, itemType) {
    for (let i = 0; i < slots.length; i++) {
        if (slots[i].children.length === 0) {
            let itemElem = document.createElement("img");
            itemElem.src = imgSrc;
            itemElem.dataset.item = itemType;

            itemElem.addEventListener("click", event => {
                event.stopPropagation();
                if (itemType === "respawnClock") return;
                selectedItem = itemElem;
                useWindow.style.display = "block";
            });

            slots[i].appendChild(itemElem);
            return true;
        }
    }
    return false;
}

let useWindow = document.querySelector(".bruh");
let yesButton = document.querySelector(".buttonsYesNo1");
let noButton = document.querySelector(".buttonsYesNo2");
let selectedItem = null;

noButton.onclick = () => { useWindow.style.display = "none"; selectedItem = null; };

yesButton.onclick = () => {
    if (!selectedItem) return;
    let type = selectedItem.dataset.item;

    if (type === "water") {
        HUNGERnumbers = Math.min(100, HUNGERnumbers + 20);
        waterUseAudio.currentTime = 0;
        waterUseAudio.play();
    } else if (type === "energyDrink") {
        ENERGYnumbers = Math.min(100, ENERGYnumbers + 15);
        waterUseAudio.currentTime = 0;
        waterUseAudio.play();
    } else if (type === "bandage") {
        HPnumbers = Math.min(100, HPnumbers + 25);
        bandageUseAudio.currentTime = 0;
        bandageUseAudio.play();
    } else if (type === "lotus") {
        createLotusSavePoint();
        inventoryItems.lotus = false;
        saveShopData();
        updateShopCardsUI();
        selectedItem.remove();
        useWindow.style.display = "none";
        selectedItem = null;
        return;
    }

    achievementEvent("useItem", type);
    updateAllBars();
    selectedItem.remove();
    useWindow.style.display = "none";
    selectedItem = null;
};

const savesOpenBtn = document.getElementById("savesOpenBtn");
const lotusSavesModal = document.getElementById("lotusSavesModal");
const lotusSavesCloseBtn = document.getElementById("lotusSavesCloseBtn");
const lotusSavesList = document.getElementById("lotusSavesList");
const lotusGroundItem = document.getElementById("lotusGroundItem");
const lotusCutsceneOverlay = document.getElementById("lotusCutsceneOverlay");
const lotusCutsceneVideo = document.getElementById("lotusCutsceneVideo");
const lotusWhiteFlash = document.getElementById("lotusWhiteFlash");

try {
    const savedLotus = JSON.parse(localStorage.getItem("dreamCoreLotusSave"));
    if (savedLotus) {
        currentLotusSave = savedLotus;
        if (lotusGroundItem && currentBackground === savedLotus.background) {
            lotusGroundItem.classList.add("show-lotus");
        }
    }
} catch(e) {}

savesOpenBtn.addEventListener("click", () => {
    updateLotusSavesUI();
    lotusSavesModal.style.display = "flex";
});

lotusSavesCloseBtn.addEventListener("click", () => lotusSavesModal.style.display = "none");

function createLotusSavePoint() {
    let savedInventory = [];
    slots.forEach(slot => {
        const itemImg = slot.querySelector("img");
        if (itemImg) savedInventory.push({ src: itemImg.src, type: itemImg.dataset.item });
    });

    currentLotusSave = { level: currentLevel, background: currentBackground, inventory: savedInventory };
    try { localStorage.setItem("dreamCoreLotusSave", JSON.stringify(currentLotusSave)); } catch(e) {}

    if (lotusGroundItem) {
        lotusGroundItem.style.display = "block";
        lotusGroundItem.classList.add("show-lotus");
    }

    achievementEvent("lotusPlant");
    updateLotusSavesUI();
}

function updateLotusSavesUI() {
    if (!lotusSavesList) return;
    lotusSavesList.innerHTML = "";

    if (!currentLotusSave) {
        lotusSavesList.innerHTML = `<div class="lotus-save-empty">Нет активных сохранений. Посадите Лотус во время игры!</div>`;
        return;
    }

    const card = document.createElement("div");
    card.className = "lotus-save-card";
    card.innerHTML = `
        <div class="lotus-save-info">
            <h4>Сохранение (Лотус)</h4>
            <p>Уровень: ${currentLotusSave.level}</p>
        </div>
        <button class="lotus-load-btn" type="button">ПРОДОЛЖИТЬ</button>
    `;

    card.querySelector(".lotus-load-btn").addEventListener("click", () => {
        lotusSavesModal.style.display = "none";
        loadLotusSaveGame();
    });

    lotusSavesList.appendChild(card);
}

function loadLotusSaveGame() {
    if (!currentLotusSave) return;
    container.style.display = "none";
    if (inventory) inventory.style.display = "none";
    if (mapInterface) mapInterface.style.display = "none";
    if (useWindow) useWindow.style.display = "none";

    lotusCutsceneOverlay.classList.add("active");
    if (lotusCutsceneVideo) {
        lotusCutsceneVideo.currentTime = 0;
        lotusCutsceneVideo.play().catch(() => {});
        lotusCutsceneVideo.onended = () => finishLotusLoadSequence();
    } else {
        finishLotusLoadSequence();
    }
}

function finishLotusLoadSequence() {
    lotusWhiteFlash.classList.add("flash-active");
    currentLevel = currentLotusSave.level;
    currentBackground = currentLotusSave.background;

const levelImagesMap = {
        1: ["img/level1.jpg", "img/level1Part2.jpg", "img/level1Part3.jpg"],
        2: ["img/level2Part1.png", "img/level2Part2.jpg", "img/level2Part3.png"],
        3: ["img/level3Part1.jpg", "img/level3Part2.jpg", "img/level3Part3.jpg"],
        4: ["img/level4Part1.jpg", "img/level4Part2.jpg", "img/level4Part3.jpg"],
        5: [],
        6: ["img/level5Part1.jpg", "img/level5Part2.jpg", "img/level5Part3.jpg"],
        7: ["img/level7Part1.jpg", "img/level7Part2.jpg", "img/level7Part3.jpg"],
        8: ["img/level8Part1.jpg", "img/level8Part2.jpg", "img/level8Part3.jpg"],
        9: ["img/level9Part1.jpg", "img/level9Part2.jpg", "img/level9Part3.jpg"]
    };

    if (levelImagesMap[currentLevel] && levelImagesMap[currentLevel].length > 0) {
        backgroundImages = levelImagesMap[currentLevel];
        preloadBackgrounds(backgroundImages);
    }

    body.style.backgroundImage = `url('${currentBackground}')`;
    HPnumbers = 100; HUNGERnumbers = 100; ENERGYnumbers = 100;
    updateAllBars();

    slots.forEach(slot => slot.innerHTML = "");
    currentLotusSave.inventory.forEach((savedItem, index) => {
        if (slots[index]) {
            if (savedItem.type === "lotus") return;
            let itemElem = document.createElement("img");
            itemElem.src = savedItem.src;
            itemElem.dataset.item = savedItem.type;
            itemElem.addEventListener("click", event => {
                event.stopPropagation();
                if (savedItem.type === "respawnClock") return;
                selectedItem = itemElem;
                useWindow.style.display = "block";
            });
            slots[index].appendChild(itemElem);
        }
    });

    localStorage.removeItem("dreamCoreLotusSave");
    currentLotusSave = null;

    if (lotusGroundItem) {
        lotusGroundItem.style.display = "block";
        lotusGroundItem.classList.add("show-lotus");
    }

    let startButton = document.querySelector(".startButton");
    let lol = document.querySelector(".lol");
    if (startButton) startButton.style.display = "none";
    if (lol) lol.style.display = "none";

    const sleepingBtn = document.querySelector(".sleeping");
    if (sleepingBtn) sleepingBtn.style.display = "none";

    const savesBtn = document.getElementById("savesOpenBtn");
    const shopBtn = document.getElementById("shopOpenBtn");
    const achBtn = document.getElementById("achievementsOpen");
    if (savesBtn) savesBtn.style.display = "none";
    if (shopBtn) shopBtn.style.display = "none";
    if (achBtn) achBtn.style.display = "none";

    const adminBtn = document.getElementById("adminOpenBtn");
    if (adminBtn && achievementStats.adminUnlocked) {
        adminBtn.classList.add("show");
        adminBtn.style.display = "block";
    }

    if (rainAudio) { rainAudio.pause(); rainAudio.currentTime = 0; }
    achievementEvent("lotusLoad");

// ИСПРАВЛЕННЫЙ ВАРИАНТ:
[level1Music, level2Music, level3Music, level4Music, level6Music, level7Music, level8Music, level9Music].forEach(audio => {
    if (audio) { audio.pause(); audio.currentTime = 0; }
});

    const levelMusics = { 1: level1Music, 2: level2Music, 3: level3Music, 4: level4Music, 6: level5Music };
    if (levelMusics[currentLevel]) {
        levelMusics[currentLevel].volume = 1;
        levelMusics[currentLevel].play().catch(() => {});
    }

    if (currentLevel === 5) {
        startLevel5Chase();
    } else {
        if (typeof HUNGERtime === "function") HUNGERtime();
        if (typeof ENERGYtime === "function") ENERGYtime();
        if (typeof resetIdleTimer === "function") resetIdleTimer();
    }

    setTimeout(() => {
        lotusWhiteFlash.classList.remove("flash-active");
        lotusCutsceneOverlay.classList.remove("active");
        container.style.display = "block";
        isDead = false;
        isRespawning = false;
    }, 600);
}

function checkLotusStepMovement() {
    if (lotusGroundItem) lotusGroundItem.classList.remove("show-lotus");
}

let portalGunInterface = document.querySelector(".portalGunHotBar");
let portalGunButton = document.querySelector(".portalGUN .PORTALGUN");
let closeGunButton = document.querySelector(".closeGun");

portalGunButton.onclick = () => portalGunInterface.style.display = "block";
closeGunButton.onclick = () => {
    portalGunInterface.style.display = "none";
    // Если игрок закрыл пушку, а сам портал на экране не создан/не активен
    if (!portalImage || portalImage.style.display === "none" || portalImage.style.display === "") {
        achievementEvent("portalGunNoSpawn");
    }
};

doorImage.onclick = () => {

    if (currentLevel < 1 || currentLevel >= 10 || doorTransitionPending) return; // Исправили с 9 на 10
    if (currentLevel === 1) achievementEvent("door");

    doorTransitionPending = true;
    transitionTargetLevel = currentLevel + 1; // Теперь с 9 уровня дверь кинет на 10!

// --- ДОБАВЬ ВОТ ЭТИ ДВЕ СТРОЧКИ СЮДА ---
    document.querySelector(".eyesCLOSE").classList.add("transition-hidden");
    document.getElementById("eyelidsOverlay").classList.add("transition-hidden");
    // ----------------------------------------

    doorSpawn.style.display = "none";
    water.style.display = "none";
    energyDrink.style.display = "none";
    bandage.style.display = "none";
    respawnClockGround.style.display = "none";
    inventory.style.display = "none";
    mapInterface.style.display = "none";
    portalGunInterface.style.display = "none";
    useWindow.style.display = "none";

    document.querySelector(".lol").style.display = "block";
    overlay.classList.remove("flash-white", "fade-out");
    overlay.classList.add("active");
    whiteFlashBtn.classList.remove("show");

    setTimeout(() => {
        if (doorTransitionPending) whiteFlashBtn.classList.add("show");
    }, 3000);
};

function startLevel(level) {
    const levelSettings = {
        1: { music: level1Music, images: ["img/level1.jpg", "img/level1Part2.jpg", "img/level1Part3.jpg"] },
        2: { music: level2Music, images: ["img/level2Part1.png", "img/level2Part2.jpg", "img/level2Part3.png"] },
        3: { music: level3Music, images: ["img/level3Part1.jpg", "img/level3Part2.jpg", "img/level3Part3.jpg"] },
        4: { music: level4Music, images: ["img/level4Part1.jpg", "img/level4Part2.jpg", "img/level4Part3.jpg"] },
        5: { music: null, images: [] }, 
        6: { music: level5Music, images: ["img/level6Part1.jpg", "img/level6Part2.jpg", "img/level6Part3.jpg"] }, 
        7: { music: level7Music, images: ["img/level7Part1.jpg", "img/level7Part2.jpg", "img/level7Part3.jpg"] }, 
        8: { music: level8Music, images: ["img/level8Part1.jpg", "img/level8Part2.jpg", "img/level8Part3.jpg"] }, 
        9: { music: level9Music, images: ["img/level9Part1.jpg", "img/level9Part2.jpg", "img/level9Part3.jpg"] },
        // ДОБАВЛЯЕМ КАРТИНКИ И МУЗЫКУ ДЛЯ 10 УРОВНЯ:
        10: { music: bossMusic, images: ["img/boss_phase1.jpg", "img/boss_phase2.jpg"] }
    };

    const settings = levelSettings[level];
    if (!settings) return;
    currentLevel = level;

if (level === 2) achievementEvent("level2");
if (level === 3) achievementEvent("level3"); // IKEA 3008
if (level === 4) { achievementEvent("level4"); } // ностальгия / хаги-ваги
if (level === 5) achievementEvent("level5Start"); // "Беги-беги слонёнок"
if (level === 6) achievementEvent("level6"); // "Слендер мен"
if (level === 7) achievementEvent("level7"); // "Вайб нового года"
if (level === 8) achievementEvent("level8"); // "Ностальгия 2013"
if (level === 9) achievementEvent("level9"); // "Лиминал для детей"
if (level === 10) achievementEvent("level10"); // "Пора просыпаться"

    // Вырубаем всю музыку (добавили bossMusic в список выключения)
    [level1Music, level2Music, level3Music, level4Music, level6Music, level7Music, level8Music, level9Music, bossMusic].forEach(audio => {
        if (audio) { audio.pause(); audio.currentTime = 0; }
    });

    if (level === 5) {
        startLevel5Chase();
        return;
    }

    // ЕСЛИ ЭТО 10 УРОВЕНЬ — ЗАПУСКАЕМ БОСС-ФАЙТ!
    if (level === 10) {
        startLevel10();
        return;
    }

    if (settings.music) {
        settings.music.volume = 1;
        settings.music.play().catch(() => {});
    }

    backgroundImages = settings.images;
    preloadBackgrounds(backgroundImages);
    currentBackground = backgroundImages[0];
    body.style.backgroundImage = `url('${currentBackground}')`;

    container.style.display = "block";
    doorTransitionPending = false;
    overlay.classList.remove("active");
    whiteFlashBtn.classList.remove("show");

    setTimeout(() => {
        document.querySelector(".lol").style.display = "none";
        overlay.classList.remove("active", "flash-white", "fade-out");
    }, 1100);
}

// ==================== ЛОГИКА 5 УРОВНЯ (ВИДЕО ПОГОНИ И БАЛАНС) ====================
let balanceValue = 100;
let balanceInterval = null;
let qteSpawnTimer = null;
let level5Active = false;

function startLevel5Chase() {
    achievementEvent("level5Start"); // <--- ВСТАВЬ ЭТО СЮДА (Ачивка 47)
    level5Active = true;
    currentLevel = 5;
    // ... дальше твой старый код функции ...

    // Прячем всё игровое окружение, статы, стрелки и интерфейс
    container.style.display = "none";
    if (inventory) inventory.style.display = "none";
    if (mapInterface) mapInterface.style.display = "none";
    if (portalGunInterface) portalGunInterface.style.display = "none";
    if (useWindow) useWindow.style.display = "none";

    // Полное восстановление и заморозка статов
    HPnumbers = 100;
    HUNGERnumbers = 100;
    ENERGYnumbers = 100;
    updateAllBars();

    // Останавливаем всю музыку уровней
[level1Music, level2Music, level3Music, level4Music, level6Music, level7Music, level8Music, level9Music].forEach(audio => {
    if (audio) { audio.pause(); audio.currentTime = 0; }
});

    // Показываем экран 5 уровня с видео
    const chaseScreen = document.getElementById("level5ChaseScreen");
    const chaseVideo = document.getElementById("chaseVideoElement");
    if (!chaseScreen || !chaseVideo) return;

    chaseScreen.style.display = "block";
    balanceValue = 100;
    updateBalanceUI();

    chaseVideo.currentTime = 0;
    chaseVideo.play().catch(() => {});

    // Уменьшение баланса на 1 каждые 500 мс
    if (balanceInterval) clearInterval(balanceInterval);
    balanceInterval = setInterval(() => {
        if (!level5Active || isDead) return;
        balanceValue = Math.max(0, balanceValue - 1);
        updateBalanceUI();

        if (balanceValue <= 0) {
            // Проигрыш при потере баланса
            finishLevel5Chase(false);
        }
    }, 500);

    // Появление интерактивных кружочков каждые 3 секунды
    if (qteSpawnTimer) clearInterval(qteSpawnTimer);
    qteSpawnTimer = setInterval(() => {
        if (!level5Active || isDead) return;
        spawnQteCircle();
    }, 3700);

    // Когда видео заканчивается (3 мин 35 сек или конец файла)
    chaseVideo.onended = () => {
        if (level5Active) finishLevel5Chase(true);
    };
}

function updateBalanceUI() {
    const barFill = document.getElementById("balanceBarFill");
    const balanceText = document.getElementById("balanceText");
    if (!barFill || !balanceText) return;

    barFill.style.width = balanceValue + "%";
    balanceText.textContent = balanceValue + "%";

    // Плавное изменение цвета полосы (зеленый -> салатовый -> желтый -> оранжевый -> красный)
    if (balanceValue > 75) {
        barFill.style.backgroundColor = "#4CAF50"; // Зеленый
    } else if (balanceValue > 50) {
        barFill.style.backgroundColor = "#8BC34A"; // Салатовый
    } else if (balanceValue > 25) {
        barFill.style.backgroundColor = "#FFEB3B"; // Желтый
    } else if (balanceValue > 10) {
        barFill.style.backgroundColor = "#FF9800"; // Оранжевый
    } else {
        barFill.style.backgroundColor = "#F44336"; // Красный
    }
}

function spawnQteCircle() {
    const containerElem = document.getElementById("chaseQteContainer");
    if (!containerElem) return;

    const posX = 15 + Math.random() * 70;
    const posY = 25 + Math.random() * 60;

    const heart = document.createElement("div");
    heart.className = "pulse-heart-target";
    heart.textContent = "❤️";
    heart.style.left = posX + "%";
    heart.style.top = posY + "%";
    
    containerElem.appendChild(heart);

    let clicks = 0;
    const targetClicks = 10;
    let resolved = false;

    const handleHeartClick = (e) => {
        e.stopPropagation();
        if (resolved || !level5Active) return;
        clicks++;

        // Меняем масштаб с помощью CSS-переменной, чтобы работал transition
        let currentScale = 1 + (clicks * 0.1);
        heart.style.transform = `translate(-50%, -50%) scale(${currentScale})`;

        // Если накликал 10 раз — победа
        if (clicks >= targetClicks) {
            resolved = true;
            balanceValue = Math.min(100, balanceValue + 7); 
            updateBalanceUI();

            heart.classList.add("pop");
            setTimeout(() => heart.remove(), 200);
        }
    };

    heart.addEventListener("click", handleHeartClick);
    heart.addEventListener("mousedown", handleHeartClick);

    // Время на реакцию (2.5 секунды)
    setTimeout(() => {
        if (!resolved && heart.parentNode) {
            resolved = true;
            balanceValue = Math.max(0, balanceValue - 2); 
            updateBalanceUI();

            heart.style.opacity = "0";
            setTimeout(() => heart.remove(), 200);
        }
    }, 2500);
}

function finishLevel5Chase(success) {
    if (!level5Active) return;
    level5Active = false;
    clearInterval(balanceInterval);
    clearInterval(qteSpawnTimer);

    const chaseScreen = document.getElementById("level5ChaseScreen");
    const chaseVideo = document.getElementById("chaseVideoElement");
    
    // ===== ЖЕСТКОЕ УБИЙСТВО ВИДЕО И ЕГО ЗВУКА =====
    if (chaseVideo) {
        chaseVideo.pause();
        chaseVideo.currentTime = 0;
        chaseVideo.muted = true; // Принудительно глушим
        chaseVideo.removeAttribute("src"); // Удаляем источник
        chaseVideo.load(); // Очищаем буфер памяти плеера
    }
    if (chaseScreen) chaseScreen.style.display = "none";
    document.getElementById("chaseQteContainer").innerHTML = "";

    if (success) {
        achievementEvent("level5Complete"); // <--- ВСТАВЬ ЭТО СЮДА (Ачивка 48)
        doorTransitionPending = true;
        transitionTargetLevel = 6;

        document.querySelector(".lol").style.display = "block";
        overlay.classList.remove("flash-white", "fade-out");
        overlay.classList.add("active");
        whiteFlashBtn.classList.remove("show");

        setTimeout(() => {
            if (doorTransitionPending) whiteFlashBtn.classList.add("show");
        }, 3000);
    } else {
        triggerDeathSequence("fatigue");
    }
}

function beginLevelTransition(targetLevel) {
    if (doorTransitionPending) return;
    doorTransitionPending = true;
    transitionTargetLevel = targetLevel;

    doorSpawn.style.display = "none";
    water.style.display = "none";
    energyDrink.style.display = "none";
    bandage.style.display = "none";
    respawnClockGround.style.display = "none";
    inventory.style.display = "none";
    mapInterface.style.display = "none";
    portalGunInterface.style.display = "none";
    useWindow.style.display = "none";

    document.querySelector(".lol").style.display = "block";
    overlay.classList.remove("flash-white", "fade-out");
    overlay.classList.add("active");
    whiteFlashBtn.classList.remove("show");

    setTimeout(() => {
        if (doorTransitionPending) whiteFlashBtn.classList.add("show");
    }, 3000);
}

let isEyesClosed = false;
const eyelidsOverlay = document.getElementById("eyelidsOverlay");
const eyeContainer = document.querySelector(".eyesCLOSE");
const eyeImg = document.querySelector(".eyeIMG");

function eyeButtonClosser() {
    isEyesClosed = !isEyesClosed;
    if (isEyesClosed) {
        achievementEvent("eyeClose");
        eyelidsOverlay.classList.add("closed");
        eyelidsOverlay.style.pointerEvents = "auto";
        eyeImg.src = "img/eyeClose.png";
    } else {
        eyelidsOverlay.classList.remove("closed");
        eyelidsOverlay.style.pointerEvents = "none";
        eyeImg.src = "img/eyeOpen.png";
    }
}
document.querySelector(".eyesCLOSE").onclick = eyeButtonClosser;

const achievementsResetOpen = document.getElementById("achievementsResetOpen");
const resetConfirmModal = document.getElementById("resetConfirmModal");
const resetConfirmYes = document.getElementById("resetConfirmYes");
const resetConfirmNo = document.getElementById("resetConfirmNo");

achievementsResetOpen.addEventListener("click", () => resetConfirmModal.classList.add("open"));
resetConfirmNo.addEventListener("click", () => resetConfirmModal.classList.remove("open"));
resetConfirmYes.addEventListener("click", () => {
    unlockedAchievements = [];
    achievementStats = { ...achievementStatsDefaults };
    localStorage.removeItem("dreamCoreAchievements");
    resetConfirmModal.classList.remove("open");
    selectedAchievementId = null;
    renderAchievements();
});

const monster3Image = document.getElementById("monster3Image");
let idleTimer = null;
let idleDamageInterval = null;
let isMonster3Active = false;

function resetIdleTimer() {
    if (isMonster3Active) hideMonster3();
    clearTimeout(idleTimer);
    if (isDead || doorTransitionPending || isRespawning || isGamePaused || currentLevel === 5) return;

    let afkTime = (equippedItems && equippedItems.brokenTimer) ? 60000 : 10000;
    idleTimer = setTimeout(() => triggerMonster3(), afkTime);
}

function triggerMonster3() {
    if (isDead || isRespawning || doorTransitionPending || isGamePaused || currentLevel === 5) return;
    achievementEvent("meetMonster", 3); // <--- ДОБАВЬ СЮДА
    isMonster3Active = true;
    showMonster3Scare();

    idleDamageInterval = setInterval(() => {
        if (!isMonster3Active || isGamePaused || currentLevel === 5) return;
        showMonster3Scare();
    }, 1000);
}

function showMonster3Scare() {
    if (isDead || isRespawning || isGamePaused || currentLevel === 5) return;
    if (monster3Audio) { monster3Audio.currentTime = 0; monster3Audio.play(); }

    monster3Image.style.display = "block";
    monster3Image.style.transition = "none";
    monster3Image.style.opacity = "1";
    applyMonster3Damage();

    setTimeout(() => {
        if (isMonster3Active) {
            monster3Image.style.transition = "opacity 0.5s ease";
            monster3Image.style.opacity = "0";
        }
    }, 500);

    setTimeout(() => {
        if (isMonster3Active && monster3Image.style.opacity === "0") monster3Image.style.display = "none";
    }, 1000);
}

function applyMonster3Damage() {
    if (isDead || isGamePaused || currentLevel === 5) return;
    const damage = 10;
    HPnumbers = Math.max(0, HPnumbers - damage);
    updateAllBars();
    achievementEvent("damage");

    if (HPnumbers <= 0) {
        if (!tryRespawnFromMonster(damage, "monster3")) {
            hideMonster3();
            triggerDeathSequence();
        }
    }
}

function hideMonster3() {
    isMonster3Active = false;
    clearInterval(idleDamageInterval);
    monster3Image.style.transition = "opacity 0.5s ease";
    monster3Image.style.opacity = "0";
    setTimeout(() => {
        if (!isMonster3Active) monster3Image.style.display = "none";
    }, 500);
}

const adminOpenBtn = document.getElementById("adminOpenBtn");
const adminScreen = document.getElementById("adminScreen");
const adminCloseBtn = document.getElementById("adminCloseBtn");
const adminGodModeBtn = document.getElementById("adminGodModeBtn");
let adminGodMode = false;

adminOpenBtn.addEventListener("click", () => adminScreen.classList.add("open"));
adminCloseBtn.addEventListener("click", () => adminScreen.classList.remove("open"));

setInterval(() => {
    if (adminGodMode) {
        HPnumbers = 100; HUNGERnumbers = 100; ENERGYnumbers = 100;
        updateAllBars();
    }
}, 200);

document.querySelectorAll(".admin-btn[data-action]").forEach(btn => {
    btn.addEventListener("click", () => {
        const action = btn.dataset.action;
        if (action === "spawnWater") water.style.display = "block";
        else if (action === "spawnEnergy") energyDrink.style.display = "block";
        else if (action === "spawnBandage") bandage.style.display = "block";
        else if (action === "spawnClock") respawnClockGround.style.display = "block";
        else if (action === "spawnMonster1") {
            if (monster1Audio) { monster1Audio.volume = 1.0; monster1Audio.currentTime = 0; monster1Audio.play(); }
            monsterImage.style.display = "block";
            monsterImage.style.transition = "none";
            monsterImage.style.opacity = "1";
            setTimeout(() => {
                monsterImage.style.transition = "opacity 1s ease";
                monsterImage.style.opacity = "0";
                let fadeAudio = setInterval(() => {
                    if (monster1Audio.volume > 0.1) monster1Audio.volume = Math.max(0, monster1Audio.volume - 0.1);
                    else { monster1Audio.pause(); monster1Audio.volume = 1.0; clearInterval(fadeAudio); }
                }, 100);
            }, 1000);
            setTimeout(() => { monsterImage.style.display = "none"; monsterImage.style.opacity = "0"; }, 2000);
        } else if (action === "spawnMonster2") {
            if (monster2Audio) { monster2Audio.currentTime = 0; monster2Audio.play(); }
            monster2Image.style.display = "block";
            monster2Image.style.opacity = "1";
            setTimeout(() => {
                monster2Image.style.opacity = "0";
                setTimeout(() => monster2Image.style.display = "none", 1000);
            }, 1000);
        } else if (action === "spawnMonster3") triggerMonster3();
        else if (action === "spawnMonster4") startMonster4Attack();
        else if (action === "fullHeal") { HPnumbers = 100; HUNGERnumbers = 100; ENERGYnumbers = 100; updateAllBars(); }
    });
});

adminGodModeBtn.addEventListener("click", () => {
    adminGodMode = !adminGodMode;
    if (adminGodMode) {
        adminGodModeBtn.textContent = "Бессмертие: ВКЛ";
        adminGodModeBtn.classList.add("active");
        HPnumbers = 100; HUNGERnumbers = 100; ENERGYnumbers = 100;
        updateAllBars();
    } else {
        adminGodModeBtn.textContent = "Бессмертие: ВЫКЛ";
        adminGodModeBtn.classList.remove("active");
    }
});

let kmBalance = 0;
let inventoryItems = { shocker: false, glasses: false, brokenTimer: false, startClock: false, portalGun: false, antivirusPro: false, holyCross: false, lotus: false };

try {
    const savedShop = JSON.parse(localStorage.getItem("dreamCoreShop") || "{}");
    kmBalance = savedShop.kmBalance || 0;
    if (savedShop.items) inventoryItems = savedShop.items;
    if (savedShop.equipped) equippedItems = savedShop.equipped;
} catch(e) {}

function saveShopData() {
    try {
        localStorage.setItem("dreamCoreShop", JSON.stringify({ kmBalance: kmBalance, items: inventoryItems, equipped: equippedItems }));
    } catch(e){}
}

const kmCountElem = document.getElementById("kmCount");
const kmPopup = document.getElementById("kmPopup");
const shopKmBalance = document.getElementById("shopKmBalance");
const shopScreen = document.getElementById("shopScreen");
const shopOpenBtn = document.getElementById("shopOpenBtn");
const shopCloseBtn = document.getElementById("shopCloseBtn");

function updateKmDisplay() {
    kmCountElem.textContent = kmBalance;
    shopKmBalance.textContent = kmBalance;
    updateShopCardsUI();
}

shopOpenBtn.addEventListener("click", () => {
    shopOpenAudio.currentTime = 0;
    shopOpenAudio.play();
    updateKmDisplay();
    shopScreen.classList.add("open");
});

shopCloseBtn.addEventListener("click", () => shopScreen.classList.remove("open"));

function updateShopCardsUI() {
    document.querySelectorAll(".shop-card").forEach(card => {
        const itemKey = card.dataset.item;
        const buyBtn = card.querySelector(".buy-btn");

        if (itemKey === "portalGun" || itemKey === "lotus") {
            if (inventoryItems[itemKey]) { buyBtn.textContent = "КУПЛЕНО"; buyBtn.classList.add("bought"); }
            else { buyBtn.textContent = "КУПИТЬ"; buyBtn.classList.remove("bought"); }
        } else {
            if (!inventoryItems[itemKey]) { buyBtn.textContent = "КУПИТЬ"; buyBtn.classList.remove("bought", "equipped"); }
            else {
                if (equippedItems[itemKey]) { buyBtn.textContent = "ЭКИПИРОВАНО"; buyBtn.classList.add("equipped"); buyBtn.classList.remove("bought"); }
                else { buyBtn.textContent = "ЭКИПИРОВАТЬ"; buyBtn.classList.add("bought"); buyBtn.classList.remove("equipped"); }
            }
        }
    });

    const portalGunElem = document.querySelector(".portalGUN");
    if (portalGunElem) portalGunElem.style.display = inventoryItems.portalGun ? "block" : "none";
}

function addKmOnClick() {
    if (isGamePaused || currentLevel === 5) return;
    kmBalance++;
    updateKmDisplay();
    saveShopData();
    kmPopup.classList.remove("anim");
    void kmPopup.offsetWidth;
    kmPopup.classList.add("anim");
}

document.querySelectorAll(".walking").forEach(arrow => arrow.addEventListener("click", addKmOnClick));

const descriptions = {
    shocker: "Электрошокер (200 КМ): Дает 50% шанс полностью заблокировать урон от монстра 1.",
    glasses: "Солнечные очки (220 КМ): Автоматически защищают от урона монстра 2 без потери HP.",
    brokenTimer: "Сломанный таймер (250 КМ): Дает целую минуту вместо 10 сек на АФК от монстра 3.",
    startClock: "Часы респавна (500 КМ): Автоматически добавляет часы респавна в инвентарь при старте.",
    portalGun: "Портальная пушка (1000 КМ): Открывает постоянный доступ к портальной пушке навсегда!",
    antivirusPro: "Antivirus Pro+ (300 КМ): Монстр 4 начинает атаковать намного реже — каждые 2 минуты.",
    holyCross: "Крест (350 КМ): Монстры со стрелок (Монстр 1 и 2) появляются в 2 раза реже.",
    lotus: "Цветок Лотус (100 КМ): Одноразовый артефакт. Позволяет создать точку сохранения прямо во время игры!"
};

const shopDescModal = document.getElementById("shopDescModal");
const descTitle = document.getElementById("descTitle");
const descText = document.getElementById("descText");
const descCloseBtn = document.getElementById("descCloseBtn");

descCloseBtn.addEventListener("click", () => shopDescModal.style.display = "none");

document.querySelectorAll(".shop-card").forEach(card => {
    const itemKey = card.dataset.item;
    const buyBtn = card.querySelector(".buy-btn");

    card.addEventListener("click", e => {
        if (e.target === buyBtn) return;
        descTitle.textContent = card.querySelector("h3").textContent;
        descText.textContent = descriptions[itemKey];
        shopDescModal.style.display = "flex";
    });

    buyBtn.addEventListener("click", () => {
        const price = parseInt(card.dataset.price);
        if (!inventoryItems[itemKey]) {
            if (kmBalance >= price) {
                kmBalance -= price;
                inventoryItems[itemKey] = true;
                if (Object.values(inventoryItems).every(Boolean)) achievementEvent("allShopBought");
                if (itemKey !== "portalGun") {
                    const equippedCount = Object.values(equippedItems).filter(Boolean).length;
                    if (equippedCount < 2) equippedItems[itemKey] = true;
                }
                saveShopData();
                shopBuyAudio.currentTime = 0;
                shopBuyAudio.play();
                updateKmDisplay();
            } else {
                alert("Недостаточно КМ! Кликайте на стрелки в игре.");
            }
        } else {
            if (equippedItems[itemKey]) equippedItems[itemKey] = false;
            else {
                const currentEquippedCount = Object.values(equippedItems).filter(Boolean).length;
                if (currentEquippedCount >= 2) { alert("Можно экипировать одновременно только 2 предмета!"); return; }
                equippedItems[itemKey] = true;
            }
            saveShopData();
            if (equipItemAudio) { equipItemAudio.currentTime = 0; equipItemAudio.play().catch(() => {}); }
            updateShopCardsUI();
        }
    });
});

const shopResetOpenBtn = document.getElementById("shopResetOpenBtn");
const shopResetConfirmModal = document.getElementById("shopResetConfirmModal");
const shopResetYes = document.getElementById("shopResetYes");
const shopResetNo = document.getElementById("shopResetNo");

shopResetOpenBtn.addEventListener("click", () => shopResetConfirmModal.classList.add("open"));
shopResetNo.addEventListener("click", () => shopResetConfirmModal.classList.remove("open"));
shopResetYes.addEventListener("click", () => {
    inventoryItems = { shocker: false, glasses: false, brokenTimer: false, startClock: false, portalGun: false };
    equippedItems = { shocker: false, glasses: false, brokenTimer: false, startClock: false };
    localStorage.removeItem("dreamCoreShop");
    shopResetConfirmModal.classList.remove("open");
    updateKmDisplay();
});

setTimeout(updateKmDisplay, 100);

const phoneOpenBtn = document.getElementById("phoneOpenBtn");
const phoneCloseBtn = document.getElementById("phoneCloseBtn");
const phoneInterface = document.getElementById("phoneInterface");
const phoneDarkOverlay = document.getElementById("phoneDarkOverlay");

const phoneKmBalance = document.getElementById("phoneKmBalance");
const phoneMinerTimer = document.getElementById("phoneMinerTimer");
const phoneMinerProgress = document.getElementById("phoneMinerProgress");
const phoneMinerLevelText = document.getElementById("phoneMinerLevel");
const phoneUpgradeBtn = document.getElementById("phoneUpgradeBtn");
const phoneAntivirusBtn = document.getElementById("phoneAntivirusBtn");

const phoneMinerResetBtn = document.getElementById("phoneMinerResetBtn");
const phoneMinerResetModal = document.getElementById("phoneMinerResetModal");
const phoneMinerResetYes = document.getElementById("phoneMinerResetYes");
const phoneMinerResetNo = document.getElementById("phoneMinerResetNo");

const monster4WarningImage = document.getElementById("monster4WarningImage");
const monster4WarningAudio = document.getElementById("monster4WarningAudio");
const monster4ScreamAudio = document.getElementById("monster4ScreamAudio");
const monster4Jumpscare = document.getElementById("monster4Jumpscare");
const monster4RespawnClock = document.getElementById("monster4RespawnClock");

const phoneMinerTimes = [5, 4, 3, 2, 1];
const phoneMinerPrices = [50, 100, 200, 400];

let phoneMinerLevel = 0;
let phoneMinerSpent = 0;

try {
    const savedPhoneMiner = JSON.parse(localStorage.getItem("dreamCorePhoneMiner") || "{}");
    if (Number.isInteger(savedPhoneMiner.level) && savedPhoneMiner.level >= 0 && savedPhoneMiner.level <= 4) {
        phoneMinerLevel = savedPhoneMiner.level;
    }
    const oldSpent = phoneMinerPrices.slice(0, phoneMinerLevel).reduce((sum, price) => sum + price, 0);
    phoneMinerSpent = Number.isFinite(savedPhoneMiner.spent) ? Math.max(0, savedPhoneMiner.spent) : oldSpent;
} catch (error) {
    phoneMinerLevel = 0;
    phoneMinerSpent = 0;
}

let phoneMinerRemaining = phoneMinerTimes[phoneMinerLevel];
let phoneMinerLastTick = Date.now();

function savePhoneMiner() {
    localStorage.setItem("dreamCorePhoneMiner", JSON.stringify({ level: phoneMinerLevel, spent: phoneMinerSpent }));
}

function openPhone() {
    phoneInterface.classList.add("phoneVisible");
    phoneDarkOverlay.classList.add("phoneVisible");
    updatePhoneMinerUI();
}

function closePhone() {
    phoneInterface.classList.remove("phoneVisible");
    phoneDarkOverlay.classList.remove("phoneVisible");
}

phoneOpenBtn.addEventListener("click", openPhone);
phoneCloseBtn.addEventListener("click", closePhone);

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closePhone();
        phoneMinerResetModal.classList.remove("open");
    }
});

function updatePhoneMinerUI() {
    phoneKmBalance.textContent = kmBalance;
    phoneMinerTimer.textContent = phoneMinerRemaining;
    const currentTime = phoneMinerTimes[phoneMinerLevel];
    const elapsed = currentTime - phoneMinerRemaining;
    const progress = Math.max(0, Math.min(100, (elapsed / currentTime) * 100));

    phoneMinerProgress.style.width = progress + "%";
    phoneMinerLevelText.textContent = phoneMinerLevel + " / 4";

    if (phoneMinerLevel >= 4) {
        phoneUpgradeBtn.textContent = "МАКСИМАЛЬНЫЙ УРОВЕНЬ";
        phoneUpgradeBtn.disabled = true;
    } else {
        const price = phoneMinerPrices[phoneMinerLevel];
        phoneUpgradeBtn.textContent = "УЛУЧШИТЬ — " + price + " КМ";
        phoneUpgradeBtn.disabled = false;
    }
}

phoneUpgradeBtn.addEventListener("click", () => {
    if (phoneMinerLevel >= 4) return;
    const price = phoneMinerPrices[phoneMinerLevel];
    if (kmBalance < price) { alert("Недостаточно КМ! Нужно " + price + " КМ."); return; }

    kmBalance -= price;
    phoneMinerSpent += price;
    phoneMinerLevel++;
    phoneMinerRemaining = phoneMinerTimes[phoneMinerLevel];
    phoneMinerLastTick = Date.now();

    savePhoneMiner();
    if (shopBuyAudio) { shopBuyAudio.currentTime = 0; shopBuyAudio.play().catch(() => {}); }
    saveShopData();
    updateKmDisplay();
    updatePhoneMinerUI();
});

phoneMinerResetBtn.addEventListener("click", () => phoneMinerResetModal.classList.add("open"));
phoneMinerResetNo.addEventListener("click", () => phoneMinerResetModal.classList.remove("open"));
phoneMinerResetModal.addEventListener("click", event => {
    if (event.target === phoneMinerResetModal) phoneMinerResetModal.classList.remove("open");
});

phoneMinerResetYes.addEventListener("click", () => {
    kmBalance += phoneMinerSpent;
    phoneMinerSpent = 0;
    phoneMinerLevel = 0;
    phoneMinerRemaining = phoneMinerTimes[0];
    phoneMinerLastTick = Date.now();

    savePhoneMiner();
    saveShopData();
    updateKmDisplay();
    updatePhoneMinerUI();
    phoneMinerResetModal.classList.remove("open");
});

let monster4WarningActive = false;
let monster4ScreamActive = false;
let monster4WarningTimeout = null;
let monster4ScreamTimeout = null;
let monster4ElapsedSeconds = 0;

function playMonster4WarningSound() {
    if (!monster4WarningAudio) return;
    monster4WarningAudio.currentTime = 0;
    monster4WarningAudio.play().catch(() => {});
}

function stopMonster4WarningSound() {
    if (!monster4WarningAudio) return;
    monster4WarningAudio.pause();
    monster4WarningAudio.currentTime = 0;
}

function startMonster4Attack() {
    if (isGamePaused || currentLevel === 5) return;
    achievementEvent("meetMonster", 4); // <--- ДОБАВЬ СЮДА
    if (monster4WarningActive || monster4ScreamActive || isDead || !container || getComputedStyle(container).display === "none") return;

    monster4ElapsedSeconds = 0;
    monster4WarningActive = true;
    monster4WarningImage.classList.add("active");
    phoneAntivirusBtn.classList.add("warning-active");
    playMonster4WarningSound();

    monster4WarningTimeout = setTimeout(() => {
        if (!monster4WarningActive) return;
        triggerMonster4Jumpscare();
    }, 5000);
}

function cancelMonster4Attack() {
    if (!monster4WarningActive) return;
    monster4WarningActive = false;
    clearTimeout(monster4WarningTimeout);
    monster4WarningTimeout = null;

    monster4WarningImage.classList.remove("active");
    phoneAntivirusBtn.classList.remove("warning-active");
    stopMonster4WarningSound();

    if (shopOpenAudio) { shopOpenAudio.currentTime = 0; shopOpenAudio.play().catch(() => {}); }
    monster4ElapsedSeconds = 0;
}

function triggerMonster4Jumpscare() {
    if (!monster4WarningActive) return;
    monster4WarningActive = false;
    clearTimeout(monster4WarningTimeout);
    monster4WarningTimeout = null;

    monster4WarningImage.classList.remove("active");
    phoneAntivirusBtn.classList.remove("warning-active");
    stopMonster4WarningSound();
    closePhone();

    const damage = 80;
    
    // Считаем, сколько ХП останется после удара
    const hpAfterDamage = HPnumbers - damage;
    
    // ЧАСЫ НУЖНЫ ТОЛЬКО ТОГДА, КОГДА УРОН УБИВАЕТ ИГРОКА (HP после удара <= 0)
    let needsClockToSurvive = (hpAfterDamage <= 0);

    let clockItem = null;
    let foundSlotIndex = -1;

    // Если смерть неизбежна — ищем часы в инвентаре
    if (needsClockToSurvive && !isDead && !isRespawning) {
        for (let i = 0; i < slots.length; i++) {
            clockItem = slots[i].querySelector('img[data-item="respawnClock"]');
            if (clockItem) {
                foundSlotIndex = i;
                break;
            }
        }
    }

    const hasRespawnClock = Boolean(clockItem);

    // Если часы реально нужны для выживания и они есть — забираем их
    if (hasRespawnClock) {
        clockItem.remove();
        achievementEvent("respawnUsed");
    }

    monster4ScreamActive = true;

    monster4Jumpscare.classList.remove("active", "fading", "clock-protection-mode");
    void monster4Jumpscare.offsetWidth;
    monster4Jumpscare.classList.add("active");

    if (monster4ScreamAudio) {
        monster4ScreamAudio.pause();
        monster4ScreamAudio.currentTime = 0;
        monster4ScreamAudio.volume = 1;
        monster4ScreamAudio.play().catch(() => {});
    }

    const clockTransitionTimeout = setTimeout(() => {
        if (!monster4ScreamActive || !hasRespawnClock) return;
        
        HPnumbers = damage; // Возвращаем здоровье при спасении часами
        updateAllBars();
        isRespawning = true;
        monster4Jumpscare.classList.add("clock-protection-mode");

        if (monster4ScreamAudio) { monster4ScreamAudio.pause(); monster4ScreamAudio.currentTime = 0; }
        if (respawnClockAudio) {
            respawnClockAudio.pause();
            respawnClockAudio.currentTime = 0;
            respawnClockAudio.volume = 1;
            respawnClockAudio.play().catch(() => {});
        }
    }, 2000);

    monster4ScreamTimeout = setTimeout(() => {
        clearTimeout(clockTransitionTimeout);
        monster4Jumpscare.classList.add("fading");

        if (hasRespawnClock && isRespawning) fadeOutAudio(respawnClockAudio, 500);
        else fadeOutAudio(monster4ScreamAudio, 500);

        setTimeout(() => {
            monster4Jumpscare.classList.remove("active", "fading", "clock-protection-mode");
            monster4ScreamActive = false;
            monster4ElapsedSeconds = 0;
            monster4ScreamTimeout = null;

            if (hasRespawnClock && isRespawning) isRespawning = false;
            
            // Если часы спасли игрока — выходим, урон уже заблокирован
            if (hasRespawnClock) return;

            // Обычный урон (если часов не было или они не требовались)
            if (!isDead) {
                HPnumbers = Math.max(0, HPnumbers - damage);
                updateAllBars();
                achievementEvent("damage");
                if (HPnumbers <= 0) {
                    if (!tryRespawnFromMonster(damage, "monster4")) triggerDeathSequence();
                }
            }
        }, 500);
    }, 5000);
}

phoneAntivirusBtn.addEventListener("click", () => {
    if (monster4WarningActive) cancelMonster4Attack();
});

setInterval(() => {
    const now = Date.now();
    const elapsedSeconds = Math.floor((now - phoneMinerLastTick) / 1000);
    if (elapsedSeconds <= 0) return;

    phoneMinerLastTick += elapsedSeconds * 1000;
    phoneMinerRemaining -= elapsedSeconds;

    if (phoneMinerRemaining <= 0) {
        const cycleDuration = phoneMinerTimes[phoneMinerLevel];
        const completedCycles = 1 + Math.floor(Math.abs(phoneMinerRemaining) / cycleDuration);
        kmBalance += completedCycles;
        phoneMinerRemaining += completedCycles * cycleDuration;
        saveShopData();
        updateKmDisplay();
    }
    updatePhoneMinerUI();
}, 200);

setInterval(() => {
    if (isGamePaused || currentLevel === 5 || currentLevel === 10) return; // <--- ДОБАВИЛИ currentLevel === 10
    if (!container || getComputedStyle(container).display === "none" || isDead || monster4WarningActive || monster4ScreamActive) return;
    monster4ElapsedSeconds++;
    const requiredTime = (equippedItems && equippedItems.antivirusPro) ? 120 : 30;
    if (monster4ElapsedSeconds >= requiredTime) startMonster4Attack();
}, 1000);

updatePhoneMinerUI();

// ==================== МОНСТР 5 — ВЗЛОМ КОДА ====================
(() => {
    const monster5Arrows = document.querySelectorAll(".right.walking, .up.walking, .left.walking");
    const monster5Bars = [document.querySelector(".HP"), document.querySelector(".HUNGER"), document.querySelector(".ENERGY")].filter(Boolean);
    const monster5HackButton = document.getElementById("phoneHackCodeBtn");
    const monster5HackStatus = document.getElementById("hackStatus");

    let monster5ArrowCount = 0;
    let monster5NextTarget = Math.floor(Math.random() * 61) + 30;
    let monster5IsAttacking = false;
    let monster5IsHacking = false;

    const monster5Overlay = document.createElement("div");
    monster5Overlay.id = "monster5HackOverlay";
    monster5Overlay.style.zIndex = "9999"; 
    monster5Overlay.innerHTML = `
        <div class="monster5-hack-message">
            <h2>SYSTEM OVERRIDE</h2>
            <p>ИСПРАВЛЕНИЕ СИСТЕМНЫХ ОШИБОК...</p>
            <div class="monster5-hack-progress">
                <div class="monster5-hack-progress-fill" id="monster5HackProgressFill"></div>
            </div>
            <p id="monster5HackPercent">0%</p>
        </div>
    `;
    document.body.appendChild(monster5Overlay);

    const monster5ProgressFill = document.getElementById("monster5HackProgressFill");
    const monster5Percent = document.getElementById("monster5HackPercent");
    const monster5Words = ["true", "false", "system", "broken", "error", "404", "null", "undefined", "ACCESS DENIED", "REBOOT", "GLITCH", "010101", "CORRUPTED", "FIXING SYSTEM"];

    function createMonster5CodeRain() {
        monster5Overlay.querySelectorAll(".monster5-code-column").forEach(column => column.remove());
        const characters = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&*<>/{}[]";

        for (let i = 0; i < 35; i++) {
            const column = document.createElement("div");
            column.className = "monster5-code-column";
            let text = "";
            for (let j = 0; j < 24; j++) {
                if (Math.random() < 0.2) text += monster5Words[Math.floor(Math.random() * monster5Words.length)];
                else text += characters[Math.floor(Math.random() * characters.length)];
                text += "\n";
            }
            column.textContent = text;
            column.style.left = (Math.random() * 100) + "%";
            column.style.animationDuration = (2 + Math.random() * 3) + "s";
            column.style.animationDelay = (-Math.random() * 4) + "s";
            column.style.opacity = (0.35 + Math.random() * 0.65).toString();
            monster5Overlay.appendChild(column);
        }
    }

    function startMonster5Attack() {
        if (monster5IsAttacking || monster5IsHacking || currentLevel === 5 || currentLevel === 10) return;
        monster5IsAttacking = true;

achievementEvent("meetMonster", 5);

        monster5Bars.forEach(bar => bar.classList.add("monster5-glitch"));
        if (monster5HackStatus) monster5HackStatus.textContent = "SYSTEM ERROR: MONSTER_5 DETECTED";
    }

    function stopMonster5Attack() {
        monster5IsAttacking = false;
        monster5IsHacking = false;
        monster5Bars.forEach(bar => bar.classList.remove("monster5-glitch"));
        monster5ArrowCount = 0;
        monster5NextTarget = Math.floor(Math.random() * 61) + 30;
        if (monster5HackStatus) monster5HackStatus.textContent = "SYSTEM STATUS: STANDBY";
    }

    monster5Arrows.forEach(arrow => {
        arrow.addEventListener("click", () => {
            if (isGamePaused || currentLevel === 5 || currentLevel === 10) return;
            if (monster5IsAttacking || monster5IsHacking) return;
            monster5ArrowCount++;
            if (monster5ArrowCount >= monster5NextTarget) startMonster5Attack();
        });
    });

    if (monster5HackButton) {
        monster5HackButton.addEventListener("click", () => {
            if (monster5IsHacking || !monster5IsAttacking) return;
            monster5IsHacking = true;
            monster5HackButton.disabled = true;
            if (monster5HackStatus) monster5HackStatus.textContent = "SYSTEM STATUS: HACKING...";
            
            // Включаем оверлей и запускаем красивый дождь из кода
            monster5Overlay.classList.add("active");
            createMonster5CodeRain();

            const hackStartTime = Date.now();
            const hackDuration = 3000;

            const monster5HackInterval = setInterval(() => {
                const elapsed = Date.now() - hackStartTime;
                const progress = Math.min(100, Math.floor((elapsed / hackDuration) * 100));

                if (monster5ProgressFill) monster5ProgressFill.style.width = progress + "%";
                if (monster5Percent) monster5Percent.textContent = progress + "%";

                if (progress >= 100) {
                    clearInterval(monster5HackInterval);
                    achievementEvent("monster5Hack");
                    monster5Overlay.classList.remove("active");
                    monster5Overlay.querySelectorAll(".monster5-code-column").forEach(column => column.remove());
                    monster5HackButton.disabled = false;
                    stopMonster5Attack();
                }
            }, 30);
        });
    }
})();

const phoneAppLibrary = document.getElementById("phoneAppLibrary");
const phoneMinerApp = document.getElementById("phoneMinerApp");
const phoneCodeHackApp = document.getElementById("phoneCodeHackApp");

const openMinerAppBtn = document.getElementById("openMinerApp");
const openCodeHackAppBtn = document.getElementById("openCodeHackApp");

const phoneBackFromMinerBtn = document.getElementById("phoneBackFromMiner");
const phoneBackFromHackBtn = document.getElementById("phoneBackFromHack");

function showPhoneApp(appName) {
    if (!phoneAppLibrary || !phoneMinerApp || !phoneCodeHackApp) return;
    phoneAppLibrary.style.display = "none";
    phoneMinerApp.style.display = "none";
    phoneCodeHackApp.style.display = "none";

    if (appName === "library") phoneAppLibrary.style.display = "block";
    else if (appName === "miner") {
        phoneMinerApp.style.display = "block";
        if (typeof updatePhoneMinerUI === "function") updatePhoneMinerUI();
    } else if (appName === "hack") phoneCodeHackApp.style.display = "block";
}

const phoneOpenLibraryBtn = document.getElementById("phoneOpenBtn");
if (phoneOpenLibraryBtn) phoneOpenLibraryBtn.addEventListener("click", () => showPhoneApp("library"));
if (openMinerAppBtn) openMinerAppBtn.addEventListener("click", () => showPhoneApp("miner"));
if (openCodeHackAppBtn) openCodeHackAppBtn.addEventListener("click", () => showPhoneApp("hack"));
if (phoneBackFromMinerBtn) phoneBackFromMinerBtn.addEventListener("click", () => showPhoneApp("library"));
if (phoneBackFromHackBtn) phoneBackFromHackBtn.addEventListener("click", () => showPhoneApp("library"));

// ==================== СЕКРЕТНЫЙ ПАРОЛЬ (ADMIN) ====================
let enteredPassword = "";
const correctPassword = "9723";
const adminPassModal = document.getElementById("adminPasswordModal");
const passwordDisplay = document.getElementById("passwordDisplay");
const secretMenuBtn = document.getElementById("secretMenuBtn");
const closePassModal = document.getElementById("closePassModal");
const hideAdminPanelBtn = document.getElementById("hideAdminPanelBtn");
const adminOpenBtnElem = document.getElementById("adminOpenBtn");

if (secretMenuBtn) {
    secretMenuBtn.addEventListener("click", () => {
        enteredPassword = "";
        passwordDisplay.textContent = "_ _ _ _";
        adminPassModal.style.display = "flex";
        if (achievementStats.adminUnlocked) hideAdminPanelBtn.style.display = "inline-block";
        else hideAdminPanelBtn.style.display = "none";
    });
}

if (closePassModal) {
    closePassModal.addEventListener("click", () => adminPassModal.style.display = "none");
}

document.querySelectorAll(".pass-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        if (enteredPassword.length < 4) {
            enteredPassword += btn.dataset.num;
            passwordDisplay.textContent = enteredPassword.split("").join(" ");

            if (enteredPassword.length === 4) {
                if (enteredPassword === correctPassword) {
                    achievementEvent("adminUnlock");
                    adminPassModal.style.display = "none";
                    
                    if (adminOpenBtnElem) {
                        adminOpenBtnElem.classList.add("show");
                        adminOpenBtnElem.style.display = "block";
                    }
                    
                    hideAdminPanelBtn.style.display = "inline-block";
                    alert("Доступ разрешен. Админ-панель активирована!");
                } else {
                    setTimeout(() => {
                        enteredPassword = "";
                        passwordDisplay.textContent = "_ _ _ _";
                    }, 500);
                }
            }
        }
    });
});

if (hideAdminPanelBtn) {
    hideAdminPanelBtn.addEventListener("click", () => {
        if (adminOpenBtnElem) {
            adminOpenBtnElem.classList.remove("show");
            adminOpenBtnElem.style.display = "none";
        }
        achievementStats.adminUnlocked = false;
        saveAchievements();
        adminPassModal.style.display = "none";
        hideAdminPanelBtn.style.display = "none";
    });
}

// ====================== ПОЛНЫЙ И ИСПРАВЛЕННЫЙ КОД БОСС-ФАЙТА (10 УРОВЕНЬ) ======================
let bossFight = {
    active: false,
    hp: 100,
    maxHp: 100,
    phase: 1,
    attackCount: 0,
    isVulnerable: false,
    eyesClosed: false,
    trackTimer: null,
    attackTimeout: null,
    damageInterval: null,
    activeMinis: 0,
    isAttackActive: false,
    isTransitioning: false
};

const loudAlarmAudio = document.getElementById("loudAlarmAudio");
const miniAlarmAudio = document.getElementById("miniAlarmAudio");
const explosionAudio = document.getElementById("explosionAudio");

function startLevel10() {
    currentLevel = 10;

    if (hungerInterval) { clearInterval(hungerInterval); hungerInterval = null; }
    if (energyInterval) { clearInterval(energyInterval); energyInterval = null; }
    if (idleTimer) clearTimeout(idleTimer);
    if (idleDamageInterval) clearInterval(idleDamageInterval);
    if (monster2Timer) clearTimeout(monster2Timer);
    if (monster2ActionTimeout) clearTimeout(monster2ActionTimeout);
    
    HPnumbers = 100;
    HUNGERnumbers = 100;
    ENERGYnumbers = 100;
    updateAllBars();

    bossFight.active = true;
    bossFight.hp = 100;
    bossFight.phase = 1;
    bossFight.attackCount = 0;
    bossFight.isVulnerable = false;
    bossFight.isTransitioning = false;

    document.querySelectorAll('.portalGUN, .portalGunHotBar, [class*="portalGun"], [class*="portal"]').forEach(el => {
        el.style.display = "none";
        el.style.visibility = "hidden";
        el.style.opacity = "0";
        el.remove();
    });

    isMonster3Active = false;
    monster4WarningActive = false;
    monster4ScreamActive = false;
    clearTimeout(idleTimer);
    clearInterval(idleDamageInterval);
    if (monster3Image) monster3Image.style.display = "none";
    if (monster4WarningImage) monster4WarningImage.classList.remove("active");

    backgroundImages = ["img/boss_phase1.jpg", "img/boss_phase2.jpg"];
    currentBackground = "img/boss_phase1.jpg";
    body.style.backgroundImage = `url('${currentBackground}')`;

    container.style.display = "block";
    if (inventory) inventory.style.display = "none";
    if (useWindow) useWindow.style.display = "none";
    if (shopScreen) shopScreen.classList.remove("open");
    if (phoneInterface) phoneInterface.classList.remove("phoneVisible");

    const elementsToHide = document.querySelectorAll(`
        .navigation-arrows, .navigation, .left, .up, .right, 
        .hands, .KM-counter-container, 
        .portalGUN, .portalGunHotBar, .portal, 
        .MAP, .map, .MAP2, 
        .HUNGER, .ENERGY
    `);
    elementsToHide.forEach(el => {
        if (el) el.style.display = "none";
    });

    const portalGunBarElem = document.querySelector(".portalGunHotBar");
    if (portalGunBarElem) portalGunBarElem.style.display = "none";
    const portalGunElem = document.querySelector(".portalGUN");
    if (portalGunElem) portalGunElem.style.display = "none";

    const hpContainer = document.querySelector(".HP");
    if (hpContainer) {
        hpContainer.style.display = "flex";
        hpContainer.style.zIndex = "100";
    }

    HPnumbers = 100;
    updateAllBars();

    const bossContainer = document.getElementById("bossFightContainer");
    const introScreen = document.getElementById("bossIntroScreen");
    const bossSprite = document.getElementById("bossSprite");
    const bossHpBar = document.getElementById("bossHpBarContainer");

    if (bossContainer) {
        bossContainer.style.display = "block";
        bossContainer.style.zIndex = "2";
    }
    if (introScreen) {
        introScreen.style.display = "block";
        introScreen.style.backgroundColor = "black";
        introScreen.style.opacity = "1";
        introScreen.style.zIndex = "999";
    }

    if (bossSprite) {
        bossSprite.style.display = "none";
        bossSprite.style.position = "absolute";
        bossSprite.style.left = "50%";
        bossSprite.style.top = "52%";
        bossSprite.style.transform = "translate(-50%, -50%) scale(1.35)";
        bossSprite.style.zIndex = "2";
    }
    if (bossHpBar) {
        bossHpBar.style.display = "none";
        bossHpBar.style.zIndex = "3";
    }

    setTimeout(() => {
        if (!introScreen) return;
        introScreen.style.transition = "opacity 2s ease";
        introScreen.style.backgroundColor = "transparent";
        introScreen.style.opacity = "0";
        if (bossSprite) bossSprite.style.display = "block";

        if (bossMusic) { 
            bossMusic.currentTime = 0; 
            bossMusic.volume = 1;
            bossMusic.play().catch(e => console.log("Ошибка воспроизведения музыки босса:", e)); 
        }
    }, 1000);

    setTimeout(() => {
        if (!introScreen) return;
        introScreen.style.transition = "none";
        introScreen.style.backgroundColor = "white";
        introScreen.style.opacity = "1";
        setTimeout(() => {
            introScreen.style.transition = "opacity 2s ease";
            introScreen.style.opacity = "0";
        }, 2000);
    }, 23000);

    setTimeout(() => {
        if (!bossFight.active) return;
        if (bossHpBar) bossHpBar.style.display = "block";
        
        startBossTrackTimer(); 
        startBossLevitationAnimation(); 

        bossFight.attackTimeout = setTimeout(triggerRandomBossAttack, 5000);
    }, 24500);
}

// Левитация (на 2 фазе в 2 раза быстрее: множитель скорости 0.06 вместо 0.03)
function startBossLevitationAnimation() {
    const bossSprite = document.getElementById("bossSprite");
    if (!bossSprite) return;
    let angle = 0;

    function levitate() {
        if (!bossFight.active || bossFight.isTransitioning) {
            requestAnimationFrame(levitate);
            return;
        }
        
        // На 2 фазе скорость левитации x2
        let speedMultiplier = (bossFight.phase === 2) ? 0.06 : 0.03;
        angle += speedMultiplier;
        
        let xOffset = Math.sin(angle * 2) * 60; 
        let yOffset = Math.sin(angle) * 20;     

        bossSprite.style.left = `calc(50% + ${xOffset}px)`;
        bossSprite.style.top = `calc(52% + ${yOffset}px)`;
        bossSprite.style.transform = `translate(-50%, -50%) scale(1.35)`;

        requestAnimationFrame(levitate);
    }
    levitate();
}

function startBossTrackTimer() {
    bossFight.trackTimer = setTimeout(() => {
        if (bossFight.active && bossFight.hp > 0) {
            triggerDeathSequence("fatigue"); 
        }
    }, 470000);
}

function triggerRandomBossAttack() {
    if (!bossFight.active || bossFight.isVulnerable || bossFight.isTransitioning) return;

    clearTimeout(bossFight.attackTimeout);
    clearInterval(bossFight.damageInterval);
    bossFight.isAttackActive = false;

    const bossSprite = document.getElementById("bossSprite");
    if (bossSprite) bossSprite.style.animation = "none";
    if (loudAlarmAudio) { loudAlarmAudio.pause(); loudAlarmAudio.currentTime = 0; }

    let maxAttacksBeforeVuln = (bossFight.phase === 1) ? 3 : 5;

    if (bossFight.attackCount >= maxAttacksBeforeVuln) {
        openBossVulnerableWindow();
        return;
    }

    let attackChoice = Math.floor(Math.random() * 3) + 1; 
    if (attackChoice === 1) executeAttack1();
    else if (attackChoice === 2) executeAttack2();
    else if (attackChoice === 3) executeAttack3();
}

// ==================== АТАКА 1: Громкий будильник (Тихий фон при закрытых глазах) ====================
function executeAttack1() {
    if (!bossFight.active || bossFight.isTransitioning) return;
    const bossSprite = document.getElementById("bossSprite");

    if (bossSprite) bossSprite.style.animation = "bossShake 0.1s infinite alternate";
    if (loudAlarmAudio) { 
        loudAlarmAudio.currentTime = 0; 
        loudAlarmAudio.volume = 1; 
        loudAlarmAudio.play().catch(() => {}); 
    }

    let attackDamage = (bossFight.phase === 2) ? 2 : 1; // Фаза 2 наносит 2 урона

    bossFight.damageInterval = setInterval(() => {
        if (!bossFight.active || bossFight.isTransitioning) return;

        if (isEyesClosed) {
            if (loudAlarmAudio) loudAlarmAudio.volume = 0.15; // Тихий фоновый звук
            return; // Урона нет!
        }

        if (loudAlarmAudio) loudAlarmAudio.volume = 1;
        HPnumbers = Math.max(0, HPnumbers - attackDamage);
        updateAllBars();
        if (HPnumbers <= 0) triggerDeathSequence();

    }, 200);

    setTimeout(() => {
        if (!bossFight.active) return;
        clearInterval(bossFight.damageInterval);
        
        if (bossSprite) bossSprite.style.animation = "none";
        if (loudAlarmAudio) { loudAlarmAudio.pause(); loudAlarmAudio.currentTime = 0; }

        onAttackFinished();
    }, 5000);
}

// ==================== АТАКА 2: Маленькие часы (Медленные, 1 клик, застывающий взрыв) ====================
function executeAttack2() {
    if (!bossFight.active || bossFight.isTransitioning) return;
    
    let container = document.getElementById("bossMiniAlarmsContainer");
    if (!container) {
        container = document.createElement("div");
        container.id = "bossMiniAlarmsContainer";
        container.style.position = "fixed";
        container.style.top = "0";
        container.style.left = "0";
        container.style.width = "100vw";
        container.style.height = "100vh";
        container.style.pointerEvents = "none";
        container.style.zIndex = "999";
        document.body.appendChild(container);
    }

    let totalAlarms = (bossFight.phase === 2) ? 7 : 4; 
    let spawned = 0;

    let miniSpawnTimer = setInterval(() => {
        if (spawned >= totalAlarms || !bossFight.active || bossFight.isTransitioning) {
            clearInterval(miniSpawnTimer);
            return;
        }
        spawned++;
        bossFight.activeMinis++;

        let mini = document.createElement("img");
        mini.src = "img/mini_alarm.png";
        mini.style.position = "absolute";
        mini.style.width = "90px";  
        mini.style.height = "90px"; 
        
        let posX = 20 + Math.random() * 60;
        let posY = 20 + Math.random() * 60;
        // Уменьшили скорость в 2 раза (было 1.2, стало 0.6) для комфортного клика
        let vx = (Math.random() - 0.5) * 0.6; 
        let vy = (Math.random() - 0.5) * 0.6; 

        mini.style.left = posX + "%";
        mini.style.top = posY + "%";
        mini.style.cursor = "pointer";
        mini.style.pointerEvents = "auto";
        mini.style.zIndex = "1000";
        mini.style.animation = "bossShake 0.15s infinite alternate";

        let isDestroyed = false;

        // Движение и рикошет
        let moveInterval = setInterval(() => {
            if (!mini.parentNode || !bossFight.active || isDestroyed) {
                clearInterval(moveInterval);
                return;
            }
            posX += vx;
            posY += vy;

            if (posX <= 5 || posX >= 85) vx = -vx;
            if (posY <= 10 || posY >= 80) vy = -vy;

            mini.style.left = posX + "%";
            mini.style.top = posY + "%";
        }, 30);

        let miniAudio = null;
        if (miniAlarmAudio) {
            miniAudio = miniAlarmAudio.cloneNode(true);
            miniAudio.volume = 0.7;
            miniAudio.loop = true;
            miniAudio.play().catch(() => {});
        }

        let miniDmgInterval = setInterval(() => {
            if (!bossFight.active || !mini.parentNode || isDestroyed) {
                clearInterval(miniDmgInterval);
                return;
            }
            HPnumbers = Math.max(0, HPnumbers - 1);
            updateAllBars();
            if (HPnumbers <= 0) {
                if (miniAudio) { miniAudio.pause(); miniAudio.currentTime = 0; }
                clearInterval(miniDmgInterval);
                triggerDeathSequence();
            }
        }, 200);

        // ВСЕГО 1 КЛИК ДЛЯ УНИЧТОЖЕНИЯ!
        mini.addEventListener("click", (e) => {
            e.stopPropagation();
            if (isDestroyed) return;
            isDestroyed = true;

            // Глушим звук и останавливаем таймеры
            if (miniAudio) { miniAudio.pause(); miniAudio.currentTime = 0; }
            clearInterval(miniDmgInterval);
            clearInterval(moveInterval); // Стоп движение! Часы застывают на месте
            bossFight.activeMinis--;

            if (explosionAudio) { 
                let expClone = explosionAudio.cloneNode(true);
                expClone.currentTime = 0;
                expClone.play().catch(() => {}); 
            }

            // Ставим гифку взрыва, убираем тряску, зафиксируем позицию
            mini.src = "img/explosion.gif";
            mini.style.animation = "none";
            
            // Удаляем гифку с экрана через 400мс
            setTimeout(() => mini.remove(), 400);
        });

        container.appendChild(mini);

        let explodeTimeout = setTimeout(() => {
            if (mini && mini.parentNode && !isDestroyed) {
                isDestroyed = true;
                if (miniAudio) { miniAudio.pause(); miniAudio.currentTime = 0; }
                clearInterval(miniDmgInterval);
                clearInterval(moveInterval);
                bossFight.activeMinis--;
                mini.remove();
            }
        }, 8000);

        mini.dataset.timerId = explodeTimeout;

    }, 1500);

    setTimeout(() => {
        onAttackFinished();
    }, 12000);
}

// ==================== АТАКА 3: Скример (Исправленная: хак только по кнопке) ====================
function executeAttack3() {
    if (!bossFight.active || bossFight.isTransitioning) return;
    const bossSprite = document.getElementById("bossSprite");

    let attackTimer = 0;
    let isAttack3Hacked = false; 

    const phoneHackCodeBtn = document.getElementById("phoneHackCodeBtn");
    const monster5Overlay = document.getElementById("monster5HackOverlay");
    const monster5ProgressFill = document.getElementById("monster5HackProgressFill");
    const monster5Percent = document.getElementById("monster5HackPercent");
    const hackStatus = document.getElementById("hackStatus");

    // БОЛЬШЕ НЕ ВКЛЮЧАЕМ ОВЕРЛЕЙ АВТОМАТИЧЕСКИ! ТОЛЬКО ПО КЛИКУ НИЖЕ:
    const handleAttack3Hack = () => {
        if (isAttack3Hacked || !bossFight.active) return;
        isAttack3Hacked = true;

        if (hackStatus) hackStatus.textContent = "SYSTEM STATUS: HACKING BOSS ATTACK...";
        if (phoneHackCodeBtn) phoneHackCodeBtn.disabled = true;

        // Включаем оверлей взлома ТОЛЬКО КОГДА ИГРОК НАЖАЛ КНОПКУ В ТЕЛЕФОНЕ
        if (monster5Overlay) {
            monster5Overlay.classList.add("active");
            if (typeof createMonster5CodeRain === "function") createMonster5CodeRain();
        }

        const hackStartTime = Date.now();
        const hackDuration = 2500; 

        let attack3HackTimer = setInterval(() => {
            const elapsed = Date.now() - hackStartTime;
            const progress = Math.min(100, Math.floor((elapsed / hackDuration) * 100));

            if (monster5ProgressFill) monster5ProgressFill.style.width = progress + "%";
            if (monster5Percent) monster5Percent.textContent = progress + "%";

            if (progress >= 100) {
                clearInterval(attack3HackTimer);
                
                if (monster5Overlay) {
                    monster5Overlay.classList.remove("active");
                    monster5Overlay.querySelectorAll(".monster5-code-column").forEach(col => col.remove());
                }
                if (phoneHackCodeBtn) phoneHackCodeBtn.disabled = false;
                if (hackStatus) hackStatus.textContent = "SYSTEM STATUS: ATTACK BYPASSED!";

                if (monster3Image) monster3Image.style.display = "none";
                if (bossSprite) bossSprite.style.display = "block";
                
                achievementEvent("monster5Hack");
                onAttackFinished();
            }
        }, 30);
    };

    if (phoneHackCodeBtn) {
        phoneHackCodeBtn.addEventListener("click", handleAttack3Hack, { once: true });
    }

    let attack3Interval = setInterval(() => {
        if (!bossFight.active || isAttack3Hacked || bossFight.isTransitioning) {
            clearInterval(attack3Interval);
            if (phoneHackCodeBtn) phoneHackCodeBtn.removeEventListener("click", handleAttack3Hack);
            return;
        }

        attackTimer++;

        // Скример появляется каждую секунду: плавно и быстро затухает за 300мс
        if (bossSprite) bossSprite.style.display = "none";
        if (monster3Image) {
            monster3Image.style.display = "block";
            monster3Image.style.transition = "opacity 0.3s ease";
            monster3Image.style.opacity = "1";
        }
        if (monster3Audio) { monster3Audio.currentTime = 0; monster3Audio.play().catch(() => {}); }

        setTimeout(() => {
            if (monster3Image) monster3Image.style.opacity = "0";
            setTimeout(() => {
                if (monster3Image && !isAttack3Hacked) monster3Image.style.display = "none";
                if (bossSprite && bossFight.active && !isAttack3Hacked) bossSprite.style.display = "block";
            }, 300);
        }, 500);

        // Урон каждую 1 секунду (-10 HP на 1 фазе, -15 HP на 2 фазе)
        if (!isAttack3Hacked) {
            if (!isEyesClosed) {
                let damageAmount = (bossFight.phase === 2) ? 15 : 10;
                HPnumbers = Math.max(0, HPnumbers - damageAmount);
                updateAllBars();
                if (HPnumbers <= 0) triggerDeathSequence();
            }
        }

        if (attackTimer >= 8) {
            clearInterval(attack3Interval);
            if (phoneHackCodeBtn) phoneHackCodeBtn.removeEventListener("click", handleAttack3Hack);
            if (monster3Image) monster3Image.style.display = "none";
            if (bossSprite) bossSprite.style.display = "block";
            if (!isAttack3Hacked) onAttackFinished();
        }
    }, 1000);
}

function onAttackFinished() {
    if (!bossFight.active || bossFight.isTransitioning) return;
    
    bossFight.isAttackActive = false;
    clearInterval(bossFight.damageInterval);
    const bossSprite = document.getElementById("bossSprite");
    if (bossSprite) bossSprite.style.animation = "none";
    if (loudAlarmAudio) { loudAlarmAudio.pause(); loudAlarmAudio.currentTime = 0; }

    bossFight.attackCount++;

    if (bandage) bandage.style.display = "block";

    let neededAttacks = (bossFight.phase === 1) ? 3 : 5;

    if (bossFight.attackCount >= neededAttacks) {
        openBossVulnerableWindow();
    } else {
        bossFight.attackTimeout = setTimeout(triggerRandomBossAttack, 5000);
    }
}

function openBossVulnerableWindow() {
    bossFight.isVulnerable = true;
    bossFight.attackCount = 0;
    const bossSprite = document.getElementById("bossSprite");

    if (bossSprite) bossSprite.style.filter = "drop-shadow(0 0 15px gold)";

    bossFight.vulnerableTimer = setTimeout(() => {
        bossFight.isVulnerable = false;
        if (bossSprite) bossSprite.style.filter = "none";

        if (bossFight.hp <= 30 && bossFight.phase === 1) {
            triggerPhase2Transition();
            return;
        }

        if (bossFight.hp <= 0) {
            winBossFight();
        } else {
            setTimeout(triggerRandomBossAttack, 5000);
        }
    }, 5000);
}

// ==================== ПЕРЕХОД НА 2 ФАЗУ (ЖЕСТКАЯ ТРЯСКА + БЕЛАЯ ВСПЫШКА) ====================
function triggerPhase2Transition() {
    bossFight.isTransitioning = true;
    bossFight.phase = 2;

    // Вырубаем музыку 1 фазы
    if (bossMusic) { bossMusic.pause(); bossMusic.currentTime = 0; }

    const bossSprite = document.getElementById("bossSprite");
    
    // Создаем или находим элемент белой вспышки для перехода
    let transitionFlash = document.getElementById("bossTransitionFlash");
    if (!transitionFlash) {
        transitionFlash = document.createElement("div");
        transitionFlash.id = "bossTransitionFlash";
        transitionFlash.style.position = "fixed";
        transitionFlash.style.top = "0";
        transitionFlash.style.left = "0";
        transitionFlash.style.width = "100vw";
        transitionFlash.style.height = "100vh";
        transitionFlash.style.backgroundColor = "white";
        transitionFlash.style.zIndex = "99999";
        transitionFlash.style.opacity = "0";
        transitionFlash.style.pointerEvents = "none";
        transitionFlash.style.transition = "opacity 0.5s ease";
        document.body.appendChild(transitionFlash);
    }

    if (bossSprite) {
        bossSprite.style.left = "50%";
        bossSprite.style.top = "52%";
    }

    // НАРАСТАЮЩАЯ ДИКАЯ ТРЯСКА (босс трясется во все стороны, леденящий ужас)
    let shakeStep = 0;
    let intenseShakeInterval = setInterval(() => {
        if (!bossFight.isTransitioning || !bossSprite) {
            clearInterval(intenseShakeInterval);
            return;
        }
        shakeStep++;
        
        // Рандомные смещения пикселей для эффекта сумасшедшей дрожи
        let rx = (Math.random() - 0.5) * (shakeStep * 4); // Амплитуда растет каждую секунду
        let ry = (Math.random() - 0.5) * (shakeStep * 4);
        
        bossSprite.style.transform = `translate(calc(-50% + ${rx}px), calc(-50% + ${ry}px)) scale(1.35)`;
    }, 40); // Частое обновление для плавной, но бешеной тряски

    // Через 2 секунды плавно зажигаем белую вспышку на экране
    setTimeout(() => {
        transitionFlash.style.transition = "opacity 1s ease";
        transitionFlash.style.opacity = "1";
    }, 2000);

    // В пик вспышки (через 3.5 секунды) меняем фон, включаем новую музыку и снимаем дрожь
    setTimeout(() => {
        clearInterval(intenseShakeInterval);
        
        currentBackground = "img/boss_phase2.jpg";
        body.style.backgroundImage = `url('${currentBackground}')`;

        if (bossPhase2Music) {
            bossPhase2Music.currentTime = 0;
            bossPhase2Music.volume = 1;
            bossPhase2Music.play().catch(e => console.log("Ошибка музыки фазы 2:", e));
        }

        // Возвращаем нормальный трансформ без тряски (дальше заработает быстрая левитация)
        if (bossSprite) {
            bossSprite.style.transform = "translate(-50%, -50%) scale(1.35)";
        }

        // Гасим белую вспышку
        transitionFlash.style.transition = "opacity 0.8s ease";
        transitionFlash.style.opacity = "0";
        
        setTimeout(() => {
            transitionFlash.remove();
        }, 800);

        // Даем секунду тишины и запускаем атаки 2 фазы
        setTimeout(() => {
            bossFight.isTransitioning = false;
            setTimeout(triggerRandomBossAttack, 2000);
        }, 1000);

    }, 3500);
}

document.getElementById("bossSprite")?.addEventListener("click", () => {
    if (bossFight.active && bossFight.isVulnerable && !bossFight.isTransitioning) {
        // На 1 фазе хп не может опуститься ниже 30
        if (bossFight.phase === 1 && bossFight.hp - 2 < 30) {
            bossFight.hp = 30;
        } else {
            bossFight.hp -= 2;
        }
        
        updateBossHpUI();

        if (bossFight.hp <= 0) {
            clearTimeout(bossFight.vulnerableTimer);
            winBossFight();
        }
    }
});

function updateBossHpUI() {
    const fill = document.getElementById("bossHpFill");
    const text = document.getElementById("bossHpText");
    if (fill && text) {
        fill.style.width = Math.max(0, bossFight.hp) + "%";
        text.textContent = Math.max(0, bossFight.hp) + " / 100";
    }
}

// ==================== КАТ-СЦЕНА ПОБЕДЫ НАД БОССОМ (ПОЛНАЯ И ФИНАЛЬНАЯ) ====================
function winBossFight() {
achievementEvent("bossWin"); // <--- ВСТАВЬ ЭТО СЮДА (Ачивка 61)
    bossFight.active = false;
    clearTimeout(bossFight.trackTimer);
    
    // Вырубаем всю музыку босса
    if (bossMusic) bossMusic.pause();
    if (bossPhase2Music) bossPhase2Music.pause();

    const bossSprite = document.getElementById("bossSprite");
    if (bossSprite) {
        // 1. Картинка босса встает по центру
        bossSprite.style.left = "50%";
        bossSprite.style.top = "52%";
        bossSprite.style.transform = "translate(-50%, -50%) scale(1.35)";
    }

    // 2. Картинка босса начинает дрожать
    let agonyShake = setInterval(() => {
        if (!bossSprite) return;
        let rx = (Math.random() - 0.5) * 12;
        let ry = (Math.random() - 0.5) * 12;
        bossSprite.style.transform = `translate(calc(-50% + ${rx}px), calc(-50% + ${ry}px)) scale(1.35)`;
    }, 40);

    // 3. Белая вспышка и смена фона с Фазы 2 на Фазу 1
    setTimeout(() => {
        let flash = document.createElement("div");
        flash.style.position = "fixed";
        flash.style.top = "0";
        flash.style.left = "0";
        flash.style.width = "100vw";
        flash.style.height = "100vh";
        flash.style.backgroundColor = "white";
        flash.style.zIndex = "99998";
        flash.style.opacity = "0";
        flash.style.transition = "opacity 0.3s ease";
        document.body.appendChild(flash);

        setTimeout(() => flash.style.opacity = "1", 50);

        setTimeout(() => {
            currentBackground = "img/boss_phase1.jpg";
            body.style.backgroundImage = `url('${currentBackground}')`;

            const finalExplosionAudio = document.getElementById("bossFinalExplosionAudio");
            if (finalExplosionAudio) {
                finalExplosionAudio.currentTime = 0;
                finalExplosionAudio.volume = 1;
                finalExplosionAudio.play().catch(() => {});
            }

            if (bossSprite) {
                clearInterval(agonyShake);
                bossSprite.src = "img/boss_explosion.gif"; 
                bossSprite.style.transform = "translate(-50%, -50%) scale(1.5)";
            }

            setTimeout(() => {
                flash.style.opacity = "0";
                setTimeout(() => flash.remove(), 400);
            }, 400);

        }, 300);
    }, 1500);

    // 4. Экран начинает трястись и белеть на 100%
    setTimeout(() => {
        let containerElem = document.body;
        let whiteFade = document.createElement("div");
        whiteFade.style.position = "fixed";
        whiteFade.style.top = "0";
        whiteFade.style.left = "0";
        whiteFade.style.width = "100vw";
        whiteFade.style.height = "100vh";
        whiteFade.style.backgroundColor = "white";
        whiteFade.style.zIndex = "99999";
        whiteFade.style.opacity = "0";
        whiteFade.style.transition = "opacity 2s ease"; 
        document.body.appendChild(whiteFade);

        let screenShakeTimer = setInterval(() => {
            let sx = (Math.random() - 0.5) * 18;
            let sy = (Math.random() - 0.5) * 18;
            containerElem.style.transform = `translate(${sx}px, ${sy}px)`;
        }, 30);

        setTimeout(() => whiteFade.style.opacity = "1", 100);

        // 5. Когда экран полностью побелел — запускаем видео и отдышку
        setTimeout(() => {
            clearInterval(screenShakeTimer);
            containerElem.style.transform = "translate(0, 0)";
            whiteFade.remove();
            if (bossSprite) bossSprite.style.display = "none";

            const victoryVideo = document.getElementById("bossVictoryVideo");
            const breathingAudio = document.getElementById("breathingAudio");
            const wakeUpImage = document.getElementById("bossWakeUpImage");

            if (breathingAudio) {
                breathingAudio.currentTime = 0;
                breathingAudio.volume = 1;
                breathingAudio.play().catch(() => {});
            }

            if (victoryVideo) {
                victoryVideo.style.display = "block";
                victoryVideo.style.zIndex = "99999";
                victoryVideo.currentTime = 0;
                victoryVideo.play().catch(() => {});

                // Через 2 секунды видео сменяется на картинку пробуждения
                setTimeout(() => {
                    victoryVideo.pause();
                    victoryVideo.style.display = "none";

                    if (wakeUpImage) {
                        wakeUpImage.style.display = "block"; 
                wakeUpImage.style.zIndex = "99999";
                    }

                    // Ждем 3 секунды, пока игрок смотрит на картинку на кровати
                    setTimeout(() => {
                        let blackFade = document.createElement("div");
                        blackFade.style.position = "fixed";
                        blackFade.style.top = "0";
                        blackFade.style.left = "0";
                        blackFade.style.width = "100vw";
                        blackFade.style.height = "100vh";
                        blackFade.style.backgroundColor = "black";
                        blackFade.style.zIndex = "9999999";
                        blackFade.style.opacity = "0";
                        blackFade.style.transition = "opacity 2s ease";
                        document.body.appendChild(blackFade);

                        setTimeout(() => blackFade.style.opacity = "1", 50);

                        // Когда экран полностью погрузился во тьму
                        setTimeout(() => {
                            if (wakeUpImage) wakeUpImage.style.display = "none";
                            blackFade.remove();

                            // === ВОТ ЭТОТ КОД С ТИТРАМИ ТАКЖЕ ВСТАВЛЯЕТСЯ СЮДА ===
                            const creditsContainer = document.getElementById("victoryCreditsContainer");
                            const creditsScroll = document.getElementById("victoryCreditsScroll");

                            if (creditsContainer && creditsScroll) {
                                creditsContainer.style.display = "block";

                                creditsScroll.addEventListener("animationend", () => {
                                    setTimeout(() => {

unlockAchievement(8); // <--- ВСТАВЬ ЭТО СЮДА (Ачивка 8: Страшный сон)

                                        if (breathingAudio) {
                                            breathingAudio.pause();
                                            breathingAudio.currentTime = 0;
                                        }

                                        if (typeof kmBalance !== "undefined") {
                                            kmBalance += 2000;
                                            if (typeof saveShopData === "function") saveShopData();
                                        }

                                        let finalFade = document.createElement("div");
                                        finalFade.style.position = "fixed";
                                        finalFade.style.top = "0";
                                        finalFade.style.left = "0";
                                        finalFade.style.width = "100vw";
                                        finalFade.style.height = "100vh";
                                        finalFade.style.backgroundColor = "black";
                                        finalFade.style.zIndex = "2000000";
                                        finalFade.style.opacity = "0";
                                        finalFade.style.transition = "opacity 1s ease";
                                        document.body.appendChild(finalFade);

                                        setTimeout(() => finalFade.style.opacity = "1", 50);

                                        setTimeout(() => {
                                            location.reload();
                                        }, 1000);

                                    }, 3000);
                                }, { once: true });
                            }
                            // ====================================================

                        }, 2000);

                    }, 3000);

                }, 2000);
            } else {
                if (wakeUpImage) wakeUpImage.style.display = "block";
            }

        }, 2200);

    }, 4500);
}

// ==================== ИСПРАВЛЕННАЯ ЛОГИКА ПОРТАЛА И СТРЕЛОЧЕК ====================
let currentSelectedPortalLevel = 1;
const maxPortalLevel = 10;

const portalLevelText = document.getElementById("portalLevelText");
const portalPrevLevelBtn = document.getElementById("portalPrevLevel");
const portalNextLevelBtn = document.getElementById("portalNextLevel");
const portalLaunchButton = document.querySelector(".portalLaunchButton");
const portalImage = document.querySelector(".portal");

function updatePortalLevelDisplay() {
    if (portalLevelText) {
        if (currentSelectedPortalLevel === 5) {
            portalLevelText.textContent = "Level 5 (Chase)";
        } else if (currentSelectedPortalLevel === 10) {
            portalLevelText.textContent = "Level 10 (Boss)";
        } else {
            portalLevelText.textContent = `Level ${currentSelectedPortalLevel}`;
        }
    }
}

// 1. Клик по кнопке запуска портала (активирует спаун и звук)
if (portalLaunchButton) {
    portalLaunchButton.addEventListener("click", () => {
        const level = currentSelectedPortalLevel;
        
        if (!Number.isInteger(level) || level < 1 || level > 10) return;
        if (typeof currentLevel !== 'undefined' && level === currentLevel) return;

        if (portalImage) portalImage.style.display = "block";
        if (portalSpawnAudio) {
            portalSpawnAudio.currentTime = 0;
            portalSpawnAudio.play().catch(() => {});
        }
    });
}

// 2. Клик по появившемуся порталу (телепортация на выбранный уровень)
if (portalImage) {
    portalImage.addEventListener("click", () => {
        if (doorTransitionPending) return;
        achievementEvent("portal");
        const destination = currentSelectedPortalLevel;
        portalImage.style.display = "none";

        doorTransitionPending = true;
        transitionTargetLevel = destination;

// --- ДОБАВЬ ВОТ ЭТИ ДВЕ СТРОЧКИ СЮДА ---
    document.querySelector(".eyesCLOSE").classList.add("transition-hidden");
    document.getElementById("eyelidsOverlay").classList.add("transition-hidden");
    // ----------------------------------------

        if (typeof water !== 'undefined') water.style.display = "none";
        if (typeof energyDrink !== 'undefined') energyDrink.style.display = "none";
        if (typeof bandage !== 'undefined') bandage.style.display = "none";
        if (typeof respawnClockGround !== 'undefined') respawnClockGround.style.display = "none";
        if (inventory) inventory.style.display = "none";
        if (mapInterface) mapInterface.style.display = "none";
        if (portalGunInterface) portalGunInterface.style.display = "none";
        if (useWindow) useWindow.style.display = "none";

        document.querySelector(".lol").style.display = "block";
        overlay.classList.remove("flash-white", "fade-out");
        overlay.classList.add("active");
        whiteFlashBtn.classList.remove("show");

        setTimeout(() => {
            if (doorTransitionPending) whiteFlashBtn.classList.add("show");
        }, 3000);
    });
}

// 3. Управление стрелочками влево / вправо
if (portalPrevLevelBtn && portalNextLevelBtn) {
    portalPrevLevelBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        currentSelectedPortalLevel--;
        if (currentSelectedPortalLevel < 1) {
            currentSelectedPortalLevel = maxPortalLevel;
        }
        updatePortalLevelDisplay();
    });

    portalNextLevelBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        currentSelectedPortalLevel++;
        if (currentSelectedPortalLevel > maxPortalLevel) {
            currentSelectedPortalLevel = 1;
        }
        updatePortalLevelDisplay();
    });
}

updatePortalLevelDisplay();