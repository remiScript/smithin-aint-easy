// GET THAT JSON DATA, SON -----------------------------------------
//This is a single data pull, stores one of the json files as a variable
function fetchJSONData(data) {
  //console.log('fetching: ' + data);
    return fetch(data) // Fetch the JSON file
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json(); // Parse the JSON from the response
    })
    .then((data) => {
      retrievedList = data; // Assign the fetched data to the outer `values` variable
      //console.log('Data fetched!')
      return retrievedList;
    })
    .catch((error) => {
      console.error('Error loading JSON:', error); // Log any errors
    });
}

//Here we initialize these variables as strings, the relative file paths. This will be used in our async data pull function
const listOfAbilities = '../../Data/abilities.json';
const listOfMonsters = '../../Data/bestiary.json';
const listOfHeroes = '../../Data/heroClasses.json';
const listOfItems = '../../Data/items.json';
const listOfMessages = '../../Data/messages.json';
const listOfQuests = '../../Data/quests.json';

//We're defining these here because (I think) we want them in the global scope, this may change
let abilities;
let bestiary;
let heroClasses;
let items;
let messages;
let quests;

async function loadData() {
  // This populates all of the json data into objects we can access
      
      abilities = await fetchJSONData(listOfAbilities).then((response) => {
        abilities = response;
        return abilities;
      });
      
      bestiary = await fetchJSONData(listOfMonsters).then((response) => {
        bestiary = response;
        return bestiary;
      });
      
      heroClasses = await fetchJSONData(listOfHeroes).then((response) => {
        heroClasses = response;
        return heroClasses;
      });
      
      items = await fetchJSONData(listOfItems).then((response) => {
        items = response;
        return items;
      });
      
      messages = await fetchJSONData(listOfMessages).then((response) => {
        messages = response;
        return messages;
      });

      quests = await fetchJSONData(listOfQuests).then((response) => {
        quests = response;
        return quests;
      });
}
//---------------------------------------------------------------------
  


























// PLAYER ----------------------------------------------------------------
//Login check, need a real one
function checkIfLoggedIn(){
  return true;
}

//HOW ARE WE STORING/CREATING/UPDATING USER ACCOUNTS??? 
//NEED TO DETERMINE/LEARN DATABASE USAGE/SYNTAX. POSTGRES? SQLITE?
  
//Dummy data for login prototyping
let dummyAcct = {
    name: 'DummyName1',
    mostWavesCompleted: 3,
    monstersDefeated: ['Dragon', 'Troll'],
    questsCompleted: ['Goblin Encampment', 'Danger Dogs'],
    itemsUnlocked: ['Mace', 'Shield'],
    classesUnlocked: ['Squire', 'Paladin']
}

//Create player session data (stuff that is in every session):
  //Username (or guest)
  //Gold Quantity
  //Wave (start at zero)
  class PlayerSession {
    constructor(
      //default values, for guest sessions
      name = "Guest", 
      mostWavesCompleted = 0, 
      monstersDefeated = [], 
      questsCompleted = [],
      itemsUnlocked = [], 
      classesUnlocked = [],
    ) {
      //pass in player data, if logged in
      this.name = name,
      this.mostWavesCompleted = mostWavesCompleted,
      this.monstersDefeated = monstersDefeated,
      this.questsCompleted = questsCompleted,
      this.itemsUnlocked = itemsUnlocked,
      this.classesUnlocked = classesUnlocked
    }
    
    addItemToInventory(item) {
      this.inventory.push(item);
      console.log(`${item.name}  was added to inventory!`)
      this.inventory.forEach(item => {
        console.log(`${item.name}`)
      })
    }
    removeItemFromInventory(item){
      const index = this.inventory.indexOf(item);
      if(index !== -1) {
        this.inventory.splice(index, 1)
      }
    }
    addGold(amt) {
      this.gold += amt;
    }
    subtractGold(amt) {
      this.gold -= amt;
    }
  }
//-----------------------------------------------------------------------------

  









//GAME FUNCTIONS (that I otherwise am not sure what to group them with)
function generateShopkeepersWares(items){
  let forSaleItemsArray = items.filter((item) => item.tier > 0);
  //console.log('New items are for sale!')
  //console.log(forSaleItemsArray);
  return forSaleItemsArray;
}
function generateBuybackTable(){
  console.log('Create a function so the player can buy-back stuff they sell.')
}





