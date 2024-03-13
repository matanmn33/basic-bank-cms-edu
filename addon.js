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
const CustArr = [];
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
    this.balance = 0;
    this.transactions = []; // Array to store transactions
    localStorage.setItem(`bank_id_${this.id}`, JSON.stringify(this));
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
  
  insertIntoLocalStorage() {
    localStorage.setItem(this.id, JSON.stringify(this));
  }

  getDailyDepsoit() {
    if (this.transactions[0] !== undefined) {
      dailyDeposit = this.transactions
        .filter(function (element) {
          let currDate = new Date().getTime();
          let depositDate = element.date.getTime();
          let diffInDays = Math.round(
            (currDate - depositDate) / (1000 * 3600 * 24)
          );
          return diffInDays < 1 && element.type == "deposit";
        })
        .reduce((t, n) => t.amount + n.amount);
      return dailyDeposit;
    } else {
      return 0;
    }
  }

  getDailyWithdrawal() {
    if (
      this.transactions.forEach((transaction) => {
        if (transaction.type == "withdrawal") {
          return true;
        }
      })
    ) {
      dailyWithdrawal = this.transactions
        .filter(function (element) {
          let currDate = new Date().getTime();
          let WithdrawDate = element.date.getTime();
          let diffInDays = Math.round(
            (currDate - WithdrawDate) / (1000 * 3600 * 24)
          );
          return diffInDays < 1 && element.type == "withdrawal";
        })
        .reduce((t, n) => t.amount + n.amount);
      return dailyWithdrawal;
    } else {
      return 0;
    }
  }

  deposit(amount) {
    // debugger;
    let dailyDepositAmount = this.getDailyDepsoit();
    if (amount > 5000) {
      console.log("Maximum single deposit is 5000");
      return;
    } else if (dailyDepositAmount + amount > 5000) {
      console.log(
        `Maximum daily deposit is 5000, you have already deposits ${dailyDepositAmount} today !!!`
      );
      return;
    } else {
      this.balance += amount;
      BankAccount.totalMoney += amount;
      this.transactions.push({
        type: "deposit",
        date: new Date(),
        amount: amount,
      });
      return `Successfully deposited שח${amount} into account ${this.accountNumber}.`;
    }
  }

  withdraw(amount) {
    let dailyWithdrawAmount = this.getDailyWithdrawal();
    if (amount > 2000) {
      console.log("Maximum single withdrawal is 2000");
      return;
    } else if (dailyWithdrawAmount + amount > 2000) {
      console.log(
        `Maximum daily withdrawal is 2000, you have already withdraw ${dailyWithdrawAmount} today !!!`
      );
      return;
    } else if (amount > 0 && amount <= this.balance) {
      this.balance -= amount;
      BankAccount.totalMoney -= amount;
      this.transactions.push({
        type: "withdrawal",
        date: new Date(),
        amount: amount,
      });
      return `Successfully withdrew שח${amount} from account ${this.accountNumber}.`;
    } else {
      return "Insufficient funds or invalid amount for withdrawal.";
    }
  }

  getBalance() {
    return `Account ${this.accountNumber} balance: שח${this.balance}`;
  }

  static totalUsers = 0;
  static totalMoney = 0;

  static getTotalUsers() {
    return `Total Customers of ${BankAccount.totalUsers}`;
  }

  static getTotalMoney() {
    return `${BankAccount.totalMoney}$`;
  }
}

function checkNewIdLocalStorage(newId) {
  for (let i = 0; i > window.localStorage.length; i++) {
    if (id.key.value == newId) {
      return true;
    }
  }
  return false;
}

/*
function validateNewAccount(){
    let fName = document.getElementById('firstName_newcustomer');
    let lName = document.getElementById('lastName_newcustomer');
    let newId = document.getElementById('id_newcustomer');
    if (newId.value.length != 9){
        console.log("ID number should be 9 characters. Enter ID again !!!");
    }else if(fName.value == null || lName.value == null){
        console.log("First or Last name are invalid. Enter again !!!");
    }else if(checkNewIdLocalStorage(newId.value)){
        console.log("Your ID is already in our system. Check with bank manager !!!");
    }else{
        let newUser = new BankAccount (fName.value,lName.value,newId.value);
        let newPinNumber = document.getElementById('pinNumber');
        newPinNumber.innerText = newUser.pinNumber;
    }
}
*/

