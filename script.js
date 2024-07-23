let deletemode = false;

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
        description: description,
    };

    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    addTransactionToTable(transaction);
});

function getTransactionsbymonth(transactions){
    let months = {};

    transactions.forEach(function(transaction){
        let month = transaction.date.slice(0,7);
        if(!months[month]){
            months[month]=[];
        }
        months[month].push(transaction);
    });

    return months;
}

function getTransactionsbyday(transactions){
    let days = {};

    transactions.forEach(function(transaction){
        let day = transaction.date;
        if(!days[day]){
            days[day]=[];
        }
        days[day].push(transaction);
    });

    return days;
}

function addTransactionToTable(transaction) {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${transaction.date}</td>
        <td>${transaction.type}</td>
        <td>${transaction.amount}</td>
        <td>${transaction.mode}</td>
        <td>${transaction.description}</td>
    `;

    newRow.addEventListener('click',function(){
        if(deletemode){
            if(confirm("Do you want to delete this transaction? ")){
                deletetransaction(newRow, transaction);
            }
        }
    });

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

function deletetransaction(row, transaction){
    row.remove();

    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions = transactions.filter(t => t.date !== transaction.date || t.amount !== transaction.amount || t.type !== transaction.type || t.mode !== transaction.mode || t.description !== transaction.description);
    localStorage.setItem('transactions', JSON.stringify(transactions));

    // Update remaining budget
    let remainingbudget = parseFloat(localStorage.getItem('remainingbudget')) || 0;
    remainingbudget += parseFloat(transaction.amount);
    document.getElementById('rembudget').textContent = `Remaining Budget : ${remainingbudget}`;
    localStorage.setItem('remainingbudget', remainingbudget);

    // Disable delete mode
    deletemode = false;
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#submit-budget').onclick = budgetupdate;

    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    let initialBudget = parseFloat(localStorage.getItem('budget')) || 0;
    let remainingbudget = initialBudget;
    
    transactions.forEach(transaction => {
        addTransactionToTable(transaction, false); // Add the transaction without updating the budget
        remainingbudget -= parseFloat(transaction.amount);
    });

    document.getElementById('rembudget').textContent = `Remaining Budget : ${remainingbudget}`;
    localStorage.setItem('remainingbudget',remainingbudget);

    document.getElementById('delete-transaction-btn').addEventListener('click',function(){
        deletemode = !deletemode;
    });

});