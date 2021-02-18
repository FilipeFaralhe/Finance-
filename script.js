const Modal = {
  open(event) {
    const buttonNewTransction = document.querySelector(".button, .new");
    let submitOrEdite;
    let title;

    if(event.currentTarget === buttonNewTransction) {
      submitOrEdite = "FormSubmit.submit(event)";
      title = "Nova Transação";
      this.addModal(title, submitOrEdite);
    } else {
      submitOrEdite = "FormEdite.submit(event)";
      title = "Editar Transação";
      this.addModal(title, submitOrEdite);
    }

    console.log("oiiii");
    document.querySelector('.modal-overlay').classList.add('active');
  },
  
  close() {
    this.remove()
  },

  remove() {
    const modal = document.querySelector('.modal-overlay');
    modal.remove();
  },

  addModal(title, submitOrEdite) {
    console.log("oii");
    const modalOverlay = document.createElement('div');
    modalOverlay.classList.add("modal-overlay")
    const body = document.querySelector('body');
    const footer = document.querySelector('footer');

    const html = `
      <div class="modal"> 
        <div id="form">
          <h2>${title}</h2>
          <form action="#" onsubmit="${submitOrEdite}">
            <div class="input-group">
              <label class="sr-only" for="description">Descrição</label>
              <input type="text" id="description" name="description" placeholder="Descrição">
            </div>
            
            <div class="input-group">
              <label class="sr-only" for="amount">Valor</label>
              <input type="number" step="0.01" id="amount" name="amount" placeholder="0,00">
              <small>Use o sinal - (negativo) para despesas e, (vírgula) para casas decimais</small>
            </div>

            <div class="input-group">
              <label class="sr-only" for="date">Data</label>
              <input type="date" id="date" name="date"> 
            </div>

            <div class="input-group actions">
              <a href="#" class="button cancel" onclick="Modal.close()">Cancelar</a>
              <button type="submit">Salvar</button>
            </div>
          </form>
        </div>
      </div>
      `
    modalOverlay.innerHTML = html;
    body.insertBefore(modalOverlay, footer);
  } 
}

const Storage = {
  getTransaciton() {
    return JSON.parse(localStorage.getItem("Finance:transctions")) || [];
  },

  setTransaction(transactions) {
    localStorage.setItem("Finance:transctions", JSON.stringify(transactions));
  },
  getColor() {
    return JSON.parse(localStorage.getItem("theme")) || "";
  },

  setColor(theme) {
    localStorage.setItem("theme", JSON.stringify(theme));
  },
  getChecked() {
    return localStorage.getItem("checked") || "";
  },
  setChecked(checked) {
    localStorage.setItem('checked', checked);
  }
}

const Transaction = {
  incomeTransactions: 0,
  expenseTransactions: 0,
  totalTransactions: 0,
  all: Storage.getTransaciton(),

  add(transactions) {
    this.all.push(transactions);

    App.reload();
  },

  remove(index) {
    this.all.splice(index, 1);

    App.reload();
  },

  edite(index) {
    const description = this.all[index].description;
    const amount = this.all[index].amount;
    const date = this.all[index].date;
    
    const inputDescription = document.querySelector("input#description");
    const inputAmount = document.querySelector("input#amount");
    const inputDate = document.querySelector("input#date");
    
    
    inputDescription.value = description;
    inputAmount.value = Utils.formatCurrencyNormal(amount);
    inputDate.value = Utils.formateDateNormal(date);

    FormEdite.saveIndex(index);
  },

  incomes() {
    
    this.all.forEach((transactions) => {
      if (transactions.amount > 0) {
        this.incomeTransactions += transactions.amount
      } else {

      }
    })

    return this.incomeTransactions;
  },

  expenses() {

      this.all.forEach((transactions) => {
      if (transactions.amount < 0) {
        this.expenseTransactions += transactions.amount
      } else {
        
      }
    })

    return this.expenseTransactions;
  },

  total() {

    this.totalTransactions = this.incomeTransactions + this.expenseTransactions;
    
    return this.totalTransactions;
  },

  clearBalance() {
    this.totalTransactions = 0;
    this.expenseTransactions = 0;
    this.incomeTransactions = 0;
  }
}

