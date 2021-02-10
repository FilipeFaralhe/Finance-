const Modal = {
  openClose() {
    document.querySelector('.modal-overlay').classList.toggle('active');
  } 
}

const transactions = [
  {
    id: 1,
    description: "Luz",
    amount: -50000,
    date: '23/01/2021'
  },
  {
    id: 2,
    description: "Criação website",
    amount: 500000,
    date: '23/01/2021'
  },
  {
    id: 3,
    description: "internet",
    amount: -20000,
    date: '23/01/2021'
  },
  {
    id: 3,
    description: "internet",
    amount: 20000,
    date: '23/01/2021'
  }
]

const Transaction = {
  incomeTransactions: 0,
  expenseTransactions: 0,
  totalTransactions: 0,

  incomes() {

    transactions.forEach((transactions) => {
      if (transactions.amount > 0) {
        this.incomeTransactions += transactions.amount
      } else {

      }
    })

    return this.incomeTransactions;
  },

  expenses() {

    transactions.forEach((transactions) => {
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
  }
}

const DOM = {
  transectionContainer: document.querySelector('#data-table tbody'),

  setTheme() {
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
    
    //pega tadas as letras maiúsculo de A-Z coloca o = na frente quando estiver e volta tudo para minúsculo
    const transformKey = key => "--" + key.replace(/([A-Z])/, "-$1").toLowerCase() 
    
    const changeColors = (colors) => {
      Object.keys(colors).map(key => root.style.setProperty(transformKey(key), colors[key]))
    }


    checkbox.addEventListener('change', ({target}) => {
      target.checked ?  changeColors(darkMode) : changeColors(initialColors);
    });

  },

  addTransaction(transactions, index) {
    const tr = document.createElement('tr');
    tr.classList.add(index);

    tr.innerHTML = this.innerHTMLTransaction(transactions);
    this.transectionContainer.appendChild(tr);
  },
  
  innerHTMLTransaction(transactions) {
    const incomeOrExpanse = transactions.amount > 0 ? "income" : "expense";
    
    const amount = Utils.formatCurrency(transactions.amount);
    
    const html = `
      <td class="description">${transactions.description}</td>
      <td class="${incomeOrExpanse}">${amount}</td>
      <td class="date">${transactions.date}</td>
      <td>
        <img src="./assets/minus.svg" alt="remover transação">
      </td>
    `;

    return html;
  },
  
  updateBalance(transactions) {
    document.querySelector("#incomeDisplay").innerHTML = Utils.formatCurrency(Transaction.incomes());
    document.querySelector("#expenseDisplay").innerHTML = Utils.formatCurrency(Transaction.expenses());
    document.querySelector("#totalDisplay").innerHTML = Utils.formatCurrency(Transaction.total());
  },
}

const Utils = {
  
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
}

transactions.forEach((transactions) => { 
  DOM.addTransaction(transactions, transactions.id);
});

DOM.updateBalance();
DOM.setTheme();