//CONSOLEFUNCTIONS (Instead of a UI)  ---------------------------------------------------------------------
function generateConsoleUI() {
  //Emulate the Game UI, giving the user a list of things they can do
  console.log("OPTIONS:");
  console.log("1. Player status (WORKING!)")
  console.log("2. Shop (WORKING!)")
  console.log("3. Quests -WIP")
  console.log("4. Rankings -WIP")
  console.log("5. Inventory (WORKING!)")
  console.log("6. Bestiary (WORKING!)")
  console.log("7. Classes (WORKING!)")
  console.log("8. Squad (WORKING!)")
  console.log("9. Options -WIP")
  console.log("10. Console functions")
}

function seePlayerStatus(p){
  console.log(`Username: ${p.name}`)
  console.log(`Gold: ${p.gold}`)
  console.log(`Rank: ${p.mostWavesCompleted} (Currently set to Most Waves Completed)`)
}

function accessShop(psd){
  console.log('Shop Menu:')
  //What even is the shop? It's a list of items, available for sale, but what items?
  //At first, I want all items to be available for sale.
  //Later on, maybe there's some RNG involved to spice the game up.
  let choice = prompt('Press 1 to buy. Press 2 to sell.')

  //BUY LOGIC -------------------------------------------------
  if(choice == 1) {
    console.log('ITEMS FOR SALE:')
    //fsl is an acronym for "forSaleList"
    let fsl = psd.forSaleList;
    //this variable is just so we don't type out psd.gold multiple times
    let playerGoldAmt = psd.gold;

    //list items for sale and their price
    fsl.forEach(item => {
      console.log(`${fsl.indexOf(item)}. ${item.name}:         ${item.cost}GP`);
      }
    )
    //ask player for selection (console version)
    let itemChosen = prompt('What are ya buyin? Enter the corresponding number.')
    itemChosen = fsl[itemChosen];

    //If the player can't afford the item, return to top menu (console version)
    console.log(`We will need to check if you have enough gold...`)
    if(playerGoldAmt < itemChosen.cost){
      console.log('...nope! not enough gold')
      return
    }

    //If they can...
    console.log('...You do!')
    console.log(`Your gold: ${playerGoldAmt}`)

    //Next, subtract that gold.
    psd.subtractGold(itemChosen.cost);

    //Here's where we verify that it actually affected the psd object, not just in this scope
    console.log(`Your gold now: ${psd.gold}`)

    //Then, add the item to the squad's inventory.
    psd.addItemToInventory(itemChosen);

    console.table(psd.inventory)

    console.log(`Buy function ending.`)

    return;
};
//SELL LOGIC ---------------------------------------------------
  if(choice == 2) {
    //inv for shorthand
    let inv = psd.inventory;

    //playergoldamt for shorthand
    let playerGoldAmt = psd.gold;
    // resaleModifier, might need to store this elsewhere? not sure
    let resaleModifier = 2;

    //List items and resale value for player
    console.log('ITEMS TO SELL:')
    console.log('Resale Value is 2gp lower than merchant price')
    inv.forEach(item => {
      let resaleValue = (item.cost - resaleModifier)
      console.log(`${inv.indexOf(item)}. ${item.name}: ${resaleValue}`)
    })  

    //prompt for selection
    let itemChosen = prompt('What are ya selling? Enter the corresponding number.')
    itemChosen = inv[itemChosen];

    //apply resaleModifier to transaction
    let resaleValue = itemChosen.cost - resaleModifier;

    //gold, pre-sale
    console.log(`Your gold: ${playerGoldAmt}`)

    //add gold, verify
    console.log(`Next, add that gold.`)
    psd.addGold(resaleValue)
    console.log(`Your gold now: ${psd.gold}`)

    //Then, remove the item to the squad's inventory, and verify.
    psd.removeItemFromInventory(itemChosen)
    console.table(inv)

    //console version
    console.log('Sell function ending.')
    return;

  }
}

