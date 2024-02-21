/*
To Dos:
Store units in its own JSON object
Have user select upgrades by clicking button instead of typing
Need equip function
Need encounter selector
Need gold counter
Need shop
NEED EFFECTS FUNCTIONALITY:
    Poison(debuff) - If poisoned, starting on their next turn, units roll an avoidance check, they take 1 dmg if they fail.
             Upon victory, the poison is cured.
    Freeze(buff) - If attacked, your attacker must roll an avoidance check. If they fail, they become frozen, and skip their next attack.
    Frozen(debuff) - Units with the "Frozen" status skip their next attack, then thaw.
    Flame(buff) - If attacked, your attacker must roll an avoidance check. if they fail, they take 1 dmg.
    Shockwave(buff) - Units with the "shockwave" status hits all enemies whenever they attack. Chance to hit is 100% but avoidance still applies.
    Crush(debuff) - Units with the "Crush" status have a dmg penalty of their bonus HP.
    Range(buff) - Units with the "Range" status attack first. Subtract 1 from the range value each attack.
    Block(buff) - Units with the "Block" status gain a second avoidance check. If passed, incoming damage is lessened by their block value.
    Trap(buff) - Units with the "Trap" status apply "Trapped" on enemies they hit.
    Trapped(debuff) - Units with the "Trapped" status have zero avoidance.
    Crit(buff) - Units with the "Crit" status have a 30% chance to do double damage.
    Intimidate(buff) Units with the "Intimidate" status take their (dmg: value) less in damage.
    Pet Tank - Units with the "Pet Tank" status have a 90% chance to avoid damage. Once 5 damage has been avoided, the pet dies and this dispels.
    Stun(buff) - Units with the "Stun" status cause enemies to pass an avoidance check or they skip their next turn.
    Rage(buff) - Units with "Rage" attack once more before dying.
    Misdirect(buff) - Units with "Misdirect" have a 50% chance upon avoiding damage to redirect that damage to their attacker.

DONE (beta) - Create combat, need combat results
DONE - Get combat rounds to run again and again until one side is defeated
DONE - Ensure upgrade choices aren't duplicates
DONE - Once an upgrade has been chosen, delete it from upgrade pool (create pool for used ones)
DONE - Need battle results report
DONE! - TOTAL HP CALCULATION!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!



IDEAS:
Upgrade: Add squad member

*/

// ------------------- UNITS ------------------------//
class Unit {
    constructor(name, weapon, armor, accessory, hp, dmg, avoidance, toHit){
        this.name = name, 
        this.weapon = weapon, 
        this.armor = armor, 
        this.accessory = accessory, 
        this.hp = hp, 
        this.dmg = dmg, 
        this.avoidance = avoidance, 
        this.toHit = toHit,
        this.bonusHp = 2, 
        this.bonusDmg = 0, 
        this.bonusAvoidance = 0, 
        this.bonusToHit = 0
    }

    get totalHp() {
        return this.calcTotalHp;
    }

    calcTotalHp(){
        return this.hp + this.bonusHp;
    }

    upgradeUnit(x){
        //x is a number, it selects which upgrade we want from the upgradesArray
        const selectedUpgrade = upgradesArray.find(upgrade => upgrade.name === x);
        console.log("You picked: " + selectedUpgrade.name);
        const statToUpgrade = selectedUpgrade.effect;
        console.log("That will upgrade a units: " + statToUpgrade);
        this[statToUpgrade] += selectedUpgrade.amount;
        console.log(`${this.name} upgraded!`)
    }

}
function createSquire(){
    return new Unit('squire', 'club', 'none', 'none', 1, 1, 25, 75);
}

function createGoblin(){
    return new Unit('goblin', 'club', 'none', 'none', 1, 2, 25, 75);

}

function createSpider(){
    return new Unit('spider', 'fangs', 'none', 'none', 5, 1, 25, 75);
}

// -------------------------------------------------------------- //

// --------- Function calls that create default squads/encounters/etc ----- //
let defaultSquad = {
    name: "Squires",
    units: callTheSquad(5, 'squire')
}

let goblinEncounter = {
    name: "Goblins",
    units: callTheSquad(10, 'goblin')
}

let spiderEncounter = {
    name: "Spiders",
    units: callTheSquad(5, 'spider')
}

// -------------------------------------------------------------- //


// ------------- List of Upgrades ------------------- //

const upgradesArray = [
    { name: "Sharpen Blades", effect: "bonusDmg", amount: 1},
    { name: "Reinforce Armor", effect: "bonusHp", amount: 1},
    { name: "Evasion Training", effect: "bonusAvoidance", amount: 10},
    { name: "Target Practice", effect: "bonusToHit", amount: 10}
]

