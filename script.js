// ------UX/UI Elements------
const entrance_section = document.querySelector("#entrance-content");
const bank_section = document.querySelector("#bank-content");
const customer_section = document.querySelector("#customer-content");
const new_customer = document.querySelector("#new-customer");
const existing_customer = document.querySelector("#existing-customer");
const wrong_details = document.querySelector(".wrong-details");
const success_log = document.querySelector(".success-log");
const bank_balance = document.querySelector(".bank-balance");
const customers_list = document.querySelector("#customers-list");
const formNewCustomer = document.getElementById("new-customer-form");
const loginForm = document.querySelector(".existing-customer-form");

// ------Logic Elements------
const accountsArr = [];
const DateTime = luxon.DateTime;
let loggedUser = {};
let dailyDeposit = 0;
let dailyWithdrawal = 0;

class BankAccount {
  constructor(firstName, lastName, id) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.accountNumber = this.generateAccountNumber();
    this.pinNumber = this.generatePinNumber();
    this.transactions = []; // Array to store transactions
    this.balance = this.calculateBalance();
    BankAccount.totalUsers++;
    }

    generateAccountNumber() {
    // Generating a random 8-digit account number
        return Math.floor(Math.random() * 90000000) + 10000000;
    }

    generatePinNumber() {
        // Generating a random 4-digit PIN number
        return Math.floor(Math.random() * 9000) + 1000;
    }
    
    calculateBalance() {
        let accBalance = 0;
        this.transactions.forEach(transaction => {
            if (transaction.type == "deposit"){
                accBalance += transaction.amount;
            }else if (transaction.type == "withdrawal"){
                accBalance -= transaction.amount;
            }
        })
        return accBalance;
    }

    insertIntoLocalStorage(){
        localStorage.setItem(this.id, JSON.stringify(this));
    }

    getDailyDepsoit(){
        dailyDeposit = 0;
        this.transactions.forEach(transaction => {
            let depositDate = new DateTime(transaction.date);
            const now = DateTime.now();
            let diffInDays = (now - depositDate)/(1000 * 3600 * 24);
            if (transaction.type == "deposit" && diffInDays < 1){
                dailyDeposit += transaction.amount;
            } 
        })
        return dailyDeposit;
    }

    getDailyWithdrawal(){
        dailyWithdrawal = 0;
        this.transactions.forEach(transaction => {
            let WithdrawDate = new DateTime(transaction.date);
            const now = DateTime.now();
            let diffInDays = (now - WithdrawDate)/(1000 * 3600 * 24);
            if (transaction.type == "withdrawal" && diffInDays < 1){
                dailyWithdrawal += transaction.amount;
            } 
        })
        return dailyWithdrawal;
    }

    deposit(amount) {;
        const now = DateTime.now();
        let dailyDepositAmount = this.getDailyDepsoit();
        if (amount>5000){      
            alert('Maximum single deposit is 5000.');
        }else if(dailyDepositAmount + amount > 5000){
            alert(`Maximum daily deposit is 5000, you have already deposits ${dailyDepositAmount} today!`);
        }else if(amount<1){
            alert('Wrong amount to deposit!');
        }else{
            this.balance += amount;
            BankAccount.totalMoney += amount;
            this.transactions.unshift({ type: "deposit", date: now, amount: amount });
            this.insertIntoLocalStorage();
            alert(`Successfully deposited ${amount}$ into account ${this.accountNumber}`);
        }   
    }

    withdraw(amount) {
        const now = DateTime.now();
        let dailyWithdrawAmount = this.getDailyWithdrawal();
        if (amount > 2000){
            alert("Maximum single withdrawal is 2000.");
        }else if(dailyWithdrawAmount + amount > 2000){
            alert(`Maximum daily withdrawal is 2000, you have already withdraw ${dailyWithdrawAmount} today!`);
        }else if(amount > 0 && amount <= this.balance) {
            this.balance -= amount;
            BankAccount.totalMoney -= amount;
            this.transactions.unshift({ type: "withdrawal", date: now, amount: amount });
            this.insertIntoLocalStorage();
            alert(`Successfully withdrew ${amount}$ from account ${this.accountNumber}`);
        }else{
            alert("Insufficient funds or invalid amount for withdrawal.");
        }
    }

    getBalance() {
        return `Account ${this.accountNumber} balance: ${this.balance}$`;
    }

    static totalUsers = 0;
    static totalMoney = 0;

    static getTotalUsers() {
        return `Total users: ${BankAccount.totalUsers}`;
    }

    static getTotalMoney() {
        BankAccount.totalMoney = accountsArr.reduce((accumulator , item)=>{
            return accumulator += Number(item.balance);
        },0);
        document.querySelector('.bank-balance-amount').innerHTML = BankAccount.totalMoney;
        return `${BankAccount.totalMoney}$`;
       
    }
}

