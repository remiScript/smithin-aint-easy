/*
To Dos:
Finish Upgrade list (once functionality is all there)
Create combat, need combat results
Store units in its own JSON object
Have user select upgrades by clicking button instead of typing
Need battle results report
DONE - Get combat rounds to run again and again until one side is defeated



IDEAS:
Upgrade: Add squad member

*/

// ------------------- UNITS ------------------------//
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
// -------------------------------------------------------------- //


// ------- List of encounters, will probably be refactored ------- //
let encounters = [
    //{name: 'Goblins', hp: 1, toHit: 20, damage: 1, special: "none", qty: 20},
    {name: 'Spiders', hp: 1, toHit: 60, damage: 1, special: "First Strike", qty: 5},
    {name: 'Soldiers', hp: 2, toHit: 70, damage: 1, special: "Armored", qty: 7},
    {name: 'Ice Giant', hp: 30, toHit: 60, damage: 10, special: "Freezing Aura", qty: 1},
    {name: 'Fire Giant', hp: 30, toHit: 20, damage: 10, special: "Flaming Aura", qty: 1},
    {name: 'Wizard', hp: 5, toHit: 80, damage: 1, special: "AoE Shockwave", qty: 1},
    {name: 'Dual Knights', hp: 25, toHit: 80, damage: 2, special: "Armored", qty: 2}
]
// -------------------------------------------------------------- //


// --------- Function calls that create default squads/encounters/etc ----- //
//let defaultSquad = callTheSquad(10, basicSoldier);
let defaultSquad = {
    name: "Soldiers",
    units: callTheSquad(10, basicSoldier)
}
//let goblinEncounter = callTheSquad(20, goblin);
let goblinEncounter = {
    name: "Goblins",
    units: callTheSquad(20, goblin)
}
// -------------------------------------------------------------- //


// ------------- List of Upgrades ------------------- //
const upgrades = {
    "Long Sword": {dmg: 2, weapon: "long sword"},
    "Longbow": {firstStrike: true},
    "Second Weapon": {atksPerRound: 2}, 
    "Shield": {avoidance: 50, shield: true}, 
    "Heavy Armor": {hp: 2}
};
// -------------------------------------------------------------- //


// -----------------------Game Start Variables --------------------------------------- //
let gameTitle = "Smithin' Aint Easy"

let welcomeMsg = `
    Welcome to ${gameTitle}! Outfit your armies to protect the land!
    You are a blacksmith who decides what gear to give the soldiers.
    Before each mission, you can arm them with a single upgrade.
    You begin with ${defaultSquad.length} soldiers. How many can you keep alive after each mission?
    Make your choices and find out!
    `

let questOne = 'Our scouts have noticed a goblin occupation at the nearby mine! We must send our soldiers to route them out!'

// -------------------------------------------------------------- //


// --------------------- Functions ---------------------------------//

//function that takes a single unit (y) and creates an array of (x) many.
function callTheSquad(x, y){
    //x = how many you want
    //y = what you want
    //console.log(`You now have a legion of ${x.length} soldiers.`)
    return Array.from({length: x}, () => (
        {...y} 
    ));
}

