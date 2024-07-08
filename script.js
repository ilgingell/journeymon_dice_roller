var roll_button = document.getElementById('roll_button');

// Attack Buttons
var fire_atk_button = document.getElementById('atk_fire');
var nature_atk_button = document.getElementById('atk_nature');
var water_atk_button = document.getElementById('atk_water');

var mind_atk_button = document.getElementById('atk_mind');
var matter_atk_button = document.getElementById('atk_matter');
var mayhem_atk_button = document.getElementById('atk_mayhem');

var fey_atk_button = document.getElementById('atk_fey');
var heroic_atk_button = document.getElementById('atk_heroic');
var machine_atk_button = document.getElementById('atk_machine');

//Defend Buttons
var fire_def_button = document.getElementById('def_fire');
var nature_def_button = document.getElementById('def_nature');
var water_def_button = document.getElementById('def_water');

var mind_def_button = document.getElementById('def_mind');
var matter_def_button = document.getElementById('def_matter');
var mayhem_def_button = document.getElementById('def_mayhem');

var fey_def_button = document.getElementById('def_fey');
var heroic_def_button = document.getElementById('def_heroic');
var machine_def_button = document.getElementById('def_machine');

atk_button_list = [fire_atk_button, nature_atk_button, water_atk_button,
                   mind_atk_button, matter_atk_button, mayhem_atk_button,
                   fey_atk_button, heroic_atk_button, machine_atk_button]
def_button_list = [fire_def_button, nature_def_button, water_def_button,
                   mind_def_button, matter_def_button, mayhem_def_button,
                   fey_def_button, heroic_def_button, machine_def_button]

// formatted with attack in first index, defender in second
// order is always fire, nature, water, mind, matter, mayhem, fey, heroic, machine
var boon_matrix = [[0,1,0,1,1,1,0,0,0], //fire beats...
                   [0,0,1,1,1,1,0,0,0], //nature beats...
                   [1,0,0,1,1,1,0,0,0], //water boon vs.
                   [0,0,0,0,1,0,1,1,1], //mind boon vs.
                   [0,0,0,0,0,1,1,1,1], //matter boon vs.
                   [0,0,0,1,0,0,1,1,1], //mayhem boon vs.
                   [1,1,1,0,0,0,0,1,0], //fey boon vs.
                   [1,1,1,0,0,0,0,0,1], //heroic boon vs.
                   [1,1,1,0,0,0,1,0,0]]; //machine boon vs.

var snag_matrix = [[0,0,1,0,0,0,1,1,1], //fire snag vs.
                   [1,0,0,0,0,0,1,1,1], //nature snag vs.
                   [0,1,0,0,0,0,1,1,1], //water snag vs.
                   [1,1,1,0,0,1,0,0,0], //mind snag vs.
                   [1,1,1,1,0,0,0,0,0], //matter snag vs.
                   [1,1,1,0,1,0,0,0,0], //mayhem snag vs.
                   [0,0,0,1,1,1,0,0,1], //fey snag vs.
                   [0,0,0,1,1,1,1,0,0], //heroic snag vs.
                   [0,0,0,1,1,1,0,1,0]]; //machine snag vs.

var attacking_type = -1
var defending_type = [false,false,false,false,false,false,false,false,false]
var boon_counter = 0
var snag_counter = 0

function calc_boon_and_snag_count() {
  boon_counter = 0
  snag_counter = 0
  for (let idef = 0; idef < defending_type.length; idef++) {
    if (defending_type[idef]==true) {
      console.log(boon_matrix[attacking_type][idef]);
      boon_counter = boon_counter + boon_matrix[attacking_type][idef]
      snag_counter = snag_counter + snag_matrix[attacking_type][idef]
    }
  }
  document.getElementById("boon_count").innerHTML = boon_counter;
  document.getElementById("snag_count").innerHTML = snag_counter;
}

function click_atk(type_num) {
  attacking_type = type_num
  // Set all butons un-highlighted
  for (let i = 0; i < atk_button_list.length; i++) {
    atk_button_list[i].style.boxShadow="0px 0px 0px cyan";
  }
  // Highlight correct button
  atk_button_list[type_num].style.boxShadow="0px 0px 30px cyan";
  calc_boon_and_snag_count()
}

function click_def(type_num) {
  // If not chosen yet...
  if (defending_type[type_num] == false) {
    // Highlight correct button
    def_button_list[type_num].style.boxShadow="0px 0px 30px cyan";
    // Set the element to true
    defending_type[type_num] = true;
  } else {
  // If already chosen...
    // Un-Highlight correct button
    def_button_list[type_num].style.boxShadow="0px 0px 0px cyan";
    defending_type[type_num] = false;
  }
  calc_boon_and_snag_count()
}

