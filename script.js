document.getElementById('submit-transaction').addEventListener('click', function() {
    const date = document.getElementById('transaction-date').value;
    const amount = document.getElementById('transaction-amount').value;
    const type = document.getElementById('transaction-type').value;
    const mode = document.getElementById('transaction-mode').value;
    const description = document.getElementById('transaction-description').value;

    const transaction = {
        date: date,
        amount: amount,
        type: type,
        mode: mode,
        description: description
    };

    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    addTransactionToTable(transaction);
});

function addTransactionToTable(transaction) {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${transaction.date}</td>
        <td>${transaction.amount}</td>
        <td>${transaction.type}</td>
        <td>${transaction.mode}</td>
        <td>${transaction.description}</td>
    `;
    document.querySelector('#past-transactions .past-transactions-table tbody').appendChild(newRow);
    let remainingbudget = localStorage.getItem('remainingbudget');
    remainingbudget -= transaction.amount;
    document.getElementById('rembudget').textContent=`Remaining Budget : ${remainingbudget}`;
    localStorage.setItem('remainingbudget',remainingbudget);
}

function budgetupdate(){
    const budget = document.getElementById('budget-input').value;
    if(budget){
        localStorage.setItem('budget',budget);
        document.getElementById('rembudget').textContent=`Remaining Budget : ${budget}`;
        localStorage.setItem('remainingbudget',budget);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions.forEach(addTransactionToTable);

    let remainingbudget = localStorage.getItem('remainingbudget');
    document.getElementById('rembudget').textContent = `Remaining Budget : ${remainingbudget}`;

    document.querySelector('button').onclick = budgetupdate;
});