const DOM = {
  transectionContainer: document.querySelector('#data-table tbody'),

  setTheme(color) {
    const root = document.querySelector('html');
    const checkbox = document.querySelector('input[name=theme]');
    

    const getStyle = (element, style) => window.getComputedStyle(element).getPropertyValue(style); //não precisa de return, pois está em apenas uma linha de comando
  
    const initialColors = {
      bgHeader: getStyle(root, "--bg-header"),
      bgMain: getStyle(root, "--bg-main"),
      colorStrings: getStyle(root, "--color-strings"),
      colorCardstable: getStyle(root, "--color-cardstable"),
      newTransaction: getStyle(root, "--new-transaction"),
      newHover: getStyle(root, "--new-hover")
    }

    const darkMode = {
      bgHeader: "#2c2c54",
      bgMain: "#40407a",
      colorStrings: "#FFFFFF",
      colorCardstable: "#30336b",
      newTransaction: "#3dd705",
      newHover: "#49aa26"
    }
    
    //pega tadas as letras maiúsculo de A-Z coloca o - na frente quando estiver e volta tudo para minúsculo
    const transformKey = key => "--" + key.replace(/([A-Z])/, "-$1").toLowerCase() 
    
    Object.keys(color).map(key => root.style.setProperty(transformKey(key), color[key]));
    
    const onChange = color => Object.keys(color).map(key => root.style.setProperty(transformKey(key), color[key]));

    if(Storage.getChecked() == "checked") {
      checkbox.setAttribute("checked", "");
    } else {
      
    }

    checkbox.addEventListener('change', ({target}) => {
      if(target.checked) {
        Storage.setColor(darkMode);
        onChange(darkMode)
        Storage.setChecked("checked")
       ; 
      } else {
        Storage.setColor(initialColors);
        onChange(initialColors);
        Storage.setChecked(""); 
      }
    });
  },

  addTransaction(transactions, index) {
    const tr = document.createElement('tr');
    tr.dataset.index = index;

    tr.innerHTML = this.innerHTMLTransaction(transactions, index);
    this.transectionContainer.appendChild(tr);
  },
  
  innerHTMLTransaction(transactions, index) {
    const incomeOrExpanse = transactions.amount > 0 ? "income" : "expense";
    
    const amount = Utils.formatCurrency(transactions.amount);
    
    const html = `
      <td class="description">${transactions.description}</td>
      <td class="${incomeOrExpanse}">${amount}</td>
      <td class="date">${transactions.date}</td>
      <td>
        <i class="fas fa-edit" class="edite"  alt="editar transação" onclick="Modal.open(event); Transaction.edite(${index});"></i>
      </td>
      <td>
        <img class="remove" src="./assets/minus.svg" alt="remover transação" onclick="Transaction.remove(${index})">
      </td>
    `;

    return html;
  },
  
  updateBalance() {
    document.querySelector("#incomeDisplay").innerHTML = Utils.formatCurrency(Transaction.incomes());
    document.querySelector("#expenseDisplay").innerHTML = Utils.formatCurrency(Transaction.expenses());
    document.querySelector("#totalDisplay").innerHTML = Utils.formatCurrency(Transaction.total());
  },

  clearTransaction() {
    DOM.transectionContainer.innerHTML = "";
  }
}

const Utils = {
  formatAmount(amount) {
    amount *= 100
    amount = Math.round(amount);
    
    return amount;
  },

  formatCurrency(amount) {
    const signal = Number(amount) < 0 ? "-" : "";
    
    // Expressão regular /\D/g onde g significa global, \D siginifica achar tudo que não é número
    amount = String(amount).replace(/\D/g, "");// tira o sinal "-" 

    // transformando em valor quebrado
    amount = Number(amount) / 100;

    // primeiro argumento e o local onde está, segundo um objeto com as configurações
    amount = Number(amount).toLocaleString("pt-BR", {style: "currency", currency: "BRL"})

    return signal + " " + amount;
  },

  formatCurrencyNormal(amount) {
    const signal = Number(amount) < 0 ? "-" : "";
    
    // Expressão regular /\D/g onde g significa global, \D siginifica achar tudo que não é número
    amount = String(amount).replace(/\D/g, "");// tira o sinal "-" 

    // transformando em valor quebrado
    amount = Number(amount) / 100;

    return signal + amount;
  },

  formatDate(date) {
    date = date.split('-').reverse().join("/");

    return date;
  },

  formateDateNormal(date) {
    date = date.split("/").reverse().join('-');

    return date;
  }
}