// ------------- List of Equipment ------------------- //
const equipmentArray = [
    //tier 0 weapons are for enemies, not purchasable
    {tier: 0, type: "weapon", name: 'Club', effect: "dmg", amount: 1, cost: 1}, 
    {tier: 0, type: "weapon", name: 'Fangs', effect: "poison", amount: 1, cost: 1}, 
    {tier: 0, type: "weapon", name: 'Great Frost Club', effect: "freeze", amount: 1, cost: 1}, 
    {tier: 0, type: "weapon", name: 'Great Flame Axe', effect: "flame", amount: 1, cost: 1}, 
    {tier: 0, type: "weapon", name: 'Staff of Ages', effect: "Shockwave", amount: 1, cost: 1}, 
    {tier: 0, type: "weapon", name: 'Greatsword', effect: "Crush", amount: 1, cost: 1},

    {tier: 1, type: "weapon", name: 'Mace', effect: "dmg", amount: 2, cost: 10}, 
    {tier: 1, type: "weapon", name: 'Short Bow', effect: "range", amount: 1, cost: 10}, 
    {tier: 1, type: "armor", name: 'Leather Armor',effect: "hp", amount: 5, cost: 10}, 
    {tier: 1, type: "armor", name: 'Chain Armor', effect: "hp", amount: 10, cost: 10},
    {tier: 1, type: "accessory", name: 'Shield', effect: "block", amount: 1, cost: 10}, 
    {tier: 1, type: "accessory", name: 'Trap', effect: "trap", amount: 1, cost: 10}, 

    {tier: 2, type: "weapon", name: 'Great Axe', effect: "crit", amount: 1, cost: 20}, 
    {tier: 2, type: "weapon", name: 'Longbow', effect: "range", amount: 99, cost: 20}, 
    {tier: 2, type: "weapon", name: 'Poison Dagger', effect: "poison", amount: 1, cost: 20}, 
    {tier: 2, type: "armor", name: 'Plate Armor', effect: "hp", amount: 20, cost: 20}, 
    {tier: 2, type: "armor", name: 'Mask', effect: "avoidance", amount: 60, cost: 20}, 
    {tier: 2, type: "accessory", name: 'War Paint', effect: "intimidate", amount: 1, cost: 20}, 

    {tier: 3, type: "armor", name: 'Wolf', effect: "petTank", amount: 1, cost: 30}, 
    {tier: 3, type: "accessory", name: 'Greatshield', effect: "stun", amount: 1, cost: 30}, 
    {tier: 3, type: "accessory", name: 'Rage Potion', effect: "rage", amount: 1, cost: 30}, 
    {tier: 3, type: "accessory", name: 'Shadow Cloak',effect: "misdirect", amount: 1, cost: 30}
]

// ------------- List of Classes ------------------- //
const classArray = [];


const usedUpgrades = [];
// -------------------------------------------------------------- //


// -----------------------Game Start Variables --------------------------------------- //
let gameTitle = "Smithin' Aint Easy"

let welcomeMsg = `
    Welcome to ${gameTitle}! Outfit your armies to protect the land!
    You are a blacksmith who decides what gear to give the units.
    Before each mission, you can arm them with a single upgrade.
    You begin with ${defaultSquad.length} units. How many can you keep alive after each mission?
    Make your choices and find out!
    `

let questOne = 'Our scouts have noticed a goblin occupation at the nearby mine! We must send our units to route them out!'

// -------------------------------------------------------------- //


// --------------------- Functions ---------------------------------//

//function that takes a single unit (y) and creates an array of (x) many.
function callTheSquad(x, y){
    //x = how many you want
    //y = what you want
    let outputArray = []
    for(let i = 0; i < x; i++){
        switch(y){
            case "squire":
                outputArray.push(createSquire());
                break;
            case "goblin":
                outputArray.push(createGoblin());
                break;
            case "spider":
                outputArray.push(createSpider());
                break;
            default:
                console.log('Unknown type: ', y);
                break;
        }
    }
    return outputArray;
}

// function that equips the selected units with a weapon, armor, or accessory, only one of each can be equipped at a time
function equipUnits(x, y){
    //x is the name of the item
    //y is the squad we're equipping
    const selectedEquipment = equipmentArray.find(item => item.name === x);
    const equipmentType = selectedEquipment.type;
    const effectedStatFromEquipment = selectedEquipment.effect;
    y.forEach(unit => {
        //example of how to read this, it changes depending on what we feed into this function:
        //soldier[weapon] = maceObject.name
        //maceObject isn't a variable, i'm just referring to the actual object that is represented there
        unit[equipmentType] = selectedEquipment.name;
        unit[effectedStatFromEquipment] = selectedEquipment.amount;
    });
}

//function that shows all information about the provided squad
function unitReport(x){
    console.table(x);
}

//randomly nominates an upgrade for the user prompt (we run it in 2 spots to create 2 random options the user can pick from)
function nominateUpgrade(){
    //store list of upgrades names in a variable
    const upgradeKeys = Object.keys(upgradesArray);
    //choose a number (n) and pick the upgrade that was in nth place
    const randomKey = Math.floor(Math.random() * upgradeKeys.length);
    //that number is the index of the upgrade we are going to nominate (barring restrictions)
    const chosenUpgrade = upgradesArray[randomKey];
    return chosenUpgrade.name;
}