function accessQuests(psd){
  console.log('Quest Menu:')
  //quest database? quest generator? maybe start with fixed quests, move to randomized ones in the future
  //quest is described, shows enemies that soldiers will face, info is limited and more is revealed as you defeat more of the enemies

  //------------------------------------------------------------------VVVV
  //NOTE: This generates a table every time you access quests, you'll want to move this to only happen once after the last quest is completed.
  //Otherwise players could just re-load quests again and again.
  let questsAvailable = generateQuestTable(psd);
  //------------------------------------------------------------------^^^^^


  console.log(`Quests Available:`)
  console.log(' ')
  console.log(`Tier: ${psd.currentWave}`)
  questsAvailable.forEach(quest => {
      console.log(`Quest #${(questsAvailable.indexOf(quest))+1}------------------------`)
      console.log(`${quest.name}`)
      console.log(`${quest.flavorText}`)
      console.log(`-------------------------------------`)
      console.log(' ')
    
  });
  let choiceQ = prompt(`Choose your next quest!`)
  let nextQuest = questsAvailable[choiceQ-1];
  
  console.log(`You've Chosen:`);
  console.log(`${nextQuest.name}`);
  console.log(`-------------------------`);
  let choice = prompt('Should the soldiers bring back gold, or loot? Press 1 for gold.')
  //How will loot be generated? we have items, and i was sure to include tiers

  //This is where the prep ends, and the soldiers depart. Success or failure will be routed here
  if(embarkOnQuest(psd, nextQuest)){
    
  let reward; 
  if(choice == "1"){
    reward = nextQuest.gold
    psd.gold += reward;
    console.log(`${reward} gold was added! You now have ${psd.gold} gold!`)
  } else {
    reward = generateLootTable(nextQuest)
    psd.addItemToInventory(reward);
  }
  //add the quest to the list of quests the player has completed
  //flesh this out so it only adds the quest to the list if it's the player's first time
  //consider having stacked rewards for multiple completions? unlock goblin as a playable class if you complete this quest 10 times?
  psd.questsCompleted.push(nextQuest.name)
  console.table(psd);

  //advance the current wave
  psd.currentWave++;
  } else {
    console.log(`-----------------------------------`)
    console.log(`-----------------------------------`)
    console.log('EVERYONE DIED')
    console.log(`-----------------------------------`)
    console.log(`-----------------------------------`)
    //GAME OVER STATE
    psd.openGame = false;
    //WHERE DO WE GO FROM HERE?
    //STATS SCREEN (OF YOUR SESSION?)
    //NEW GAME?
    

    //COMMIT UPDATED DATA TO PLAYER OBJECT/ACCOUNT
  }

    
  //you tell the soldiers what to bring back, loot or gold
  // a big part of the game is choosing wisely
  //this will send soldiers off to fight, so it'll initiate combat, open the combat theater
  //it will have to read the results of combat, and give the player rewards, depending
  //function for creating quests, defining them
  //part of a quest: name, description, tier, enemies, rewards, completion status
}

function generateLootTable(quest){
  //this function will determine the loot reward for a quest
  //it keeps the rewards from being static and determined in the JSON files
  //it also lets me change how i determine the rewards

  //for now, rewards will just be 1 item from the pool of items of the same tier
  //ex: tier 1 quest reward = random tier 1 item
  let tier = quest.tier;
  let possibleRewards = [];
  items.forEach(item => {
    if(item.tier == tier) {
      possibleRewards.push(item)
    }
  });
  
  let selection = Math.ceil(Math.random()*possibleRewards.length)

  return possibleRewards[selection];
}

function generateQuestTable(playerSessionData){
  //this function will generate a table of available quests, based on criteria set here
  //the first version is simple: whatever wave the player is on, we generate a few quests of that wave
  let tier = playerSessionData.currentWave;
  let possibleQuests = [];
  quests.forEach(quest => {
    if(quest.tier == tier) {
      possibleQuests.push(quest);
    }
  })
  return possibleQuests

}

function embarkOnQuest(psd, qData){
  //this function will:
  //  Flavor: This is where the soldier leave town, win or lose, the smith can do nothing until they return
  //  Enemy squad will be generated
  let questMobDeets = qData.enemyList.map(detail => {
    if(typeof detail === 'string'){
      console.log(`${detail} is a string.`)
      let mob = mobLookup(detail, bestiary);
      console.log(detail)
      return mob;
    }
    return detail;
  });
  console.log(questMobDeets)
  let questMobs = createSquad(...questMobDeets)
  console.table(questMobs);
  //HERE
  //NEXT STEPS:
  //So the enemy mob has been generated, I think we're ready to start creating COMBAT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // COMBAT TIME IS HERE-----------------------BONESAW IS READY---------------------------------
  //  This initiates combat
  //    Open the combat theatre, 
  //    Player will watch, 
  //    There will be a results screen
  //  Much of this functionality will be in other functions, but called here
  //  It will return a success or failure state, each of which will trigger different events
  let battle = new Combat(psd.squad, questMobs);
  return battle.startCombat();
}

class Combat {
  constructor(player, mobs) {
    this.playerSquad = player;
    this.mobs = mobs;
    this.currentAttackers = player;
    this.currentDefenders = mobs;
  }

  startCombat() {
    let roundCounter = 1;
    while (this.currentAttackers.some(unit => unit.currentHp > 0) && this.currentDefenders.some(unit => unit.currentHp > 0)) {
      roundCounter++
      if(roundCounter >= 20){
        console.log('Too many rounds')
        return;
      }
      console.log(`\n--- Round #${roundCounter} ---`);
      this.executeRound();
      this.swapTurns();
    }
    let victors = this.getVictoriousTeam();
    console.log(`Combat is over! ${victors} are victorious!`);

    //NEXT TIME: LETS SIFT THIS OUT INTO ITS OWN FUNCTIONALITY 
    if(victors == "Player"){
      return true;
    } else if(victors == "Mobs"){
      return false;
    } else {
      console.log("It's a draw! Wait.... what?")
    }

  }