function importAccountsFromLocalStorage (){
  for (let i=0; i < window.localStorage.length;i++){
      let text = localStorage.getItem(localStorage.key(i));
      let customer = JSON.parse(text);
      accountsArr[i] = new BankAccount (customer.firstName,customer.lastName,customer.id);
      accountsArr[i].pinNumber = customer.pinNumber;
      accountsArr[i].transactions = customer.transactions;
      accountsArr[i].accountNumber = customer.accountNumber;
      accountsArr[i].balance = accountsArr[i].calculateBalance();        
  }
}

function checkNewIdLocalStorage(newId) {
  for (let i=0; i < window.localStorage.length;i++){
    let text = localStorage.getItem(localStorage.key(i));
    let customer = JSON.parse(text);
    accountsArr[i] = new BankAccount (customer.firstName,customer.lastName,customer.id);
    accountsArr[i].pinNumber = customer.pinNumber;
    accountsArr[i].accountNumber = customer.accountNumber;
    accountsArr[i].transactions = customer.transactions;
    accountsArr[i].balance = accountsArr[i].calculateBalance();        
}
}

function checkNewIdLocalStorage(newId){
  
  for (let i=0; i < window.localStorage.length;i++){
      let text = localStorage.getItem(localStorage.key(i));
      let customer = JSON.parse(text);
      if (customer.id == newId){
          return true;
      }
  }
  return false;
}   

function validateNewAccount(fName,lName,newId){
  if(fName == "" || lName == "" || newId == ""){
    return "empty";
  }else if(checkNewIdLocalStorage(newId)){
    return "dup_id";
  }else{
    return "new";
  }
}

function getCustomersList(){
  document.querySelector('.total_users').innerHTML = `Total of ${accountsArr.length} Accounts`;
  let table = document.querySelector('.customers-table-body');
  // table.innerHTML = "";
  for (i = 0; i < accountsArr.length; i++) {
      let row = document.createElement("tr");
      let c1 = document.createElement("td");
      let c2 = document.createElement("td");
      let c3 = document.createElement("td");
      let pStart = document.createElement("p");
      c1.innerHTML = `${accountsArr[i].firstName}  ${accountsArr[i].lastName}`;
      c2.innerHTML = `${accountsArr[i].accountNumber} ${'<p class="m-0 p-0 text-success">'} (${accountsArr[i].id}) ${'</p> <p class="m-0 p-0 text-danger">'} [${+accountsArr[i].pinNumber}] ${'</p>'}`;
      c3.innerHTML = accountsArr[i].balance
      row.appendChild(c1);
      row.appendChild(c2);
      row.appendChild(c3);
      table.appendChild(row)
  }
}

function checkCustomerLogin(){
  let loginID = document.querySelector('#id_existing');
  let secretCode = document.querySelector('#secret_code');
  for (let i=0; i < window.localStorage.length;i++){
      text = localStorage.getItem(localStorage.key(i));
      customer = JSON.parse(text);
      if (customer.id == loginID.value && customer.pinNumber == secretCode.value){
          loggedUser = accountsArr.find(account => account.id === customer.id);
          return true;
      }
  }
  return false;
}

function showTransactions() {
  let table = document.querySelector(".trans-table-body");
  table.innerHTML = "";
  for (i = 0; i < loggedUser.transactions.length && i < 10; i++) {
      const userTrans = loggedUser.transactions[i];
      const actionDate = new DateTime(userTrans.date).setLocale('he-IL').toLocaleString();
      let row = document.createElement("tr")
      let c1 = document.createElement("td")
      let c2 = document.createElement("td")
      let c3 = document.createElement("td")
      c1.innerText = actionDate
      c2.innerText = userTrans.type
      c3.innerText = userTrans.amount
      row.appendChild(c1);
      row.appendChild(c2);
      row.appendChild(c3);
      table.appendChild(row)
  }
}

function clearNewCustomer() {
  document.querySelector("#firstName_newcustomer").value = "";
  document.querySelector("#lastName_newcustomer").value = "";
  document.querySelector("#id_newcustomer").value = "";
  document.querySelector(".new-customer-warning").display = 'none';
  document.querySelector(".new-4-digit-code").innerHTML = "";
  document.querySelector(".new-details").style.display = 'none';
}

importAccountsFromLocalStorage();

async function reloadIntoExistion() {
  let bodyElement = document.querySelector('body')
  if (document.body.contains(bodyElement)) {
  customer_section.style.display = 'block';
  existing_customer.style.display = 'block';
  entrance_section.style.display = 'none';
  bank_section.style.display = 'none';
  }
}

// Show/Hide for Entrance Content Elements
if (document.body.contains(entrance_section)) {
  let bank_btn = document.querySelector('.bank-btn');
  let customer_btn = document.querySelector('.customer-btn');

  bank_btn.addEventListener('click', ()=> {
      entrance_section.style.display = 'none';
      bank_section.style.display = 'block'; 
  });

  customer_btn.addEventListener('click', ()=> {
      entrance_section.style.display = 'none';
      customer_section.style.display = 'block'; 
  });
}

