/*
To Dos:
ADD CUTE USER ICON OPTIONS
Store units in its own JSON object
Have user select upgrades by clicking button instead of typing
Need encounter selector/Simulator
NEED Game Over and New Game function
Need shop
Need inventory functionality:
    Adding an item to inventory (for buying)
    Removing an item (for selling, maybe they're consumed when you class up?)
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
DONE - Need equip function
DONE - Worked out total/bonus/base stats (hp, dmg, avoidance, toHit)
DONE - Need gold counter


IDEAS:
Upgrade: Add squad member

*/
// ------------------- Player ------------------------//
class Player {
    constructor(){
        this.name = "Player 1",
        this.gold =  0,
        this.mostWavesCompleted = 0,
        this.inventory = [];
    }
    addItemToInventory(x){
        this.inventory.push(x);
    }
}

let player1 = new Player()

// ------------------- UNITS ------------------------//
class Unit {
    constructor(name, weapon, armor, accessory, hp, dmg, avoidance, toHit, loot){
        this.name = name, 
        this.weapon = weapon, 
        this.armor = armor, 
        this.accessory = accessory, 
        this.hp = hp, 
        this.dmg = dmg, 
        this.avoidance = avoidance, 
        this.toHit = toHit,
        this.bonusHp = 0, 
        this.bonusDmg = 0, 
        this.bonusAvoidance = 0, 
        this.bonusToHit = 0,
        this.loot = loot
    }

    get totalHp() {
        return this.calcTotal(this.hp, this.bonusHp);
    }

    get totalDmg(){
        return this.calcTotal(this.dmg, this.bonusDmg);
    }

    get totalAvoidance(){
        return this.calcTotal(this.avoidance, this.bonusAvoidance);
    }

    get totalToHit(){
        return this.calcTotal(this.toHit, this.bonusToHit);
    }