// Function to show the Total numbers of the Bank's Customers
function numberOfCustomers() {
  const keys = [...Array(localStorage.length)].map((o, i) => {
    return localStorage.key(i);
  })

  let keys_id = keys.filter((id) => id.startsWith('bank_id_'));
    return keys_id.length;
}

function getCustomersList() {

  for (let i = 0; i < keys_id.length; i++) {
    const stored = localStorage.getItem(i);
    const storedUsers = JSON.parse(stored);
    CustArr.push(storedUsers);
  }

}


// Show/Hide for Entrance Content Elements
if (document.body.contains(entrance_section)) {
  let bank_btn = document.querySelector(".bank-btn");
  let customer_btn = document.querySelector(".customer-btn");

  bank_btn.addEventListener("click", () => {
    entrance_section.style.display = "none";
    bank_section.style.display = "block";
  });

  customer_btn.addEventListener("click", () => {
    entrance_section.style.display = "none";
    customer_section.style.display = "block";
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
      let bank_users_amount = document.querySelector(".total_users");
      bank_users_amount.innerHTML = `Total Customers of ${numberOfCustomers()}`;
    } else {
      customers_list.style.display = "none";
    }
  });
}

// Show/Hide for Customer Content Elements
if (document.body.contains(customer_section)) {
    let btnNewCustomer = document.querySelector(".btn-new-customer");
    let btnExistingCustomer = document.querySelector(".btn-exist-customer");

  // Create New Customer via the New Customer Form and store it as BankAccount inside the localStorage mentioned before
  formNewCustomer.addEventListener("submit", (e) => {
    e.preventDefault();

    let fName = document.getElementById("firstName_newcustomer").value;
    let lName = document.getElementById("lastName_newcustomer").value;
    let newId = document.getElementById("id_newcustomer").value;

    const newUser = new BankAccount(fName, lName, newId);
    // Insert Customer New 4-Digit Code into the right HTML Tag
    const h5code = document.querySelector(".new-4-digit-code");
    let theCode = `${newUser.pinNumber}`;
    h5code.append(theCode);
  });

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

    let loginID = document.querySelector("#id_existing").value;
    let secretCode = document.querySelector("#secret_code").value;
    let welcomeCustomer = document.querySelector(".customer-welcome");
    let actionsCustomer = document.querySelector(".customer-actions");
    let transactionsCustomer = document.querySelector(".customer-transactions");
    let customerArr = [
      welcomeCustomer,
      actionsCustomer,
      transactionsCustomer,
    ];

    if (localStorage.getItem(`bank_id_${loginID}`)) {
      const userCheck = JSON.parse(localStorage.getItem(`bank_id_${loginID}`));
      if (userCheck.id == loginID && userCheck.pinNumber == secretCode) {
        if (success_log.style.display !== 'block') {
            success_log.style.display = 'block';
            wrong_details.style.display = 'none';
        } else {
            success_log.style.display = 'none';
        }

        function showInfo() {
          customerArr.forEach((element) => {
           element.style.cssText = "display:flex;";
          });
        }
        setTimeout(showInfo, 1000);

      } else {
            if (wrong_details.style.display !== 'block') {
                success_log.style.display = 'none';
                wrong_details.style.display = 'block';
                customerArr.forEach((element) => {
                    element.style.cssText = "display:none;";
                  });
            } else {
                wrong_details.style.display = 'none';
            }      
        }
    } else {
        customerArr.forEach((element) => {
            element.style.cssText = "display:none;";
          });
        wrong_details.style.display = 'none';
        success_log.style.display = 'none';
        setTimeout(()=> alert("ID Not Exist."), 200);
    }
  });

}

// newUser = new BankAccount ("Sagiv","Levi","012345678");

// newUser.insertIntoLocalStorage();
// newUser.deposit(2000);
// newUser.deposit(1500);
// newUser.deposit(2500);
// debugger;
// newUser.withdraw(1700);
// newUser.withdraw(500);

// console.log(newUser);