  executeRound() {
    this.currentAttackers.forEach(unit => this.attack(unit))
  }

  attack(a) {
    if(a.currentHp <= 0){
      console.log(`${a.variantName} cannot attack, it has been slain!`);
      return;
    }

    let target = this.getNextTarget();
    if (!target) {
      console.log(`Nothing to attack. ${a.variantName} and their forces win!`)
      return;
    }

    if(!this.rollHit(a)) {
      //check for a miss
      console.log(`${a.variantName} missed!`)
      return;
    }

    if(this.rollDodge(target)){
      console.log(`${a.variantName}'s attack was dodged!`);
      return;
    }

    this.applyDamage(a,target)
  }

  getNextTarget() {
    return this.currentDefenders.find(unit => unit.currentHp > 0);
  }
  rollHit(a){
    //if true = hit
    //if false = miss
    return a.score() <= a.totalToHit;
  }
  rollDodge(d) {
    //if true = dodge successful
    //if false = failed to dodge
    return d.score() < d.totalAvoidance
  }

  applyDamage(a, d){
    d.currentHp -= a.totalDmg;
    console.log(`${a.variantName} hit ${d.variantName} for ${a.totalDmg}. HP left: ${d.currentHp}!`);

    if (d.currentHp <= 0) {
      console.log(`${d.variantName} has died!`);
    }
  }

  swapTurns() {
    [this.currentAttackers, this.currentDefenders] = [this.currentDefenders, this.currentAttackers];
  }

  getVictoriousTeam() {
    return this.playerSquad.some(unit => unit.currentHp > 0) ? 'Player' : 'Mobs' 
  }

}

function accessRankings(){
  console.log('Rankings Menu:')
}

function accessInventory(psd){
  //Right now, this just shows the player their items
  let inv = psd.inventory;
  console.log('Inventory Menu:')
  //Break down each item, display its properties
  inv.forEach(item => {
    console.log(`-------SLOT ${inv.indexOf(item)} -----------`)
    Object.entries(item).forEach(([key, value]) => {
      console.log(`${key}: ${value}`)
    }
    )
    console.log(`----------------------------------------`)
    //Do we want a button to delete items from the inventory? (Web Version)
})}

function accessBestiary(bst, psd){
  //Encyclopedia of monsters!
  //These should all be sillhouettes, and once you defeat them, they permanently unlock in your account
  //Eventually i'll layer this, so defeating 1 unlocks the portrait and name, defeat more to unlock more info
  let unlockedMonsters = psd.monstersDefeated;
  console.log('Defeated: ');
  console.log(unlockedMonsters);
  console.log('Bestiary Menu:')
  bst.forEach(monster => {
    //console.log(monster.name)
    if(unlockedMonsters.includes(monster.name)) {
      console.log(`-------Monster #${bst.indexOf(monster)} -----------`)
      Object.entries(monster).forEach(([key, value]) => {
      console.log(`${key}: ${value}`)
      }
    )
    console.log(`----------------------------------------`)
    }
    else {
      console.log(`#${bst.indexOf(monster)}: ???`)
    }
  });

}

function accessClasses(cls, psd){
  //Encyclopedia of classes!
  //These should all be sillhouettes, with requirements listed. Once you meet them, they permanently unlock in your account.
  //Still need a function to upgrade the classes of the units in your squad
  let unlockedClasses = psd.classesUnlocked;
  console.log('Classes Menu:')
  cls.forEach(heroClass => {
    //console.log(heroClass.name)
    if(unlockedClasses.includes(heroClass.name)) {
      console.log(`-------Hero Class: ${cls.indexOf(heroClass)} -----------`)
      Object.entries(heroClass).forEach(([key, value]) => {
      console.log(`${key}: ${value}`)
      }
    ) 
    console.log(`----------------------------------------`)
    }
    else {
      console.log(`Class #${cls.indexOf(heroClass)}: ???`)
      console.log(`Requires: ${heroClass.requirements} to unlock.`)
    }
  });

}

