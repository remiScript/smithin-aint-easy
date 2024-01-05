let basicSoldier = {
    hp: 1,
    weapon: "short sword",
    dmg: 1,
    atksPerRound: 1,
    avoidance: 25,
    toHit: 75,
    firstStrike: false,
    dualWield: false,
    shield: false,
    fireWeapon: false,
    lightningWeapon: false
}

function callTheSquad(x){
    console.log(`You have ${x} soldiers.`)
    return Array.from({length: x}, () => (
        {...basicSoldier} 
    ));
}

const upgrades = {
    "Long Sword": {dmg: 2, weapon: "long sword"},
    "Longbow": {firstStrike: true},
    "Second Weapon": {atksPerRound: 2}, 
    "Shield": {avoidance: 50}, 
    "Heavy Armor": {hp: 2}
};

function upgradeSoldiers(x, y) {
    const selectedUpgrade = upgrades[x];
    if(selectedUpgrade){
        y.forEach(soldier => {
            Object.assign(soldier, selectedUpgrade);    
        });
        console.log(x + " added!")
    } else {
        console.log('Invalid upgrade');
    }
}

function soldierReport(x){
    console.table(x);
}

let encounters = [
    {name: 'Goblins', hp: 1, toHit: 20, damage: 1, special: "none", qty: 20},
    {name: 'Spiders', hp: 1, toHit: 60, damage: 1, special: "First Strike", qty: 5},
    {name: 'Soldiers', hp: 2, toHit: 70, damage: 1, special: "Armored", qty: 7},
    {name: 'Ice Giant', hp: 30, toHit: 60, damage: 10, special: "Freezing Aura", qty: 1},
    {name: 'Fire Giant', hp: 30, toHit: 20, damage: 10, special: "Flaming Aura", qty: 1},
    {name: 'Wizard', hp: 5, toHit: 80, damage: 1, special: "AoE Shockwave", qty: 1},
    {name: 'Dual Knights', hp: 25, toHit: 80, damage: 2, special: "Armored", qty: 2}
]



let gameTitle = "Smithin' Aint Easy"

let welcomeMsg = `Welcome to ${gameTitle}! Outfit your armies to protect the land!`

let questOne = 'Our scouts have noticed a goblin occupation at the nearby mine! We must send our soldiers to route them out!'

function promptChoices(){
    const upgradeKeys = Object.keys(upgrades);
    const randomKey = Math.floor(Math.random() * upgradeKeys.length)
    return upgradeKeys[randomKey];
}

function goOnMission(squad){
    console.log(questOne);
    let choiceA = promptChoices();
    let choiceB = promptChoices();
    let playerDecision = prompt(`Will you outfit your soldiers with ${choiceA} or ${choiceB}?`)
    console.log(`You chose ${playerDecision}!`);
    upgradeSoldiers(playerDecision, squad);
}

// Default functions that run at start go here //
console.log(welcomeMsg)
let defaultSquad = callTheSquad(4);
goOnMission(defaultSquad);