function get_random_integer(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)

  return Math.floor(Math.random() * (max - min)) + min
}

function dice_str(dice_num) {
  //⚀⚁⚂⚃⚄⚅
  switch(dice_num) {
      case(1): return "⚀";
      case(2): return "⚁";  
      case(3): return "⚂";  
      case(4): return "⚃";  
      case(5): return "⚄";  
      case(6): return "⚅";  
  }
}

function dice_list_str(dice_list) {
  all_dice_str = ''
  for (let i = 0; i < dice_list.length; i++) {
    all_dice_str += dice_str(dice_list[i])
  }
  return all_dice_str;
}

function roll_dice() {
  var dice_num = 2 + boon_counter + snag_counter
  dice_rolls = new Array(dice_num)
  for (let i = 0; i < dice_num; i++) {
    dice_rolls[i] = get_random_integer(1,7);
  }
  dice_rolls.sort(function (a, b) {  return a - b;  });
  console.log(dice_rolls)
  // since slice acts funny when the last number is zero
  if ( (boon_counter==0) && (snag_counter==0) ) {
    saved_dice = dice_rolls
  } else if ( (boon_counter==0) ) {
    saved_dice = dice_rolls.slice(0,-snag_counter)
  } else if ( (snag_counter==0) ) {
    saved_dice = dice_rolls.slice(boon_counter)
  } else {
    saved_dice = dice_rolls.slice(boon_counter,-snag_counter)
  }
  
  roll_result = saved_dice.reduce((a, b) => a + b, 0)
  console.log(roll_result)
  //alert("All dice: "+dice_rolls+"\nSaved Dice: "+saved_dice+"\nResult: " + roll_result);
  
  all_rolls_str = dice_list_str(dice_rolls)
  saved_dice_str = dice_list_str(saved_dice)
  
  
  //document.getElementById("result_text").innerHTML = "All Dice: "+all_rolls_str+"</br>Saved Dice: "+saved_dice_str+"</br>Result: " + roll_result
  console.log(all_rolls_str)
  document.getElementById("all_dice_text").innerHTML = all_rolls_str
  document.getElementById("kept_dice_text").innerHTML = saved_dice_str
  document.getElementById("result_text").innerHTML = roll_result
  
}


// Button wrappers
function click_fire_atk() {click_atk(0)}
function click_nature_atk() {click_atk(1)}
function click_water_atk() {click_atk(2)}

function click_mind_atk() {click_atk(3)}
function click_matter_atk() {click_atk(4)}
function click_mayhem_atk() {click_atk(5)}

function click_fey_atk() {click_atk(6)}
function click_heroic_atk() {click_atk(7)}
function click_machine_atk() {click_atk(8)}

function click_fire_def() {click_def(0)}
function click_nature_def() {click_def(1)}
function click_water_def() {click_def(2)}

function click_mind_def() {click_def(3)}
function click_matter_def() {click_def(4)}
function click_mayhem_def() {click_def(5)}

function click_fey_def() {click_def(6)}
function click_heroic_def() {click_def(7)}
function click_machine_def() {click_def(8)}

// Button listeners
fire_atk_button.addEventListener('click', click_fire_atk);
water_atk_button.addEventListener('click', click_water_atk);
nature_atk_button.addEventListener('click', click_nature_atk);

mind_atk_button.addEventListener('click', click_mind_atk);
matter_atk_button.addEventListener('click', click_matter_atk);
mayhem_atk_button.addEventListener('click', click_mayhem_atk);

fey_atk_button.addEventListener('click', click_fey_atk);
heroic_atk_button.addEventListener('click', click_heroic_atk);
machine_atk_button.addEventListener('click', click_machine_atk);

fire_def_button.addEventListener('click', click_fire_def);
water_def_button.addEventListener('click', click_water_def);
nature_def_button.addEventListener('click', click_nature_def);

mind_def_button.addEventListener('click', click_mind_def);
matter_def_button.addEventListener('click', click_matter_def);
mayhem_def_button.addEventListener('click', click_mayhem_def);

fey_def_button.addEventListener('click', click_fey_def);
heroic_def_button.addEventListener('click', click_heroic_def);
machine_def_button.addEventListener('click', click_machine_def);

roll_button.addEventListener('click', roll_dice);