function accessSquad(psd){
  //This menu should show each of your units
  //This is also where we equip the units with items
  //should have something that points to classes menu
  //this will connect with the inventory
  let sqd = psd.squad;
  let inventory = psd.inventory;
  console.log('Squad Menu:')
  console.log(sqd);
  console.log(`1. Equip item`)
  console.log(`2. Remove item`)
  console.log(`3. See squad stats`)
  console.log(`4. Check item compatibility`)
  let choice = prompt(`What will you do next?`)
  switch (choice) {
    case '1':
      //equip item
      //pick the unit, then the item
      //logic for anything that would make it invalid, such as being uneqippable
      //does the slot need to be empty first? ideally not
      //it should call the unequip item function if we're swapping items
      let whoEquip = prompt('Which unit are we equipping?');
      let whatSlotEquip = prompt('Which slot are we equipping?');
      inventory.forEach((invItem, index) => {
        console.log(`${index}. ${invItem.name}`)
      })
      let whatItemEquip = prompt('Which item?')
      sqd[whoEquip].equipItem(whatSlotEquip, inventory[whatItemEquip]);
      break;
    case '2':
      //unequip item
      console.log(sqd)
      sqd.forEach((member, index) => {
        console.log(`${index}. ${member.name}`)
        console.log(`--> Weapon: ${member.weapon}`)
        console.log(`--> Armor: ${member.armor}`)
        console.log(`--> Accessory: ${member.accessory}`)
      });
      let choiceUnitUnequip = prompt('Which unit are we unequipping?');
      let choiceSlotUnequip = prompt('Which slot are we unequipping?');
      sqd[choiceUnitUnequip].unequipItem(choiceSlotUnequip);
      break;
    case '3':
      sqd.forEach(member => {
        console.log(`${member.displayStats()}`)
        console.log('--------------------------------')
        console.log('--------------------------------')
        console.log('--------------------------------')
        console.log('--------------------------------')
      });
      break;
}
}

function accessOptions(){
  console.log('Options Menu:')
}

function displayMessage(messageName) {
  //Console version of function that lets me use the name property to output a message.
  //ex: Welcome Message, Tutorial 1, Tutorial 2
  messages.forEach(element => {
    if(element.name == messageName){
      console.log(element.heading);
      console.log(element.bodyCopy);
    }
  });
  
}
//---------------------------------------------------------------------------------------

  
//UNIT/SQUAD CREATION --------------------------------------------------------------
//We have the blueprints for the squires over in bestiary.json. We need to write a function that invokes a constructor X times to make Y units.
//This will also be what creates enemy groups for quests
class Unit {
    constructor(createdUnit){
      console.log(createdUnit)
        this.name = createdUnit["name"], 
        //PROBLEM IS HERE BOOKMARK
        this.variantName = this.randomizer(createdUnit.variantNames),
        this.goldReward = createdUnit["goldReward"], 
        this.image = createdUnit["image"], 

        this.rawHp = createdUnit["rawHP"], 
        this.bonusHpFromWeapon = 0,
        this.bonusHpFromArmor = 0,
        this.bonusHpFromAccessory = 0,
        this.bonusHpFromEffect = 0, 
        this.maxHp = this.calcMaxHp,
        this.currentHp = this.maxHp,

        this.rawDmg = createdUnit["rawDmg"], 
        this.bonusDmgFromWeapon = 0, 
        this.bonusDmgFromArmor = 0,
        this.bonusDmgFromAccessory = 0,
        this.bonusDmgFromEffect = 0, 
        this.totalDmg = this.calcTotalDmg,

        this.rawAvoidance = createdUnit["rawAvoidance"], 
        this.bonusAvoidanceFromWeapon = 0, 
        this.bonusAvoidanceFromArmor = 0, 
        this.bonusAvoidanceFromAccessory = 0, 
        this.bonusAvoidanceFromEffect = 0, 
        this.totalAvoidance = this.calcTotalAvoidance,

        this.toHit = createdUnit["rawToHit"],
        this.bonusToHitFromWeapon = 0,
        this.bonusToHitFromArmor = 0,
        this.bonusToHitFromAccessory = 0,
        this.bonusToHitFromEffect = 0,
        this.totalToHit = this.calcTotalToHit,

        this.weapon = createdUnit["defaultWeapon"], 
        this.armor = createdUnit["defaultArmor"], 
        this.accessory = createdUnit["defaultAccessory"]
    }

    get calcMaxHp() {
      return this.rawHp + this.bonusHpFromWeapon + this.bonusHpFromArmor + this.bonusHpFromAccessory + this.bonusHpFromEffect;
    }

    get calcTotalDmg(){
        return this.rawDmg + this.bonusDmgFromWeapon + this.bonusDmgFromArmor + this.bonusDmgFromAccessory + this.bonusDmgFromEffect;
    }

    get calcTotalAvoidance(){
        return this.rawAvoidance + this.bonusAvoidanceFromWeapon + this.bonusAvoidanceFromArmor + this.bonusAvoidanceFromAccessory + this.bonusAvoidanceFromEffect;
    }