    calcTotal(x, y){
        return x + y;
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
    return new Unit('squire', 'Bone', 'none', 'none', 10, 1, 25, 95, 0);
}

function createGoblin(){
    return new Unit('goblin', 'Bone', 'none', 'none', 1, 2, 5, 75, 1);

}

function createSpider(){
    return new Unit('spider', 'Spider Fangs', 'none', 'none', 5, 1, 25, 75, 3);
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
    {tier: 0, type: "weapon", name: 'Bone', effect: "dmg", amount: 1, cost: 1}, 
    {tier: 0, type: "weapon", name: 'Spider Fangs', effect: "poison", amount: 1, cost: 1}, 
    {tier: 0, type: "weapon", name: 'Frost Sword', effect: "freeze", amount: 1, cost: 1}, 
    {tier: 0, type: "weapon", name: 'Flame Sword', effect: "flame", amount: 1, cost: 1}, 
    {tier: 0, type: "weapon", name: 'Staff of Ages', effect: "Shockwave", amount: 1, cost: 1}, 
    {tier: 0, type: "weapon", name: 'Greatsword', effect: "Crush", amount: 1, cost: 1},

    {tier: 1, type: "weapon", name: 'Scepter', effect: "dmg", amount: 2, cost: 10}, 
    {tier: 1, type: "weapon", name: 'Short Bow', effect: "range", amount: 1, cost: 10}, 
    {tier: 1, type: "armor", name: 'Leather Armor',effect: "hp", amount: 5, cost: 10}, 
    {tier: 1, type: "armor", name: 'Chain Armor', effect: "hp", amount: 10, cost: 10},
    {tier: 1, type: "accessory", name: 'Shield', effect: "block", amount: 1, cost: 10}, 
    {tier: 1, type: "accessory", name: 'Trap', effect: "trap", amount: 1, cost: 10}, 

    {tier: 2, type: "weapon", name: 'Great Axe', effect: "crit", amount: 1, cost: 20}, 
    {tier: 2, type: "weapon", name: 'Longbow', effect: "range", amount: 99, cost: 20}, 
    {tier: 2, type: "weapon", name: 'Poisoned Blades', effect: "poison", amount: 1, cost: 20}, 
    {tier: 2, type: "armor", name: 'Plate Armor', effect: "hp", amount: 20, cost: 20}, 
    {tier: 2, type: "armor", name: 'Ghostly Essence', effect: "avoidance", amount: 60, cost: 20}, 
    {tier: 2, type: "accessory", name: 'War Paint', effect: "intimidate", amount: 1, cost: 20}, 

    {tier: 3, type: "armor", name: 'Wolf', effect: "petTank", amount: 1, cost: 30}, 
    {tier: 3, type: "accessory", name: 'Greatshield', effect: "stun", amount: 1, cost: 30}, 
    {tier: 3, type: "accessory", name: 'Rage Crystal', effect: "rage", amount: 1, cost: 30}, 
    {tier: 3, type: "accessory", name: 'Shadow Cloak',effect: "misdirect", amount: 1, cost: 30}
]

// ------------- List of Classes ------------------- //
const classArray = [];
// -------------------------------------------------------------- //


// -----------------------Game Start Variables --------------------------------------- //
let gameTitle = "Smithin' Aint Easy"
let welcomeMsg = 
    `
    Welcome to ${gameTitle}! Outfit your armies to protect the land!
    You are a blacksmith who decides what gear to give the units.
    Before each mission, you can arm them with a single upgrade.
    You begin with ${defaultSquad.length} units. How many can you keep alive after each mission?
    Make your choices and find out!
    `
// -------------------------------------------------------------- //


// --------------------- Functions ---------------------------------//

//Creates array of units (CLEAN, HAS NOTES)
function callTheSquad(qty, unit){
    //qty = how many you want
    //unit = what you want
    let outputArray = []
    for(let i = 0; i < qty; i++){
        switch(unit){
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

//Equips selected units with weapon/armor/accessory (CLLEAN, HAS NOTES)
//Only one of each can be equipped at a time
function equipUnits(x, y){
    //x = name of the item
    //y = the squad
    //1. Use the name to find the matching upgrade
    const selectedEquipment = equipmentArray.find(item => item.name === x);

    //2. Use the type property to determine weapon/armor/accessory
    const equipmentType = selectedEquipment.type;

    //3. Use the effect property to determine what stats it affects, hp/dmg/toHit/etc.
    const effectedStatFromEquipment = selectedEquipment.effect;

    //4. Equip each unit with the item
    y.forEach(unit => {
        //Ex:
        //squire[weapon] = maceObj.name (hypothetical name)
        unit[equipmentType] = selectedEquipment.name;
        //Mace changes dmg value to 2
        unit[effectedStatFromEquipment] = selectedEquipment.amount;
    });
}

//Randomly nominates an upgrade for the user prompt (CLEAN, HAS NOTES)
//Run it twice, create 2 options for the user
//This will be changed from window alerts to buttons
function nominateUpgrade(){
    //store list of upgrades names in a variable
    const upgradeKeys = Object.keys(upgradesArray);
    //choose a number (n) and pick the upgrade that was in nth place
    const randomKey = Math.floor(Math.random() * upgradeKeys.length);
    //that number is the index of the upgrade we are going to nominate
    const chosenUpgrade = upgradesArray[randomKey];
    return chosenUpgrade.name;
}


//Prompt the user to choose upgrade (CLEAN, HAS NOTES)
function promptUserToUpgrade(){
    //1. Pick randomly, from upgradesArray, to give player 2 choices
    let choiceA = nominateUpgrade();
    let choiceB = nominateUpgrade();
    //this prevents us from randomly getting 2 of the same upgrade
    do{
        choiceB = nominateUpgrade();
    } while(choiceA == choiceB)

    //2. Prompt player to choose
    let playerDecision = prompt(`Will you outfit your ${defaultSquad.name} with ${choiceA} or ${choiceB}?`)

    //3. Upgrade each player unit with that choice
    defaultSquad.units.forEach(unit => {
        unit.upgradeUnit(playerDecision)
    });
    
}

//Finds larger army (CLEAN)
//Used for combat, determines number of rounds
function determineLargerArmy(x, y) {
    return x.length > y.length ? x : y;
}


//Single round of combat (CLEAN, HAS NOTES)
function roundOfCombat(x, y, z){
    // x and y are the forces that will do battle
    // ex: x = defaultSquad, y = goblinSquad
    // z is our "what round of combat are we on" number
    console.log(`Round: ${z}`)

    //1. DETERMINE TURN ORDER
    //a. Player units have range, and enemies don't
    if(x[0].range >= 1 && (y[0].range == undefined || range <= 0)) {
        x.forEach(unit => {
            // units attack, sequentially, one at a time
            attack(unit, y);
        })
        y.forEach(unit => {
            // surviving enemies strike back
            attack(unit, x)
        })
    } 

    //b. Enemies have range, and player units don't
    else if ((x[0].range == undefined || range <= 0) && y[0].range >= 1){
        y.forEach(unit => {
            // enemies attack, in a row, one at a time
            attack(unit, x)
        })
        x.forEach(unit => {
            // surviving units strike back
            attack(unit, y);
        })
    } 
    
    //c. If both sides have range, or neither
    //Order: x1, y1, x2, etc.
    else {
    // Detemine larger army so that we know total turns per round
    let biggerArmy = determineLargerArmy(x, y);
        for (let i = 0; i < biggerArmy.length; i++){
            //If there are 5 units and 20 goblins
            //ex: on round 1, unit 1 attacks goblin 1, repeat until all 20 goblins have had attacked
            attack(x[i], y);
            attack(y[i], x);
        }
    };
    console.log('Round complete.');
    //This function doesn't return anything
}

//Battle function (CLEAN, HAS NOTES)
// Needs a GAME OVER function
function battle(x, y){

    //Combat will be done in rounds, create counter
    let numberOfRounds = 0;

    do {
        //Increment the counter
        numberOfRounds++;
        //Single round of combat, then check if either side has zero units left
        roundOfCombat(x.units, y.units, numberOfRounds);
    } while(x.units.length > 0 && y.units.length > 0);
    
    //If the player wins, prompt them for another upgrade, report results
    if(x.units.length > 0){
        battleResults(x, y);
        promptUserToUpgrade(defaultSquad);
    }
    //If enemy wins, game over, report results
    else {
        battleResults(y, x);
    }
}

//Report results of battle (CLEAN, HAS NOTES)
function battleResults(w, l){
    let remainingUnits = w.units;
    console.log(
        `BATTLE REPORT:
        ${w.name} is victorious! ${remainingUnits.length} units live on to battle another day! 
        ${l.name} is no more!`)
}

// Check if alive/dead, loot gold, delete from squad (CLEAN, HAS NOTES)
// - Has logic for looting, maybe separate that into its own function?
function checkHitPoints(unit, squad){
    //Check if a unit is dead
    if(unit.totalHp < 1){
        //Distribute loot
        player1.gold += unit.loot;
        //Delete unit from squad
        squad.splice(unit, 1);
    } else {
        //If they are alive, for some reason
        console.log(`${unit.name} is alive, with ${unit.totalHp} health.`)
    }
}
// Attack function (CLEAN, HAS NOTES)
// - Needs logic for buffs/debuffs
function attack(attackingUnit, defendingArmy){
    //Attack first position of enemy army, since that's the only guaranteed spot that there will be an enemy
    let defendingUnit = defendingArmy[0];

    //This is here to prevent an error
    if(attackingUnit == undefined){
        return
    }
    //If there is no one left to attack, end the function
    if(defendingUnit == undefined){
        return
    }

    //determine hit or miss

    //1. Create generic hitscore
    let hitScore = Math.round((Math.random()*100));

    //2a. If its lower than/equal to the attackers chance to hit, its a hit (thus incentivizing players to raise their toHit)
    if (hitScore <= attackingUnit.totalToHit) {

        //3a. Now we do an avoidance check, same idea here, generic number
        let avoidanceCheck = Math.round((Math.random()*100));

        //4a. If that number is higher than the defenders avoidance, no dodging for them
        if (avoidanceCheck >= defendingUnit.totalAvoidance){

            //Sum up our dmg and bonusDmg
            let totalDmg = attackingUnit.totalDmg;

            //Subtract it from defenders hp
            defendingUnit.hp -= totalDmg;

            //See if they're at or below zero, delete them from their squad if they are
            if(defendingUnit.totalHp <= 0){
                checkHitPoints(defendingUnit, defendingArmy);
            }
        } 
        //4b. If the avoidanceCheck is lower than the defender's avoidance, they dodge the attack and all dmg
        else{
            console.log(`${defendingUnit.name} avoided the attack! No dmg done!`)
        }
    } 
    //2b. Otherwise, the player misses.
    else {
        console.log(`Its a miss!`)
        return
    }
}

// Default functions that run at start go here //
console.log(welcomeMsg);
callTheSquad(defaultSquad);
promptUserToUpgrade(defaultSquad.units);