//function that gives a squad (could be our soldiers, could even be an enemy squad), an upgrade of our choosing
function upgradeSoldiers(x, y) {
    //x is a number, it selects which upgrade we want from the upgrades array
    //y is the squad we want to upgrade
    ////////////////////////////////const units = y.units;
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

//function that shows all information about the provided squad
function soldierReport(x){
    console.table(x);
}

//randomly nominates an upgrade for the user prompt (we run it in 2 spots to create 2 random options the user can pick from)
function nominateUpgrade(){
    //store list of upgrades in a variable
    const upgradeKeys = Object.keys(upgrades);

    //choose a number (n) and pick the upgrade that was in nth place
    const randomKey = Math.floor(Math.random() * upgradeKeys.length)
    return upgradeKeys[randomKey];
}

//prompt the user to choose their next upgrade
function promptUserToUpgrade(squad){
    let choiceA = nominateUpgrade();
    let choiceB = nominateUpgrade();
    let playerDecision = prompt(`Will you outfit your soldiers with ${choiceA} or ${choiceB}?`)
    console.log(`You chose ${playerDecision}!`);
    upgradeSoldiers(playerDecision, squad.units);
}

//finds the larger of two clashing armies (used for combat to determine number of units that will be attacking in a round)
function determineLargerArmy(x, y) {
    return x.length > y.length ? x : y;
}


//one round of combat //
function roundOfCombat(x, y){
    // x and y are the forces that will do battle
    // ex: x = defaultSquad, y = goblinSquad

    // DETERMINE TURN ORDER //
    // if soldiers have first strike, and enemies don't
    if(x[0].firstStrike == true && y[0].firstStrike == false) {
        x.forEach(unit => {
            // soldiers attack, in a row, one at a time
            attack(unit, y);
        })
        y.forEach(unit => {
            // surviving enemies strike back
            attack(unit, x)
        })
    } 

    // if enemies have first strike, and soldiers don't
    else if (x[0].firstStrike == false && y[0].firstStrike == true){
        y.forEach(unit => {
            // enemies attack, in a row, one at a time
            attack(unit, x)
        })
        x.forEach(unit => {
            // surviving soldiers strike back
            attack(unit, y);
        })
    } 
    
    // this covers if both sides have first strike, or neither
    // x1 attacks y1
    // y1 attacks x1
    // x2 attacks
    else {
    // we detemine larger army so that we know how many turns per round there are
    let biggerArmy = determineLargerArmy(x, y);
        for (let i = 0; i < biggerArmy.length; i++){
            //If there are 5 soldiers and 20 goblins
            //ex: on round 1, soldier 1 attacks goblin 1, repeat until all 20 goblins have had attacked
            attack(x[i], y)
            attack(y[i], x)
        }
    };
}

//battle to the death//
function battle(x, y){
    //write a loop that has x and y engage in combat again and again until one side has no units
    do {
        roundOfCombat(x.units, y.units);
    } while(x.units.length > 0 && y.units.length > 0);
    if(x.units.length > 0){
        battleResults(x, y);
    }
    else {
        battleResults(y, x);
    }
}

//report results of battle//
function battleResults(w, l){
    let remainingUnits = w.units;
    console.log(`BATTLE REPORT:
    ${w.name} is victorious! ${remainingUnits.length} units live on to battle another day! 
    ${l.name} is no more!`)
}

// check if alive/dead function
function checkHitPoints(index, squad){
    let unit = squad[index];
    if(unit.hp < 1){
        //console.log(`${unit.name} died.`)
        squad.splice(unit, 1);
    } else {
        console.log(`${unit.name} is alive, with ${unit.hp} health.`)
    }
}
// attack function
function attack(attackingUnit, defendingArmy){
    let defendingUnit = defendingArmy[0];
    if(defendingUnit == undefined){
        //console.log(`${defendingArmy.name} has been defeated!`)
        return
    }
    if(attackingUnit == undefined){
        //console.log(`No more attackers available. Ending turn.`)
        return
    }
    //determine hit or miss
    let hitScore = Math.round((Math.random()*100));
    //console.log(`${attackingUnit.name} attacks ${defendingUnit.name}`)
    //console.log(`HitScore: ${hitScore}, needs less than ${attackingUnit.toHit} to hit.`);

    if (hitScore <= attackingUnit.toHit) {
        //console.log(`Its a hit!`);
        let avoidanceCheck = Math.round((Math.random()*100));
        //console.log(`Avoidance: ${avoidanceCheck}, needs less than ${defendingUnit.avoidance} to avoid damage.`);
        if (avoidanceCheck >= defendingUnit.avoidance){
            //console.log(`${attackingUnit.name} hit ${defendingUnit.name} for ${attackingUnit.dmg}!`)
            defendingUnit.hp -= attackingUnit.dmg
            if(defendingUnit.hp == 0){
                //if the defender's HP is zero, then it needs to be deleted from its squad
                checkHitPoints(0, defendingArmy);
            }
        } else{
            //console.log(`${defendingUnit.name} avoided the attack! No damage done!`)
        }
    } else {
        //console.log(`Its a miss!`)
        return
    }
}

// Default functions that run at start go here //
console.log(welcomeMsg);
callTheSquad(defaultSquad);
promptUserToUpgrade(defaultSquad);