    get calcTotalToHit(){
        return this.toHit + this.bonusToHitFromWeapon + this.bonusToHitFromArmor + this.bonusToHitFromAccessory + this.bonusToHitFromEffect;
    }

    randomizer(arr){
      console.log(arr)
      let variantIndex = Math.floor(Math.random()*arr.length);
      return arr[variantIndex]
    }

    score(){
      return Math.floor((Math.random()*100));
    }

    attributeModifier(slot, item){
      console.log('running attribute modifier')
      //slot is weapon/armor/accessory/effect (buff/debuff, working on that)
      //this is how we dynamically connect to the right stats
      //we can refer to keys with arguments, but not partial keys
      //so, we have to make our own
      let bonusHpFromSlot = `bonusHpFrom${slot.charAt(0).toUpperCase() + slot.slice(1)}`
      let bonusDmgFromSlot = `bonusDmgFrom${slot.charAt(0).toUpperCase() + slot.slice(1)}`
      let bonusAvoidanceFromSlot = `bonusAvoidanceFrom${slot.charAt(0).toUpperCase() + slot.slice(1)}`
      let bonusToHitFromSlot = `bonusToHitFrom${slot.charAt(0).toUpperCase() + slot.slice(1)}`

      if(!item){
        this[slot] = "None";      
        this[bonusHpFromSlot] = 0;
        this[bonusDmgFromSlot] = 0;
        this[bonusAvoidanceFromSlot] = 0;
        this[bonusToHitFromSlot] = 0;
      } 
      else {
      this[slot] = item.name;
      this[bonusHpFromSlot] = item.plusHP;
      this[bonusDmgFromSlot] = item.plusDmg;
      this[bonusAvoidanceFromSlot] = item.plusAvoidance;
      this[bonusToHitFromSlot] = item.plusToHit;
      }
      this.maxHp = this.calcMaxHp;
      this.totalDmg = this.calcTotalDmg;
      this.totalAvoidance = this.calcTotalAvoidance;
      this.totalToHit = this.calcTotalToHit;
    }

    adjustHp(amt) {
      //the first arg in the math.min bit keeps us from overhealing
      //say the amt is 5, and our currentHp is 8, maxHp is 10
      //that totals 13, which is over the max, so we set currentHp to 10
      //and that whole thing is houses in the math.max part, which sets currentHp to zero if we have negative health
      this.currentHp = Math.max(0, Math.min(this.maxHp, this.currentHp + amt));
      console.log(`HP: ${this.currentHp}/${this.maxHp}`)
      return this.currentHp;
    }

    displayStats(){
      console.log(`${this.name}'s Stats:`)
      console.log(`HP: ${this.currentHp}/${this.maxHp}`)
      console.log(`Weapon: ${this.weapon}`)
      console.log(`Armor: ${this.armor}`)
      console.log(`Accessory: ${this.accessory}`)
      console.log(`-----------------------------`)
      return
    }

    equipmentCompatabilityChecker(item, hcl){
      //hcl is "Hero Class List"
      const answer =  hcl.some(heroClass => 
        heroClass.name === this.name && heroClass.canEquip.includes(item.name)
      )
      return answer
    }

    compatibilityList(){
      //for each hero class
      heroClasses.forEach(element => {
        //if their name matches the arg
        if(element.name == this.name) {
          //check each item in the items db
          items.forEach(item => {
            //if they pass the compatibility checker
            if(this.equipmentCompatabilityChecker(item, heroClasses)){
              console.log(`${this.name} can equip ${item.name}`)
            }
            else {
              console.log(`${this.name} can't equip ${item.name}`)
            }
          });
        }
        
      });
    }

    equipItem(slot, item){
      if(this.equipmentCompatabilityChecker(item, heroClasses) == true){
        //slot is a number, item is an object
        console.log(`Slot is: ${slot}`);
        console.log(`Item is: ${item.name}`);
        switch (slot) {
          case '1':
            if(this.weapon == "None") {
              this.attributeModifier('weapon', item);
            }
            else {
              this.unequipItem(slot);
              this.attributeModifier('weapon', item);
            }
            break;
          case '2':
            if(this.armor == "None") {
              this.attributeModifier('armor', item);
            }
            else {
              this.unequipItem(slot);
              this.attributeModifier('armor', item);
            }
            break;
          case '3':
            if(this.accessory == "None") {
              this.attributeModifier('accessory', item);
            }
            else {
              this.unequipItem(slot);
              this.attributeModifier('accessory', item);
            }
            break;
        }
        return
      }
      else {
          console.log('it is false?')
      }
    }

