/*
To Dos:
Finish Upgrade list (once functionality is all there)
Create combat, need combat results

IDEAS:
Upgrade: Add squad member

*/

let basicSoldier = {
    name: 'basicSoldier',
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

let goblin = {
    name: 'goblin',
    hp: 1,
    weapon: "stick",
    dmg: 1,
    atksPerRound: 1,
    avoidance: 15,
    toHit: 20,
    firstStrike: false,
    dualWield: false,
    shield: false,
    fireWeapon: false,
    lightningWeapon: false
}

let defaultSquad = callTheSquad(10, basicSoldier);
let goblinEncounter = callTheSquad(20, goblin);

function callTheSquad(x, y){
    //x = how many you want
    //y = what you want
    //console.log(`You now have a legion of ${x.length} soldiers.`)
    return Array.from({length: x}, () => (
        {...y} 
    ));
}

const upgrades = {
    "Long Sword": {dmg: 2, weapon: "long sword"},
    "Longbow": {firstStrike: true},
    "Second Weapon": {atksPerRound: 2}, 
    "Shield": {avoidance: 50, shield: true}, 
    "Heavy Armor": {hp: 2}
};

function upgradeSoldiers(x, y) {
    //x is a number, it selects which upgrade we want from the upgrades array
    //y is the squad we want to upgrade
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
    //{name: 'Goblins', hp: 1, toHit: 20, damage: 1, special: "none", qty: 20},
    {name: 'Spiders', hp: 1, toHit: 60, damage: 1, special: "First Strike", qty: 5},
    {name: 'Soldiers', hp: 2, toHit: 70, damage: 1, special: "Armored", qty: 7},
    {name: 'Ice Giant', hp: 30, toHit: 60, damage: 10, special: "Freezing Aura", qty: 1},
    {name: 'Fire Giant', hp: 30, toHit: 20, damage: 10, special: "Flaming Aura", qty: 1},
    {name: 'Wizard', hp: 5, toHit: 80, damage: 1, special: "AoE Shockwave", qty: 1},
    {name: 'Dual Knights', hp: 25, toHit: 80, damage: 2, special: "Armored", qty: 2}
]



let gameTitle = "Smithin' Aint Easy"

let welcomeMsg = `
    Welcome to ${gameTitle}! Outfit your armies to protect the land!
    You are a blacksmith who decides what gear to give the soldiers.
    Before each mission, you can arm them with a single upgrade.
    You begin with ${defaultSquad.length} soldiers. How many can you keep alive after each mission?
    Make your choices and find out!
    `

let questOne = 'Our scouts have noticed a goblin occupation at the nearby mine! We must send our soldiers to route them out!'

function promptChoices(){
    const upgradeKeys = Object.keys(upgrades);
    const randomKey = Math.floor(Math.random() * upgradeKeys.length)
    return upgradeKeys[randomKey];
}

function userChoosesUpgrade(squad){
    let choiceA = promptChoices();
    let choiceB = promptChoices();
    let playerDecision = prompt(`Will you outfit your soldiers with ${choiceA} or ${choiceB}?`)
    console.log(`You chose ${playerDecision}!`);
    upgradeSoldiers(playerDecision, squad);
}


// COMBAT //
function combat(x, y){
    // x and y are the forces that will do battle
    // ex: x = defaultSquad, y = goblinSquad
    if(x[0].firstStrike == true && y[0].firstStrike == false) {
        x.forEach(unit => {
            // soldier attacks first enemy
            // this should be an attack function that is called
            attack(unit, y);
        })
        y.forEach(unit => {
            attack(unit, x)
        })
    };
    // need to setup turn order
    // check both sides, see if anyone has first strike. 
        //If they do, they go before anyone else, except those with first strike before them.
        // If both sides have first strike, or neither, its the same.
        // Early on, there should be no way that some units in a squad have first strike and some don't
        // Maybe later when the game works on a basic level, I may add a way for that to happen.
        // This would impact how I write the turn order functions.
}
// check if alive/dead function
function checkHitPoints(index, squad){
    let unit = squad[index];
    if(unit.hp < 1){
        console.log(`${unit.name} died.`)
        squad.splice(unit, 1);
    } else {
        console.log(`${unit.name} is alive.`)
    }
}
// attack function
function attack(attackingUnit, defendingArmy){
    let defendingUnit = defendingArmy[0];
    if(defendingUnit == undefined){
        console.log(`${defendingArmy} has been defeated!`)
        return
    }
    //determine hit or miss
    let hitScore = Math.round((Math.random()*100));
    console.log(`${attackingUnit.name} attacks ${defendingUnit.name}`)
    console.log(`HitScore: ${hitScore}, needs less than ${attackingUnit.toHit} to hit.`);

    if (hitScore <= attackingUnit.toHit) {
        console.log(`Its a hit!`);
        let avoidanceCheck = Math.round((Math.random()*100));
        console.log(`Avoidance: ${avoidanceCheck}, needs less than ${defendingUnit.avoidance} to avoid damage.`);
        if (avoidanceCheck >= defendingUnit.avoidance){
            console.log(`${attackingUnit.name} hit ${defendingUnit.name} for ${attackingUnit.dmg}!`)
            defendingUnit.hp -= attackingUnit.dmg
            if(defendingUnit.hp == 0){
                //if the defender's HP is zero, then it needs to be deleted from its squad
                checkHitPoints(0, defendingArmy);
            }
        } else{
            console.log(`${defendingUnit.name} avoided the attack! No damage done!`)
        }
    } else {
        console.log(`Its a miss!`)
        return
    }
}

// Default functions that run at start go here //
console.log(welcomeMsg);
callTheSquad(defaultSquad);
userChoosesUpgrade(defaultSquad);