//prompt the user to choose their next upgrade
function promptUserToUpgrade(){
    
    let choiceA = nominateUpgrade();
    let choiceB = nominateUpgrade();
    //this prevents us from randomly getting 2 of the same upgrade
    do{
        choiceB = nominateUpgrade();
    } while(choiceA == choiceB)
    
    let playerDecision = prompt(`Will you outfit your ${defaultSquad.name} with ${choiceA} or ${choiceB}?`)
    console.log(`You chose ${playerDecision}!`);
    defaultSquad.units.forEach(unit => {
        unit.upgradeUnit(playerDecision)
    });
    
}

//finds the larger of two clashing armies (used for combat to determine number of units that will be attacking in a round)
function determineLargerArmy(x, y) {
    return x.length > y.length ? x : y;
}


//one round of combat //
function roundOfCombat(x, y, z){
    // x and y are the forces that will do battle
    // ex: x = defaultSquad, y = goblinSquad
    // z in our round number, round 1, round 2, tells us what round of combat we are on
    console.log(`Round: ${z}`)

    // DETERMINE TURN ORDER //
    // if units have first strike, and enemies don't
    if(x[0].firstStrike == true && y[0].firstStrike == false) {
        console.log(`${x[0].name} has first strike!`)
        x.forEach(unit => {
            // units attack, in a row, one at a time
            attack(unit, y);
        })
        y.forEach(unit => {
            // surviving enemies strike back
            attack(unit, x)
        })
    } 

    // if enemies have first strike, and units don't
    else if (x[0].firstStrike == false && y[0].firstStrike == true){
        console.log(`${y[0].name} has first strike!`)
        y.forEach(unit => {
            // enemies attack, in a row, one at a time
            attack(unit, x)
        })
        x.forEach(unit => {
            // surviving units strike back
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
            console.table(x);
            //If there are 5 units and 20 goblins
            //ex: on round 1, unit 1 attacks goblin 1, repeat until all 20 goblins have had attacked
            attack(x[i], y)
            attack(y[i], x)
        }
    };
    console.log('Round complete.')
    //return z;
}

//battle to the death//
function battle(x, y){
    //write a loop that has x and y engage in combat again and again until one side has no units
    let numberOfRounds = 0;
    do {
        numberOfRounds++;
        roundOfCombat(x.units, y.units, numberOfRounds);
    } while(x.units.length > 0 && y.units.length > 0 && numberOfRounds !== 2);
    //roundOfCombat(x.units, y.units, numberOfRounds)
    if(x.units.length > 0){
        battleResults(x, y);
        promptUserToUpgrade(defaultSquad);
    }
    else {
        battleResults(y, x);
    }
}

//report results of battle//
function battleResults(w, l){
    let remainingUnits = w.units;
    console.log(
        `BATTLE REPORT:
        ${w.name} is victorious! ${remainingUnits.length} units live on to battle another day! 
        ${l.name} is no more!`)
    }

// check if alive/dead function
function checkHitPoints(index, squad){
    let unit = squad[index];
    if(unit.totalHp() < 1){
        console.log(`${unit.name} died.`)
        squad.splice(unit, 1);
    } else {
        console.log(`${unit.name} is alive, with ${unit.totalHp} health.`)
    }
}
// attack function
function attack(attackingUnit, defendingArmy){
    let defendingUnit = defendingArmy[0];
    //console.log(`${attackingUnit.name} is attacking ${defendingUnit.name}`)
    if(defendingUnit == undefined){
        //console.log(`${defendingArmy.name} has been defeated!`)
        return
    }
    if(attackingUnit == undefined){
        console.log(`No more attackers available. Ending turn.`)
        return
    }
    //determine hit or miss
    let hitScore = Math.round((Math.random()*100));
    //console.log(`${attackingUnit.name} attacks ${defendingUnit.name}`)
    //console.log(`HitScore: ${hitScore}, needs less than ${attackingUnit.toHit} to hit.`);

    if (hitScore <= attackingUnit.toHit) {
        //console.log(`Its a hit!`);
        let avoidanceCheck = Math.round((Math.random()*100));
        //console.log(`Avoidance: ${avoidanceCheck}, needs less than ${defendingUnit.avoidance} to avoid dmg.`);
        if (avoidanceCheck >= defendingUnit.avoidance){

            console.log(`${attackingUnit.name} hit ${defendingUnit.name} for ${attackingUnit.dmg}!`)
            defendingUnit.hp -= attackingUnit.dmg;
            console.log(`${defendingUnit.name}'s HP: ${defendingUnit.totalHp()}`)
            if(defendingUnit.totalHp() <= 0){
                //if the defender's HP is zero, then it needs to be deleted from its squad
                checkHitPoints(0, defendingArmy);
            }
        } else{
            console.log(`${defendingUnit.name} avoided the attack! No dmg done!`)
        }
    } else {
        console.log(`Its a miss!`)
        return
    }
}

// Default functions that run at start go here //
console.log(welcomeMsg);
callTheSquad(defaultSquad);
promptUserToUpgrade(defaultSquad.units);