    unequipItem(slot){
      //slot is provided via a prompt in the console version
      //in the UI version, make sure you supply the argument correctly
      switch (slot) {
        case '1':
          if(this.weapon !== "None") {
            this.attributeModifier('weapon')
          }
          else {
            console.log('No weapon equipped.')
          }
          break;
        case '2':
          if(this.armor !== "None") {
            this.armor == "None"
          }
          else {
            console.log('No armor equipped.')
          }
          break;
        case '3':
          if(this.accessory !== "None") {
            this.accessory == "None"
          }
          else {
            console.log('No accessory equipped.')
          }
          break;
      }
      return
    }

    // upgradeUnit(x){
    //     //x is a number, it selects which upgrade we want from the upgradesArray
    //     const selectedUpgrade = upgradesArray.find(upgrade => upgrade.name === x);
    //     console.log("You picked: " + selectedUpgrade.name);
    //     const statToUpgrade = selectedUpgrade.effect;
    //     console.log("That will upgrade a units: " + statToUpgrade);
    //     this[statToUpgrade] += selectedUpgrade.amount;
    //     console.log(`${this.name} upgraded!`)
    // }

}



function createSquad(...args) {
  //This only works if the arguments provided are bestiary[x]
  //Need to add functionality where you can put in strings, too, and it'll lookup the bestiary for units with matching names
  //Not neccessary, but would be nice
  const squad = []; // Array to hold the created units
  let i = 0;

  while (i < args.length) {
      
      let unitData = args[i];
      //console.log(unitData)
      // Check if the argument is a string (indicating a unit type)
      if (typeof unitData.name === 'string') {
          const nextArg = args[i + 1];

          // Check if the next argument is a number (indicating count)
          if (typeof nextArg === 'number') {
              for (let j = 0; j < nextArg; j++) {
                  squad.push(new Unit(unitData));
              }
              i += 2; // Skip to the next unit type
          } else {
              // Create one instance if no count is provided
              squad.push(new Unit(unitData));
              i += 1; // Move to the next argument
          }
      } 
      else {
          throw new Error(`Invalid argument at position ${i}: ${unitData}`);
      }
  }
  
  return squad;
}
function mobLookup(mobName, bst){
  console.log(mobName);
  console.log(bst)
  //This function will take strings and find the corresponding unit in the bestiary
  return bst.find(mobEntry => {
    return mobEntry.name === mobName;
  }) || false;
}
//-------------------------------------------------------------------------------------

// INVENTORY FUNCTIONALITY -----------------------------------------------------------------
// Need a function for adding, removing

// Maybe a function for listing, organizing?
// Need a function for checking if an item is in the player's inventory

//-------------------------------------------------------------------------------------


// NEW GAME SETUP FUNCTION --------------------------------------------------------------------
function newGameSetup(){

  //1. Generate default game data
    //a: Gold
    let gold = 50;

    //b: Inventory
    let inventory = [items[9], items[12], items[4]];

    //c: The Squad. Let's start with 6.
      //Squire is at index 144 (need to update function so it uses the index of the unit)
    let squad = createSquad(bestiary[144], 6);
    
    //d: Wave
    let currentWave = 1;

    //e: Starting shopkeeper's wares
    let forSaleList = generateShopkeepersWares(items);
    //console.log("For Sale List: ")
    //console.log(forSaleList)

    //f: Game is running status
    let openGame = true;
    
  //2. Generate the UI (Game UI.txt)
    //In the console version, this will be a list with prompts to move in and out of the menus, like an old pc game or dos application
    //Don't be TOO strict here, you can just call functions, as long as they're top level (meaning you just call inventory() and it does the rest)
    //This will pull up:
      //Player Menu (004 Player UI.txt)
      //Squad at a glance Menu (010 Squad at a glance Menu.txt)
      //Context Window
      //Options Menu (007 Options Menu.txt)
    //let playerChoice = askPlayerWhatsNext(user);

    return {gold, inventory, squad, currentWave, forSaleList, openGame}

}
//-------------------------------------------------------------------------------

// PROMPT PLAYER FOR A CHOICE
function askPlayerWhatsNext(playerSessionData) {
  //console.log(playerSessionData)
  //a. Store player choice, as we're going to carry out our next action based on the user
  generateConsoleUI();
  let lastOptionChosen = prompt('What will you do next?');
  switch (lastOptionChosen) {
    case '1':
      seePlayerStatus(playerSessionData);
      break;
    case '2':
      accessShop(playerSessionData);
      break;
    case '3':
      accessQuests(playerSessionData);
      break;
    case '4':
      accessRankings();
      break;
    case '5':
      accessInventory(playerSessionData);
      break;
    case '6':
      accessBestiary(bestiary, playerSessionData);
      break;
    case '7':
      accessClasses(heroClasses, playerSessionData);
      break;
    case '8':
      accessSquad(playerSessionData);
      break;
    case '9':
      accessOptions();
      break;
    case '10':
      generateConsoleUI();
      break;
  }
}

