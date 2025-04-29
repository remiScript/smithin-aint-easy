// GET THAT JSON DATA, SON -----------------------------------------
//This is a single data pull, stores one of the json files as a variable
function fetchJSONData(data) {
    return fetch(data) // Fetch the JSON file
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json(); // Parse the JSON from the response
    })
    .then((data) => {
      let retrievedList = data; // Assign the fetched data to the outer `values` variable
      return retrievedList;
    })
    .catch((error) => {
      console.error('Error loading JSON:', error); // Log any errors
    });
}

//Here we initialize these variables as strings, the relative file paths. This will be used in our async data pull function
const listOfAbilities = 'Data/abilities.json';
const listOfMonsters = '../../Data/bestiary.json';
const listOfHeroes = '../../Data/heroClasses.json';
const listOfItems = '../../Data/items.json';
const listOfMessages = '../../Data/messages.json';
const listOfQuests = '../../Data/quests.json';

//We're defining these here because (I think) we want them in the global scope, this may change
let JSONAbilitiesData;
let JSONBeastiaryData;
let JSONHeroClassData;
let JSONItemData;
let messages;
let JSONQuestData;

async function loadData() {
  // This populates all of the json data into objects we can access
      
  JSONAbilitiesData = await fetchJSONData(listOfAbilities).then((response) => {
    JSONAbilitiesData = response;
        return JSONAbilitiesData;
      });
      
      JSONBeastiaryData = await fetchJSONData(listOfMonsters).then((response) => {
        JSONBeastiaryData = response;
        return JSONBeastiaryData;
      });
      
      JSONHeroClassData = await fetchJSONData(listOfHeroes).then((response) => {
        JSONHeroClassData = response;
        return JSONHeroClassData;
      });//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

      JSONItemData = await fetchJSONData(listOfItems).then((response) => {
        JSONItemData = response;
        return JSONItemData;
      });
      
      messages = await fetchJSONData(listOfMessages).then((response) => {
        messages = response;
        return messages;
      });

      JSONQuestData = await fetchJSONData(listOfQuests).then((response) => {
        JSONQuestData = response;
        return JSONQuestData;
      });
}
//---------------------------------------------------------------------

//This is going to be the instance of the HeroClassHandler
let heroClasses;

//This is going to be the instance of the QuestHandler
let quests;

//This is going to be the instance of the ItemHandler
let items;

//This is going to be the instance of the BeastiaryHandler
let beastiary;

//This is going to be the instance of the ConsoleHandler
let consoleMode;

let currentSession;

let currentGame;
// let currentAccount;












// PLAYER ----------------------------------------------------------------

//HOW ARE WE STORING/CREATING/UPDATING USER ACCOUNTS??? 
//NEED TO DETERMINE/LEARN DATABASE USAGE/SYNTAX. POSTGRES? SQLITE?
  
//Dummy data for login prototyping
let account1 = {
    name: 'Account1',
    password: 'Password1',
    mostWavesCompleted: 3,
    monstersDefeated: ['Dragon', 'Troll'],
    questsCompleted: ['Goblin Encampment', 'Danger Dogs'],
    itemsUnlocked: ['Mace', 'Shield'],
    classesUnlocked: ['Squire', 'Paladin']
}

let guestAcct = {
  name: 'Guest',
  mostWavesCompleted: 0,
  monstersDefeated: [],
  questsCompleted: [],
  itemsUnlocked: [],
  classesUnlocked: ['Squire']

}

