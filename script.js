const inputSlider = document.querySelector("[data-length-Slider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copyBtn]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateBtn");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols =`!@#$%^&*()-_=+[{]}|;:'",<.>/?`;
let password = "";
let passwordLength = 10;
let checkCount = 0;

handleSlider();
//set strength circle to grey
setIndicator("#ccc");


//set password Len
function handleSlider(){
     inputSlider.value = passwordLength;
     lengthDisplay.innerText = passwordLength;
     
     //to manage the filling section

     const min = inputSlider.min;
     const max = inputSlider.max;
     inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max - min)) + "% 100%"
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

//fn for random integer(for generating num, uppercase , lowercase)

function getRandomInt(min , max){
    return Math.floor(Math.random()*(max-min)) + min;
}

//fn for random number

function generateRandomNumber(){
    return getRandomInt(0,9);
}

//fn for Lowercase

function generateLowerCase() {
    return String.fromCharCode(getRandomInt(97,123));
}

//fn for Uppercase

function generateUpperCase() {
    return String.fromCharCode(getRandomInt(65,91));
}

//fn for symbols

function generateSymbol(){
    const randNum = getRandomInt(0,symbols.length);
    return symbols[randNum];
}

function calcStrength(){
    let hasUpper = uppercaseCheck.checked;
    let hasLower = lowercaseCheck.checked;
    let hasNum = numbersCheck.checked;
    let hasSym = symbolsCheck.checked;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8){
        setIndicator("#0f0");
    }
    else if(
       (hasLower || hasUpper) && 
       (hasNum || hasSym) && 
       passwordLength >= 6
       ) {
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}


//copy content

async function copyContent(){
    try{
      await navigator.clipboard.writeText(passwordDisplay.value);
      copyMsg.innerText = "copied";
    }
    catch(e){
      copyMsg.innerText = "Failed";
    }
    //to make copy span visible
    copyMsg.classList.add("active");
    
    //set time out to make copy span invisible
    setTimeout(() => {
        copyMsg.classList.remove("active");
    },2000);

 }

 function shufflePassword(array){
    //shuffling algo :  Fisher Yates method

    for(let i = array.length-1; i>0 ; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => {str += el});
    return str;
}

//har checkbox ke upar event listener lgaya hai
function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox) =>{
        if(checkbox.checked)
          checkCount++;
    });
    //special condition
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
    
}

allCheckBox.forEach((checkbox) =>{
    checkbox.addEventListener('change', handleCheckBoxChange)
})

 inputSlider.addEventListener('input',(e) =>{
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
   if(passwordDisplay.value)
         copyContent();  
})


generateBtn.addEventListener('click', () => {
    //none of the checkbox are selected
    if(checkCount == 0) return;

    if(passwordLength < checkCount)
    {
        passwordLength = checkCount;
        handleSlider();
    }

    //let's find new password
    console.log('Start');
    //remove old password
   
    password = "";

    //let's put the stuff mentioned by checkBoxes

    let funcArr = [];

    if(uppercaseCheck.checked)
         funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
         funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
         funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
         funcArr.push(generateSymbol);
    
     //compulsory addition done

     console.log('Compulsory addition done')

    for(let i = 0; i<funcArr.length; i++){
        password += funcArr[i]();
    }

    //remaining addition

    for(let i = 0; i<passwordLength-funcArr.length; i++){
        let randIndex = getRandomInt(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    console.log('Remaining addition done')

    //shuffle the password

    password = shufflePassword(Array.from(password));
    console.log('Shuffling done')

    //show in UI
    passwordDisplay.value = password;
    console.log('Rendering in UI');

    //calculate strength

    calcStrength();
})