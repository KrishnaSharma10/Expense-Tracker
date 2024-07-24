let deletemode = false;
let currentChart = null;

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

    const currentdate = new Date();
    const year = currentdate.getFullYear();
    const month = String(currentdate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(currentdate.getDate()).padStart(2, '0');
    const formattedDate = `${day}-${month}-${year}`; // Format: YYYY-MM-DD
    document.getElementById("display-date").innerHTML = formattedDate;
    
    transactions.forEach(transaction => {
        addTransactionToTable(transaction, false); // Add the transaction without updating the budget
        remainingbudget -= parseFloat(transaction.amount);
    });

    document.getElementById('rembudget').textContent = `Remaining Budget : ${remainingbudget}`;
    localStorage.setItem('remainingbudget',remainingbudget);

    document.getElementById('delete-transaction-btn').addEventListener('click',function(){
        deletemode = !deletemode;
    });

    document.getElementById('linechart').addEventListener('click',function(){
        const groupedbyday = getTransactionsbyday(transactions);
        let labels = Object.keys(groupedbyday);
        labels = labels.sort((a, b) => new Date(a) - new Date(b));
        const data = labels.map(day => groupedbyday[day].reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0)); 
        const ctx= document.getElementById("myChart").getContext('2d');
        if(currentChart){
            currentChart.destroy();
        }
        currentChart=new Chart(ctx, {
            type: 'line',
            data: {
               labels: labels,
               datasets: [{
               label: 'Amount Spent',
               data: data,
               borderWidth: 1
               }]
            },
            options: {
               scales: {
                y: {
                  beginAtZero: true
                  }
                }
            }
        });
     });
    
    document.getElementById('barchart').addEventListener('click',function(){
        const groupedbymonth = getTransactionsbymonth(transactions);
        let labels = Object.keys(groupedbymonth);
        const data = labels.map(month => groupedbymonth[month].reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0)); 
        const ctx= document.getElementById("myChart").getContext('2d');
        if(currentChart){
            currentChart.destroy();
        }
        currentChart=new Chart(ctx, {
            type: 'bar',
            data: {
               labels: labels,
               datasets: [{
                label: 'Amount Spent',
                data: data,
                borderWidth: 1,
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Light color for bars
                borderColor: 'rgba(75, 192, 192, 1)' // Darker color for borders
               }]
            },
            options: {
               scales: {
                y: {
                  beginAtZero: true
                  }
                }
            }
        });
    });

    document.getElementById('piechart').addEventListener('click',function(){
        if(currentChart){
            currentChart.destroy();
        }
        currentChart = newChart(ctx,{
            type : 'doughnut',
            data : {
                
            }
        })
    })
});