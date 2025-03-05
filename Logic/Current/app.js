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

//We're defining these here because (I think) we want them in the global scope, this may change
let abilities;
let bestiary;
let heroClasses;
let items;
let messages;

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
      itemsUnlocked = [], 
      classesUnlocked = [],
    ) {
      //pass in player data, if logged in
      this.name = name,
      this.mostWavesCompleted = mostWavesCompleted,
      this.monstersDefeated = monstersDefeated,
      this.itemsUnlocked = itemsUnlocked,
      this.classesUnlocked = classesUnlocked
    }
    
    addItemToInventory(item) {
      this.inventory.push(item);
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
  console.log('New items are for sale!')
  console.log(forSaleItemsArray);
  return forSaleItemsArray;
}
function generateBuybackTable(){
  console.log('Create a function so the player can buy-back stuff they sell.')
}
let conclusion = 0;



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
  console.log("8. Squad -WIP")
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

function accessQuests(){
  console.log('Quest Menu:')
  //quest database? quest generator? maybe start with fixed quests, move to randomized ones in the future
  //quest menu should provide player with next options, a big part of the game is choosing wisely
  //this will send soldiers off to fight, so it'll initiate combat, open the combat theater
  //it will have to read the results of combat, and give the player rewards, depending
  //function for creating quests, defining them
  //part of a quest: name, description, tier, enemies, rewards, completion status
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
  console.table(sqd);
  console.log(`1. Equip item`)
  console.log(`2. Remove item`)
  console.log(`3. See squad stats`)
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
        console.log(`${index + 1}. ${member.name}`)
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
        this.name = createdUnit["name"], 
        this.image = createdUnit["image"], 

        this.rawHp = createdUnit["rawHP"], 
        this.bonusHp = Math.random(), 
        this.currentHp = this.maxHp;

        this.weapon = createdUnit["defaultWeapon"], 
        this.armor = createdUnit["defaultArmor"], 
        this.accessory = createdUnit["defaultAccessory"], 

        this.dmg = createdUnit["rawDmg"], 
        this.bonusDmg = 0, 

        this.avoidance = createdUnit["rawAvoidance"], 
        this.bonusAvoidance = 0, 

        this.toHit = createdUnit["rawToHit"],
        this.bonusToHit = 0,
        
        this.goldReward = createdUnit["goldReward"]
    }

    get maxHp() {
        return this.rawHp + this.bonusHp;
    }

    get totalDmg(){
        return this.dmg + this.bonusDmg;
    }

    get totalAvoidance(){
        return this.avoidance + this.bonusAvoidance;
    }

    get totalToHit(){
        return this.toHit + this.bonusToHit;
    }

    adjustHp(amt) {
      this.currentHp = Math.max(0, Math.min(this.maxHp, this.currentHp + amt))
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
    equipItem(slot, item){
      console.log(`Slot is: ${slot}`);
      console.log(`Item is: ${item.name}`);
      switch (slot) {
        case '1':
          console.log('case 1')
          if(this.weapon == "None") {
            console.log('if statement')
            this.weapon = item.name;
          }
          else {
            console.log('else statement')
            this.unequipItem(slot);
            this.weapon = item.name;
          }
          break;
        case '2':
          if(this.armor == "None") {
            this.armor = item.name;
          }
          else {
            this.unequipItem(slot);
            this.armor = item.name;
          }
          break;
        case '3':
          if(this.accessory == "None") {
            this.accessory = item.name;
          }
          else {
            this.unequipItem(slot);
            this.accessory = item.name;
          }
          break;
      }
      return
    }
    unequipItem(slot){
      //slot is provided via a prompt in the console version
      //in the UI version, make sure you supply the argument correctly
      switch (slot) {
        case '1':
          if(this.weapon !== "None") {
            this.weapon == "None"
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
      let newUnit = args[i];
      newUnit = new Unit(args[i]);

      // Check if the argument is a string (indicating a unit type)
      if (typeof newUnit.name === 'string') {
          const nextArg = args[i + 1];

          // Check if the next argument is a number (indicating count)
          if (typeof nextArg === 'number') {
              for (let j = 0; j < nextArg; j++) {
                  squad.push(newUnit);
              }
              i += 2; // Skip to the next unit type
          } else {
              // Create one instance if no count is provided
              squad.push(newUnit);
              i += 1; // Move to the next argument
          }
      } else {
          throw new Error(`Invalid argument at position ${i}: ${newUnit}`);
      }
  }
  
  return squad;
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
    let inventory = [];

    //c: The Squad. Let's start with 6.
      //Squire is at index 144 (need to update function so it uses the index of the unit)
    let squad = createSquad(bestiary[144], 6);
    
    //d: Wave
    let currentWave = 1;

    //e: Starting shopkeeper's wares
    let forSaleList = generateShopkeepersWares(items);
    console.log("For Sale List: ")
    console.log(forSaleList)
    
  //2. Generate the UI (Game UI.txt)
    //In the console version, this will be a list with prompts to move in and out of the menus, like an old pc game or dos application
    //Don't be TOO strict here, you can just call functions, as long as they're top level (meaning you just call inventory() and it does the rest)
    //This will pull up:
      //Player Menu (004 Player UI.txt)
      //Squad at a glance Menu (010 Squad at a glance Menu.txt)
      //Context Window
      //Options Menu (007 Options Menu.txt)
    //let playerChoice = askPlayerWhatsNext(user);

    return {gold, inventory, squad, currentWave, forSaleList}

}
//-------------------------------------------------------------------------------


// PROMPT PLAYER FOR A CHOICE
function askPlayerWhatsNext(playerSessionData) {
  console.log(playerSessionData)
  //a. Store player choice, as we're going to carry out our next action based on the user
  generateConsoleUI();
  let lastOptionChosen = prompt('What will you do next?');
  switch (lastOptionChosen) {
    case '1':
      seePlayerStatus(playerSessionData);
      return lastOptionChosen;
      //break;
    case '2':
      accessShop(playerSessionData);
      break;
    case '3':
      accessQuests();
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
          dummyAcct.itemsUnlocked, 
          dummyAcct.classesUnlocked
        )

        //Welcome the player, with account name, and start the game
        console.log(`Welcome, ${playerSessionData.name}!`)
    }

    //We now have the right player object for this session. 
    //Win or lose, we will have to update it, depending on how the game goes.
    console.log('PlayerData established. Starting game.')
    
  //2. SETUP NEW GAME/RUN/ROUND
    //a: Create default "per game" data, reset gold, default squad
    let newGameData = newGameSetup(playerSessionData);
    //Then, map it onto the PlayerSession object
    playerSessionData.gold = newGameData.gold;
    playerSessionData.inventory = newGameData.inventory;
    playerSessionData.squad = newGameData.squad;
    playerSessionData.currentWave = newGameData.currentWave;
    playerSessionData.forSaleList = newGameData.forSaleList;
    console.table(playerSessionData);

  //3. NEXT STEPS
    
    while(conclusion == 0) {
      //We want to prompt the player, asking what they will do next, and present them with options.
      //This will be less direct in the UI version, because the quests button will be glowing, and there will probably be a pop up with tips
      askPlayerWhatsNext(playerSessionData);
    }


  //GAME OVER - Game ends when
  // Victory condition - All waves are cleared
  // Loss condition - Squad is wiped out and player cannot purchase any units
  // Quit condition - Player exits the game, or closes the browser window (consider saving data?)
  // ***Also, should the newGame() function be running as long as the game is open? 
  // Should it run, establish the game, and pass data out to the larger scope?
  console.log('game session over')
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