const App = {
  
  init() {
    Transaction.all.forEach((transactions, index) => { 
      DOM.addTransaction(transactions, index);
      
    });
    
    Storage.setTransaction(Transaction.all);
    DOM.updateBalance();
    DOM.setTheme(Storage.getColor()); 
  },

  reload() {
    Transaction.clearBalance();
    DOM.clearTransaction();
    App.init();
  }
}

const FormEdite = {
  getIndex: 0,

  saveIndex(index) {
    this.getIndex = index
  },

  editorTransaction() {
    const {description, amount, date} = FormSubmit.getValues();
    console.log(description);
    Transaction.all[this.getIndex].description = description;
    Transaction.all[this.getIndex].amount = amount;
    Transaction.all[this.getIndex].date = date;
    Transaction.all[this.getIndex] = FormSubmit.formatValues();
  },

  submit(event) {
    const modalOverlay = document.querySelector(".modal-overlay");
    const body = document.querySelector("body");
    
    try {

      event.preventDefault();
      FormSubmit.validateFilds();
      this.editorTransaction();
      Modal.close();
      App.reload();
      body.appendChild(this.messageSuccess())
      FormSubmit.removeMessageSuccess();

    } catch(error) {

      modalOverlay.appendChild(FormSubmit.messageError());
      FormSubmit.removeMessageError();
    }  
  },
  
  messageSuccess() {
    const message = document.createElement('div');
    message.setAttribute("id", "success")
    message.innerHTML = '<p>Transação editada com sucesso!</p>'
    
    return message;
  },
}

const FormSubmit = {
  getValues() {
    return {
      description: document.querySelector("input#description").value,
      amount: document.querySelector("input#amount").value,
      date: document.querySelector("input#date").value
    }
  },

  validateFilds() {
    const { description, amount, date } = this.getValues();
    //trim tira todos os espaços vazios do começo e fim da string
    
    //throw é basicamnete empurrar
    if(description.trim() === "" || amount.trim() === "" || date.trim() === "") {
      throw new Error("Por favor, preencha todos os campos");
    }
  },

  formatValues() {
    let { description, amount, date } = this.getValues();
    
    amount = Utils.formatAmount(amount);
    date = Utils.formatDate(date);

    return {
      description,
      amount,
      date
    }

  },

  saveTransaction(transaction) {
    Transaction.add(transaction);
  },

  clearFilds() {
    document.querySelector("input#description").value = "";
    document.querySelector("input#amount").value = "";
    document.querySelector("input#date").value = "";
  },

  submit(event) {
    const modalOverlay = document.querySelector(".modal-overlay");
    const body = document.querySelector("body");
    event.preventDefault();
    
    try {

      this.validateFilds();
      const newTransaction = this.formatValues();
      this.saveTransaction(newTransaction);
      this.clearFilds();
      Modal.close();
      body.appendChild(this.messageSuccess())
      this.removeMessageSuccess();

    } catch (error) {

      modalOverlay.appendChild(this.messageError());
      this.removeMessageError();

    }
  },

  messageSuccess() {
    const message = document.createElement('div');
    message.setAttribute("id", "success")
    message.innerHTML = '<p>Transação adicionada com sucesso!</p>'
    
    return message;
  },

  messageError() {
    const message = document.createElement('div');
    message.setAttribute("id", "nodification")
    message.innerHTML = '<p>Preencha todos os campos!</p>'
    
    return message;
  },

  removeMessageSuccess() {
    const success = document.querySelector("#success");

    setTimeout(() => {
      success.remove();
    }, 3000);
  },

  removeMessageError() {
    const nodification = document.querySelectorAll("#nodification");

    nodification.forEach((nodification, index, array) => {
      if(array.length == 1){
      setTimeout(() => {
        array[0].remove();
      }, 3000);
      }else if(array.length >= 2){
        array[1].remove();
      }
    })   
  }
}

App.init();