// GAME SESSION SETUP
function gameSession() {
  //0. GAME SESSION CONCLUSION VARIABLE
    //0 means it is still in session
    //1 means the session has ended
    let sessionConclusion = 0;

  //1. PLAYER DATA
    //a: Create the session object that is going to hold all of our player data, and be used to update their account when the game ends.
    let playerSessionData;

    //b: Check if player is logged in:
    if(checkIfLoggedIn() == false) {
        //If not... 
        //prompt them to login with perks of having an account
        displayMessage('Account Perks');

        //CTA, to make them sign up
        let accountDecision = prompt('Make an account? y/n')

        if(accountDecision == 'y'){
          //Some kind of function that brings you to account creation
          console.log('Thanks for making an account!')
        } else {
          console.log('Thats okay, lets play!')
          playerSessionData = new PlayerSession();
        }
    } 
    else {
        //If they have an account, some data is going to be passed in from the accounts database (probably accounts.json)
          //Username
          //Prior bestiary data (enemies they've defeated)
          //Maybe items they've bought before (discount them in shop, or add them to shop inventory 24/7)
        playerSessionData = new PlayerSession(
          dummyAcct.name, 
          dummyAcct.mostWavesCompleted, 
          dummyAcct.monstersDefeated, 
          dummyAcct.questsCompleted,
          dummyAcct.itemsUnlocked, 
          dummyAcct.classesUnlocked
        )

        //Welcome the player, with account name, and start the game
        console.log(`Welcome, ${playerSessionData.name}!`)
    }

    //We now have the right player object for this session. 
    //Win or lose, we will have to update it, depending on how the game goes.
    console.log('PlayerData established. Starting game.')
    
  while(sessionConclusion == 0) {
    //2. SETUP NEW GAME/RUN/ROUND
      //a: Create default "per game" data, reset gold, default squad
    let newGameData = newGameSetup(playerSessionData);

    //Then, map it onto the PlayerSession object
    playerSessionData.gold = newGameData.gold;
    playerSessionData.inventory = newGameData.inventory;
    playerSessionData.squad = newGameData.squad;
    playerSessionData.currentWave = newGameData.currentWave;
    playerSessionData.forSaleList = newGameData.forSaleList;
    playerSessionData.openGame = newGameData.openGame;
    //console.table(playerSessionData);

  //3. NEXT STEPS
    while(playerSessionData.openGame == true) {
      //We want to prompt the player, asking what they will do next, and present them with options.
      //This will be less direct in the UI version, because the quests button will be glowing, and there will probably be a pop up with tips
      askPlayerWhatsNext(playerSessionData);
    }

    //Functionality for a won/lost game should go here
      //Prompt the player to play again. Same session, but new game.
      let choice = prompt('Well played! Want to try again? 1 for yes.')
      if(choice == '1'){
        console.log('Restarting game!')
      } else {
        sessionConclusion = 1;
      }
  }


  //GAME OVER - Game ends when
  // Victory condition - All waves are cleared
  // Loss condition - Squad is wiped out and player cannot purchase any units
  // Quit condition - Player exits the game, or closes the browser window (consider saving data?)
  // ***Also, should the newGame() function be running as long as the game is open? 
  // Should it run, establish the game, and pass data out to the larger scope?
  console.log('Game session over.')
}

//Wrapper function that ensures data is loaded before program starts---------------------
async function startProgram() {
  //INITIAL DATA PULL/LOAD
  await loadData();
  console.log('data loaded!');
  // RUN THAT SHIT
  main();
}
//---------------------------------------------------------------------------------------

// MAIN PROGRAM FUNCTION, STARTS THE ENTIRE WEBSITE/PROGRAM -----------------------------
async function main() {
  // GAME STARTS HERE, THIS MAY LOOK KINDA PROCEDURAL BUT WE ARE CONTROLLING THE FLOW SOMEWHAT

  let playerChoice = 0;

  // DISPLAY WELCOME MESSAGE
  displayMessage('Welcome Message');
  //Additive language for console version of game
  playerChoice = prompt('Press 1 for new game, 2 for leaderboards, 3 to create an account.')
  //Need function for these 3 things, written elsewhere but called here
  if(playerChoice === '1'){
    gameSession();
  } else if(playerChoice === '2'){
    console.log('leaderboards would be here, but they are under construction')
  } else {
    console.log('account creation would be here, but they are under construction')
  }
}
//---------------------------------------------------------------------------------------


// FUNCTION CALLS ------------------------------------------------------------------------
startProgram();
//-----------------------------------------------------------------------------------------