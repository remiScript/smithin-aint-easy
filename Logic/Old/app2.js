
// This is me trying to figure out how to use our class constructor Unit to reference the JSON object, creatures.json, instead of local data

//app.js was the original, unfinished build, everything in here will be written the new way, or maybe I just use this as a space for isolating functions that need to be rewritten and make an app3.js where everything is written properly


//gotta figure out the importing json, either with fetch, require, or using node
//here's the js code, though
let arrayOfAllMonsters = creatureList.creatures;

class UnitJSON {
    constructor(monster){
        this.name = monster.name, 
        this.weapon = monster.weapon, 
        this.armor = monster.armor, 
        this.accessory = monster.accessory, 
        this.hp = monster.hp, 
        this.dmg = monster.dmg, 
        this.avoidance = monster.avoidance, 
        this.toHit = monster.toHit,
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
function createUnitJSON(name) {
    function findUnit (name) {
        return arrayOfAllMonsters.find(creature => creature.name === name)
    }
    return new UnitJSON(findUnit(name));
}

let squire1 = createUnitJSON('Squire');
console.log(squire1)
console.log('app!')