//CLASSES GO HERE ----------------------------------------------------------------------

  class Combat {
    constructor(currentPlayer, mobs) {
      this.playerSquad = currentGame.playerRunState.squad;
      this.mobs = mobs;
      this.currentAttackers = this.playerSquad.roster;
      this.currentDefenders = this.mobs.roster;
      this.currentPlayer = currentPlayer;
    }
    // setGame(game){
    //   this.game = game;
    // }
    startCombat() {
      console.log(this.currentAttackers);
      let turnCounter = 0;
      //while both sides still have living units:
      while (this.currentAttackers.some(unit => unit.currentHp > 0) && this.currentDefenders.some(unit => unit.currentHp > 0)) {
        //increment the turn counter, cap after 100 rounds (probably a bug if we see that many)
        turnCounter++
        if(turnCounter >= 100){
          console.log('Too many rounds')
          return;
        }
        //One side gets their turn, then we swap, and repeat IF both sides have living units
        console.log(`\n--- Turn #${turnCounter} ---`);
        this.executeTurn();
        this.swapTurns();
      }
      //once one side has been wiped out
      let victors = this.getVictoriousTeam();
      return this.endCombat(victors);
    }
  
    endCombat(vic){
      console.log(`Combat is over! ${vic} are victorious!`);
      if(vic == "Player"){
        return true;
      } else if(vic == "Mobs"){
        return false;
      } else {
        console.log("It's a draw! Wait.... what?")
      }
    }
  
    executeTurn() {
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
      if(target.currentHp <= 0 && target.owner == 'computer') {
        beastiary.recordIfFirstKill(this.currentPlayer, target);
      }
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
      //This function only runs once combat is over
      let playerUnits = this.playerSquad.roster;
      //Are all of the player's units dead? if any are alive, we won!
      return playerUnits.some(unit => unit.currentHp > 0) ? 'Player' : 'Mobs' 
    }
  
  }
  
  class HeroClassHandler {
    //Encyclopedia of classes!
    //These should all be sillhouettes, with requirements listed. Once you meet them, they permanently unlock in your account.
    //Still need a function to upgrade the classes of the units in your squad
    constructor(cl) {
      this.classList = cl;
    }
    setGame(game){
      this.game = game;
    }

    listHeroClasses(psd){
      let unlockedClasses = psd.classesUnlocked;
      console.log(`
        Classes Menu
        `)
      this.classList.forEach(hc => {
        if(unlockedClasses.includes(hc.name)) {
          console.log(`Hero Class: ${hc.name}`)
          // console.log(`-------Hero Class: ${this.classList.indexOf(hc)} -----------`)
          // Object.entries(hc).forEach(([key, value]) => {
          // console.log(`${key}: ${value}`)
          // }) 
        } 
        else {
          if(this.heroClassRequirementsChecker(hc, this.game.playerRunState.inventory)){
            let choice = prompt(`
              Ready to unlock ${hc.name}? 
              This will upgrade your units. 
              1.Yes 
              2.No`)
            if (choice == '1'){
              this.unlockHeroClass(hc, currentSession)
              console.log(`You've unlocked ${hc.name}`)
              let units = this.game.playerRunState.squad.roster;
              console.log(units)
              units.forEach(unit => {
                console.log(`Unit: ${unit}`)
                unit.upgradeClass(hc.name);
                console.log(unit)
              })
              // Object.entries(hc).forEach(([key, value]) => {
              // console.log(`${key}: ${value}`);
              // });
            } 
            else {
              console.log(`
                Alright then, keep your units as is.
                Class #${this.classList.indexOf(hc)}: ???
                Requires: ${hc.requirements} to unlock.`)
            }
          } 
          else {
            console.log(`
              Hero Class: ${this.classList.indexOf(hc)} -----------
              ?????
              Requires: ${hc.requirements} to unlock.`)
            //console.log(`?????`)
            //console.log(`Requires: ${hc.requirements} to unlock.`)          
          }
        }
      });
    }
    heroClassRequirementsChecker(heroClass, inventory){
      //console.log(`Can we unlock ${heroClass.name}?`)
      let itemNames = [];
      let requirements = heroClass.requirements;
      inventory.forEach(element => {
        itemNames.push(element.name);
      });
      let invCopy = [...itemNames];
      // console.log(`Our items:`);
      // console.log(invCopy);
      // console.log('--------------------------')
      // console.log(`We need:`);
      // console.log(requirements)
      // console.log('--------------------------')
      //so we're looping thru requirements, reqItem is the current item in that array (in each loop)
      for(const reqItem of requirements){ 
        //console.log(`Requirement: ${reqItem}`)
        //We look at the inventory copy, finding the index of the reqItem
        let index = invCopy.indexOf(reqItem);
        //if it isn't there, we're done
        if(index == -1){
          //console.log(`${reqItem} was not found!`)
          return false;
        } else {
          //console.log(`${reqItem} was at index ${index}`)
        }
        //if it is, remove it from the invCopy array, and loop again
        //this is because the current way the requirements are listed, there is no quantity
        //barbarian needs ["great axe", "great axe", etc.] so once it finds a great axe, it deletes it from the invCopy
        invCopy.splice(index, 1);
      }
      //if it makes it this far, we have everything
      // console.log(`We have everything we need for ${heroClass.name}`)
      return true;
    }
    unlockHeroClass(hc, player){
      player.classesUnlocked.push(hc.name);
    }
  }

  class QuestHandler {
    constructor(ql){
      this.questList = ql;
      console.table(this.questList);
    }
    setGame(game){
      this.game = game;
    }
    openQuestMenu(psd){
      let availableQ = this.generateAvailableQuests();
      console.log('Quest Menu:')
      console.log('Available Quests:')
      console.log('-----------------')
      console.table(availableQ);
      console.log('-----------------')

      let nextQuest = this.chooseQuest(availableQ);
      console.log(`You've Chosen:`);
      console.log(`${nextQuest.name}`);
      console.log(`-------------------------`);

      let reward = this.chooseQuestReward(nextQuest);
      // ---------------
      let outcome = this.embarkOnQuest(nextQuest);
      // ---------------
      this.concludeQuest(nextQuest, outcome, reward, psd); 
    }
    generateAvailableQuests(){
      //this generates a table of available quests, based on criteria
      //first version, simple: whatever wave the player is on, generate quests of that wave
      let possibleQuests = [];
      this.questList.forEach(quest => {
        if(quest.tier == this.game.playerRunState.questTier) {
          possibleQuests.push(quest);
        }
      })
    return possibleQuests;
    }
    chooseQuest(availableQ){
      let choice = prompt(`Choose your next quest!`)
      let nextQuest = availableQ[choice-1];
      return nextQuest;
    }
    chooseQuestReward(quest){
      let reward;
      let choice = prompt('Bring back gold, or loot? 1: Gold, 2: Loot.');
      if(choice == "1"){
        reward = quest.gold;
      } else {
        reward = this.generateLootTable(quest)
      }
      return reward;
    }
    embarkOnQuest(quest){
      let questMobs = this.generateQuestMobs(quest);
      let battle = new Combat(currentSession, questMobs);
      return battle.startCombat();
    }
    generateQuestMobs(quest){
      let questMobInfo = quest.enemyList.map(detail => {
        //details will be strings and numbers, goblin, 3, dragon, 1
        if(typeof detail === 'string'){
          //if its a string, look it up in the beastiary
          let mob = beastiary.mobLookup(detail);
          //and return the actual object for that entry
          return mob;
        }
        return detail;
      });
      let questMobs = new Squad('computer')
      questMobs.roster = questMobs.createSquad(...questMobInfo)
      return questMobs;
    }
    generateLootTable(quest){
        //this function will determine the loot reward for a quest
        //it keeps the rewards from being static and determined in the JSON files
        //it also lets me change how i determine the rewards
      
        //for now, rewards will just be 1 item from the pool of items of the same tier
        //ex: tier 1 quest reward = random tier 1 item
        let possibleRewards = [];
        items.itemList.forEach(item => {
          if(item.tier == quest.tier) {
            possibleRewards.push(item)
          }});
          let selection = Math.ceil(Math.random()*possibleRewards.length)
          return possibleRewards[selection];
        }          
    recieveQuestReward(reward){
      if(Number.isInteger(reward)){
        this.game.playerRunState.gold += reward;
        console.log(`${reward} gold added! Your Gold: ${this.game.playerRunState.gold}`)
      } 
      else {
        let pInventory = this.game.playerRunState.inventory;
        items.addItemToInventory(pInventory, reward);
        console.log(`${reward.name} added to inventory!`)
      }
    }
    concludeQuest(quest, outcome, reward){
      if(outcome){
        this.recieveQuestReward(reward);
        this.game.playerRunState.questsCompleted.push(quest.name)
        //advance the current wave
        this.game.playerRunState.questTier++;
      } else {
        console.log('EVERYONE DIED')
        console.log(`-----------------------------------`)
        console.log(`-----------------------------------`)
        //GAME OVER STATE
        this.game.openGame = false;
      }

    }
  }

  class NPCHandler {
    constructor(){
    }
    generateMerchant(beastiary){
      let referenceUnit = new Unit(beastiary.monsterList[110]);
      let merchant = referenceUnit
      merchant.variantName = `${merchant.name} Merchant`;
      merchant.inventory = items.generateMerchantInventory();
      merchant.gold = 100;
      return merchant;
    }

  }

  class ItemHandler {
    constructor(il){
      this.itemList = il;
    }
    setGame(game){
      this.game = game;
    }
    generateMerchantInventory(){
      let forSaleItemsArray = this.itemList.filter((item) => item.tier > 0);
      return forSaleItemsArray;
    }
    accessShop(){
      //This function will also call UI events in the DOM, to open the menu
      
      //the console version will just auto prompt and move right into trade
      let buyOrSell = prompt(`Buy: 1, Sell: 2`)
      let chosenMerchant = prompt(`Merchants: 1. Pot Mimic. More incoming.`)
      let num = (parseInt(chosenMerchant, 10));
      chosenMerchant = this.game.currentNPCs[num];
      console.log(num);
      console.log(chosenMerchant);
      this.trade(buyOrSell, chosenMerchant);
      
    }
    trade(choice, npc){
      if(choice == 1){
        let transactionType = 'buy'
        console.log('ITEMS FOR SALE:')
        let inv = npc.inventory;
        this.listItems(inv);
        let itemChosen = prompt('What are ya buyin? Enter the corresponding number.')
        if(this.checkForGold(inv[itemChosen])){
          this.processTransaction(transactionType, npc, inv[itemChosen]);
        } 
        else {
          return
        }
      } 
      else {
        let transactionType = 'sell'
        let inv = this.game.playerRunState.inventory
        console.log(inv);
        if(inv.length < 1){
          console.log('Your inventory is empty')
          return;
        }
        console.log('Your inventory:')
        this.listItems(inv);
        let itemChosen = prompt('What are ya sellin? Enter the corresponding number.')
        this.processTransaction(transactionType, npc, inv[itemChosen]);
      }
    }
    processTransaction(transactionType, merchant, item){
      let pInventory = this.game.playerRunState.inventory;
      let mInventory = merchant.inventory;

      if(transactionType === 'buy'){
        this.addItemToInventory(pInventory, item);
        this.removeItemFromInventory(mInventory, item);
        this.game.playerRunState.gold -= item.cost;
        console.log(this.game)
        merchant.gold += item.cost;
      } 
      else if(transactionType === 'sell'){
        this.addItemToInventory(mInventory, item);
        this.removeItemFromInventory(pInventory, item);
        this.game.playerRunState.gold += item.cost;
        console.log(this.game)
        merchant.gold -= item.cost;
        }
      else {
        console.log('Error, this is neither buy nor sell.')
        return;
      }
    }
    addItemToInventory(inventory, item) {
        inventory.push(item);
    }
    removeItemFromInventory(inventory, item){
      const index = inventory.indexOf(item);
      if(index!== -1){
        inventory.splice(index, 1)
        console.log(inventory)
      }
    }
    listItems(x){
      x.forEach(item => {
        console.log
        console.log(`${x.indexOf(item)}. ${item.name}: ${item.cost}GP`);
      });
    }
    checkForGold(item){
      let gold = this.game.playerRunState.gold;
      if(gold < item.cost){
        console.log('...nope!')
        console.log(`Your gold: ${gold}`)
        console.log(`Item cost: ${item.cost}`)
        return false
      } else {
        console.log('You have enough gold.')
        console.log(`Your gold: ${gold}`)
        console.log(`Item cost: ${item.cost}`)
        return true
      }
    }
    accessInventory(game){
      let inv = game.playerRunState.inventory;
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
      })
    }
    equipItem(item, unit){
      console.log(`item: ${item.name}`)
      console.log(`unit: ${unit.variantName}`)
      let slot = item.type;
      console.log(`slot: ${slot}`)
      console.log(unit);
      if(this.equipmentCompatabilityChecker(item, unit) == false){
        console.log('incompatible equipment')
        return;
      }
      if(unit[slot] == 'None'){
        unit.attributeModifier(slot, item)
      } else {
        this.unequipItem(slot, unit);
        unit.attributeModifier(slot, item)
      }

    }
    unequipItem(slot, unit){
      console.log(slot)
      if(unit[slot] == "None") {
        console.log(`No ${slot} equipped.`)
        return;
      } else {
        //calling the attributeModifier without an item unequips that slot
        unit.attributeModifier(slot)
      }

    }
    equipmentCompatabilityChecker(item, unit){
      if(unit.canEquip.includes(item.name)){
        console.log(`${unit.variantName}, the ${unit.heroClass}, can equip ${item.name}.`)
        return true;
      } else {
        console.log(`${unit.name}, the ${unit.heroClass}, cannot equip ${item.name}!!!!!!!!!!`)
        return false;
      }
      
    }
}

  class ConsoleHandler {
    constructor(){
    }
    setGame(game){
      this.game = game;
    }
    generateMenu(){
      //Emulate the Game UI, giving the user a list of things they can do
      console.log("OPTIONS:");
      console.log("1. Player status (WORKING!)")
      console.log("2. Shop (WORKING!)")
      console.log("3. Quests -WIP")
      console.log("4. Rankings -WIP")
      console.log("5. Inventory (WORKING!)")
      console.log("6. Beastiary (WORKING!)")
      console.log("7. Classes (WORKING!)")
      console.log("8. Squad (WORKING!)")
      console.log("9. Options -WIP")
    }
    askPlayerForNextStep(player, game){
      this.generateMenu();
      let choice = prompt('What will you do next? (Main Menu)');
      switch (choice) {
        case '1':
          consoleMode.seePlayerStatus(player, game);
          break;
        case '2':
          items.accessShop(player, game, 0)
          break;
        case '3':
          quests.openQuestMenu(player);
          break;
        case '4':
          accessRankings();
          break;
        case '5':
          items.accessInventory(game);
          break;
        case '6':
          beastiary.accessBeastiary(player);
          break;
        case '7':
          heroClasses.listHeroClasses(player);
          break;
        case '8':
          console.log(game.playerRunState.squad);
          game.playerRunState.squad.squadMenu(game);
          
          break;
        case '9':
          accessOptions();
          break;
      }
    }
    displayMessage(messageName) {
      //Console version of function that lets me use the name property to output a message.
      //ex: Welcome Message, Tutorial 1, Tutorial 2
      messages.forEach(element => {
        if(element.name == messageName){
          console.log(element.heading);
          console.log(element.bodyCopy);
        }
      });
      
    }
    seePlayerStatus(player){
      console.log(player)
      console.log(`Username: ${player.name}`)
      console.log(`Gold: ${this.game.playerRunState.gold}`)
    }
    signUpPrompt(){
      this.displayMessage('Account Perks');

      //CTA, to make them sign up
      let accountDecision = prompt('Make an account? y/n')
      if(accountDecision == 'y'){
          console.log('Thanks for making an account!')
      } else {
        console.log('Thats okay, lets play!')          
      }
      return accountDecision;
    }
    showTitleMenu(){
      this.displayMessage('Welcome Message');
      let choice;
      choice = prompt(`1: New Game, 2: Leaderboards, 3 to create an account.`)
      switch(choice){
        case '1':
          currentGame = new GameHandler();
          this.keepGameRunningInTheConsole();
          break;
        case '2':
          console.log('Leaderboards under construction.');
          break;
        case '3':
          console.log('Account creation under construction.');
          break;
      }
    }
    keepGameRunningInTheConsole(){
      while(currentGame.openGame){
        this.askPlayerForNextStep(currentSession, currentGame);
        if(currentGame.openGame == false){
          //this means we had a game over
          let choice = prompt('Well played! Want to try again? 1 for yes.')
          if(choice == 1){
            currentGame = new GameHandler();
          }
        }
      }

    }
  }

  // eslint-disable-next-line no-unused-vars
  class UIHandler {
    constructor(){

    }
    signUpPrompt(){
      //when starting new game, logged out users will be prompted to sign up
    }
  }

  class BeastiaryHandler {
    constructor(ml){
      this.monsterList = ml
    }
    setGame(game){
      this.game = game;
    }
    accessBeastiary(player){
      console.log(`Beastiary Menu:`)
      console.log(player.monstersDefeated)
      this.showIncompleteBeastiary(player.monstersDefeated);
      }
    showIncompleteBeastiary(md) {
      let monstersDefeated = md;
      this.monsterList.forEach(monster => {
        if(monstersDefeated.includes(monster.name)){
          console.log(`Monster #${this.monsterList.indexOf(monster)}`)
          Object.entries(monster).forEach(([key, value]) => {
            console.log(`${key}: ${value}`)
          }
        )
      }
        else {
          console.log(`#${this.monsterList.indexOf(monster)}: ???`)
        }
      });
    }
    recordIfFirstKill(player, monster){
      if(!player.monstersDefeated.includes(monster.name)){
        player.monstersDefeated.push(monster.name)
        console.log(`${monster.name} added to the Beastiary!`)
      }
    }
    mobLookup(name){
      return this.monsterList.find(entry => {
        return entry.name === name;
      }) || false;
    }
  }

  class Squad {
    constructor(x){
      this.roster = [];
      this.owner = x;
    }
    setGame(game){
      this.game = game;
    }
    squadMenu(game){
      console.log(`Squad Menu:`)
      console.log(this);
      this.listRoster();
      console.log(`1. Equip item`)
      console.log(`2. Remove item`)
      console.log(`3. See squad stats`)
      let choice = prompt(`What will you do next? (Squad Menu)`)
      switch(choice){
        case '1': {
          //if we're equipping items, we need to know the item and the unit
          //then run the equipItem function with those 2 args

          //eventually lets move this into a UI, or console object
          //since its not squad functionality, its menu stuff
          game.playerRunState.squad.listRoster();
          let whoEq = prompt('Who?')
          whoEq = game.playerRunState.squad.roster[whoEq];

          items.listItems(game.playerRunState.inventory)
          let whatEq = prompt('Which item? Ignore prices if this isnt the shop.');
          whatEq = game.playerRunState.inventory[whatEq]

          items.equipItem(whatEq, whoEq)
          break;        
        }
        case '2': {
          //if we're removing items, we need to know the item and the unit
          //then run the unequipItem function with those 2 args

          let whoUn = prompt('Who?')
          whoUn = game.playerRunState.squad.roster[whoUn];

          let whatSlotUn = prompt('Which slot?');
          switch(whatSlotUn){
            case '1':
              whatSlotUn = 'weapon';
              break;
            case '2':
              whatSlotUn = 'armor';
              break;
            case '3':
              whatSlotUn = 'accessory';
              break;
          }
          items.unequipItem(whatSlotUn, whoUn)
          break;
        }
        case '3': {
          this.roster.forEach(unit => {
            unit.displayStats();
          })
          break;
        }
      }
    }

    listRoster(){
      this.roster.forEach(unit => {
        console.log(`Name: ${unit.variantName}`);
        console.log(`Class: ${unit.name}`)
      })
    }
    createSquad(...args){
      const squad = [];
      let i = 0;
      while(i < args.length) {
        let unitData = args[i];
        // Check if the argument is a string (indicating a unit type)
      if (typeof unitData.name === 'string') {
        const nextArg = args[i + 1];

        // Check if the next argument is a number (indicating count)
        if (typeof nextArg === 'number') {
            for (let j = 0; j < nextArg; j++) {
                squad.push(new Unit(unitData, this.owner));
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
    
  }

  class Unit {
    constructor(createdUnit, owner){
        this.name = createdUnit["name"], 
        this.owner = owner;
        this.variantName = this.randomizer(createdUnit.variantNames),
        this.goldReward = createdUnit["goldReward"], 
        this.image = createdUnit["image"];
        if(createdUnit["heroClass"]){
          this.heroClass = createdUnit["name"]
          let matchingHeroClass = heroClasses.classList.find(heroClass => heroClass.name == this.name)
          this.canEquip = matchingHeroClass.canEquip;
        };

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

    upgradeClass(newClass){
      console.log(newClass)
      console.table(this)
      console.log(beastiary)
      let statsReference = beastiary.monsterList.find(unit => unit.name == newClass);
      console.log(statsReference)
      let heroReference = heroClasses.classList.find(unit => unit.name == newClass);
      Object.keys(statsReference).forEach(key => {
        console.log(key)
        //console.log(this.key)
          this[key] = statsReference[key];
      })
      Object.keys(heroReference).forEach(key => {
        this[key] = heroReference[key];
      })
    }

    randomizer(arr){
      if(arr == undefined){
        console.log('no variant names')
        return 'noVariant'
      }
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

      //calling the attributeModifier without an item unequips that slot
      if(!item){
        this[slot] = "None";      
        this[bonusHpFromSlot] = 0;
        this.maxHp = this.calcMaxHp;
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

      //here we check, did maxHp go up?
      let beforeMaxHp = this.maxHp;
      this.maxHp = this.calcMaxHp;
      let afterMaxHp = this.maxHp;

      if(afterMaxHp > beforeMaxHp){
        //If so, let's heal the unit for the difference.
        let difference = afterMaxHp - beforeMaxHp;
        this.currentHp += difference;
      } else if(this.maxHp < this.currentHp){
        //If it dropped below the unit's currentHp, lower it to match.
        let difference = this.currentHp - this.maxHp;
        this.currentHp -= difference;
      }

      this.totalDmg = this.calcTotalDmg;
      this.totalAvoidance = this.calcTotalAvoidance;
      this.totalToHit = this.calcTotalToHit;
    }

    displayStats(){
      console.log(`${this.variantName}:`)
      console.log(`HP: ${this.currentHp}/${this.maxHp}`)
      console.log(`Weapon: ${this.weapon}`)
      console.log(`Armor: ${this.armor}`)
      console.log(`Accessory: ${this.accessory}`)
      console.log(`-----------------------------`)
      return;
    }

}

  class SessionHandler {
    //this will be created on pageload.
    //establishes player with guestData (that will be updated if player logs in)
    constructor(acct){
      //On pageload, players are logged in as the guest Object
      //Logging in will update all fields
      this.name = acct.name,
      this.mostWavesCompleted = acct.mostWavesCompleted,
      this.monstersDefeated = acct.monstersDefeated,
      this.questsCompleted = acct.questsCompleted,
      this.itemsUnlocked = acct.itemsUnlocked,
      this.classesUnlocked = acct.classesUnlocked
    }
    updateUnlockedClasses(){
      
    }
    checkIfLoggedIn(){
      return true;
    }
  }


  class GameHandler {
    constructor(npcs){
      consoleMode.setGame(this);
      heroClasses.setGame(this);
      items.setGame(this);
      quests.setGame(this);
      this.newGameSetup();
      this.npcs = npcs;
    }
    newGameSetup(){
      this.playerRunState = {};
      this.playerRunState.gold = 2000;
      this.playerRunState.questTier = 1;
      this.playerRunState.questsCompleted = [];
      this.playerRunState.inventory = [items.itemList[9], items.itemList[12], items.itemList[4], items.itemList[10], items.itemList[11], items.itemList[7], items.itemList[8]];
      this.playerRunState.squad = new Squad('player');
      this.playerRunState.squad.roster = this.playerRunState.squad.createSquad(beastiary.monsterList[144], 6);
      this.openGame = true;
      this.currentNPCs = {};
      this.currentNPCs[1] = this.npcs.generateMerchant(beastiary);
    }
  }
  // eslint-disable-next-line no-unused-vars
  class AccountHandler {
    constructor(){
    }
    login(){
      let usernameInput = prompt('Username:');
      let passwordInput = prompt('Password:');
      if((usernameInput == 'Account1') && (passwordInput == 'Password1')){
        currentSession = new SessionHandler(account1)
      } else {
        console.log('No match.')
      }
      return;
    }
  }

function accessRankings(){
  console.log('Rankings Menu (under construction):')
}

function accessOptions(){
  console.log('Options Menu:')
}

//---------------------------------------------------------------------------------------

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
  currentSession = new SessionHandler(guestAcct);
  consoleMode = new ConsoleHandler();
  beastiary = new BeastiaryHandler(JSONBeastiaryData);
  items = new ItemHandler(JSONItemData);
  heroClasses = new HeroClassHandler(JSONHeroClassData);
  let npcs = new NPCHandler();
  console.log(npcs)
  quests = new QuestHandler(JSONQuestData);
  // GAME STARTS HERE
  consoleMode.showTitleMenu();
}
//---------------------------------------------------------------------------------------


// FUNCTION CALLS ------------------------------------------------------------------------
startProgram();
//-----------------------------------------------------------------------------------------