// Show/Hide for Bank Content Elements
if (document.body.contains(bank_section)) {
  let bankBalanceBtn = document.querySelector(".btn-bank-balance");
  let bankCustomersBtn = document.querySelector(".btn-customers-list");

  bankBalanceBtn.addEventListener("click", () => {
    if (bank_balance.style.display !== "block") {
      bank_balance.style.display = "block";
      let bank_balance_amount = document.querySelector(".bank-balance-amount");
      bank_balance_amount.innerHTML = `${BankAccount.getTotalMoney()}`;
    } else {
      bank_balance.style.display = "none";
    }
  });

  bankCustomersBtn.addEventListener("click", () => {
    if (customers_list.style.display !== "block") {
      customers_list.style.display = "block";
      getCustomersList();
    } else {
      customers_list.style.display = "none";
    }
  });
}

// Show/Hide for Customer Content Elements
if (document.body.contains(customer_section)) {
    const btnNewCustomer = document.querySelector(".btn-new-customer");
    const btnExistingCustomer = document.querySelector(".btn-exist-customer");

    btnNewCustomer.addEventListener("click", () => {
      if (new_customer.style.display !== "block") {
        new_customer.style.display = "block";
        existing_customer.style.display = "none";
        // Create Customer Button with Show/Hide Element on 4-digit code
        let createCustomerBtn = document.querySelector("#create_newcustomer");
        createCustomerBtn.addEventListener("click", () => {
          let newDetailsBtn = document.querySelector(".new-details");
          newDetailsBtn.style.display = "block";
        });
      } else {
        new_customer.style.display = "none";
      }
    });

  // Create New Customer via the New Customer Form and store it as BankAccount inside the localStorage mentioned before
  formNewCustomer.addEventListener("submit", (e) => {
    e.preventDefault();

        let newDetails = document.querySelector(".new-details");
        let fName = document.querySelector("#firstName_newcustomer");
        let lName = document.querySelector("#lastName_newcustomer");
        let newId = document.querySelector("#id_newcustomer");
        let newCustomerWarning = document.querySelector('.new-customer-warning');
        let validationResult = validateNewAccount(fName.value, lName.value, newId.value);
        // debugger;
        switch (validationResult){
            case "new":
              function createNewAccount(callback){
                newDetails.style.display = 'block';
                newCustomerWarning.style.display = 'none';
                let newUser = new BankAccount (fName.value, lName.value, newId.value);
                localStorage.setItem(newUser.id, JSON.stringify(newUser));
                const h5code = document.querySelector(".new-4-digit-code");
                let theCode = `${newUser.pinNumber}`;
                h5code.append(theCode);
                setTimeout(()=>{
                  callback();
                  importAccountsFromLocalStorage();
                },3500);
              }
              createNewAccount(()=>{
                clearNewCustomer();
                btnExistingCustomer.click();
              });
              break;
            case "dup_id":
              newCustomerWarning.style.display = 'block';
              newCustomerWarning.innerHTML = "ID already in our system. contact bank!";
              break;
            case "empty":
              newCustomerWarning.style.display = 'block';
              newCustomerWarning.innerHTML = "One of the required fields is empty!"
              break;
        };
      });

  btnExistingCustomer.addEventListener("click", () => {
    if (existing_customer.style.display !== "block") {
      existing_customer.style.display = "block";
      new_customer.style.display = "none";
    } else {
      existing_customer.style.display = "none";
    }
  });

  // Existing Cutomer Functions
  loginForm.addEventListener("submit", (e)=> {
    e.preventDefault();
      // let loginCustomerBtn = document.querySelector('#login');
      const wrongDetails = document.querySelector('.wrong-details'); 
        if (checkCustomerLogin()){
            wrongDetails.style.display = 'none';
            document.querySelector('.login-form').style.display = 'none';
            document.querySelector('.action-amount-div').style.display = 'block';
            let welcomeCustomer = document.querySelector('.customer-welcome');
            let actionsCustomer = document.querySelector('.customer-actions');
            let transactionsCustomer = document.querySelector('.customer-transactions');
            let customerArr = [welcomeCustomer, actionsCustomer, transactionsCustomer];
                customerArr.forEach(element => {
                    element.style.cssText = 'display:flex;'; 
                });
            document.querySelector('.name-of-account').innerHTML = `Full Name: ${loggedUser.firstName} ${loggedUser.lastName}`;
            document.querySelector('.id-of-account').innerHTML = `Account Number: ${loggedUser.accountNumber}`;
            document.querySelector('.account-number').innerHTML = `ID: ${loggedUser.id}`;
            document.querySelector('.customer-balance').innerHTML = `${loggedUser.balance}$`; 
            
            showTransactions();
        }else{
            wrongDetails.style.display = 'block';
        }
      });
  let actionAmount = document.querySelector('.action-amount');
  document.querySelector('.btn-withdraw').addEventListener('click', ()=> { 
      
      loggedUser.withdraw(Number(actionAmount.value));
      document.querySelector('.customer-balance').innerHTML = loggedUser.balance + `$`;
      actionAmount.value = "";
      showTransactions();
  });
  document.querySelector('.btn-deposit').addEventListener('click', ()=> { 
      loggedUser.deposit(Number(actionAmount.value));
      document.querySelector('.customer-balance').innerHTML = loggedUser.balance + `$`;
      actionAmount.value = "";
      showTransactions();
  }); 
}