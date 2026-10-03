let categoryChart = null;

const badgeColors = {
    Food: "bg-success",
    Transport: "bg-info text-dark",
    Bills: "bg-danger",
    Entertainment: "bg-warning text-dark",
    Other: "bg-secondary"
};

export function showSpinner() {
    document.getElementById("loadingSpinner").classList.remove("d-none");
}

export function hideSpinner() {
    document.getElementById("loadingSpinner").classList.add("d-none");
}

export function renderTable(expenses) {
    const tableBody = document.getElementById("expenseTableBody");//gettiing yhe table body
    //to clear it out

    tableBody.innerHTML = "";

    expenses.forEach(function(expense) {
        const row = document.createElement("tr");
        const badgeColor = badgeColors[expense.category];

        row.innerHTML = `
            <td>${expense.title}</td>
            <td>${Number(expense.amount).toFixed(2)} JD</td>
            <td>
                <span class="badge ${badgeColor}">
                    ${expense.category}
                </span>
            </td>
            <td>${expense.date}</td>
            <td>
                <button
                    class="btn btn-sm btn-primary edit-button"
                    onclick="editExpense(${Number(expense.id)})">
                    Edit
                </button>

                <button
                    class="btn btn-sm btn-danger delete-button"
                    onclick="deleteExpense(${Number(expense.id)})">
                    Delete
                </button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

export function renderSummary(expenses) {
    const totalAmount = document.getElementById("totalAmount");
    const expenseCount = document.getElementById("expenseCount");
    const highestExpense = document.getElementById("highestExpense");

    let total = 0;
    let highest = 0;

    expenses.forEach(function(expense) {
        const amount = Number(expense.amount);

        total = total + amount;

        if (amount > highest) {
            highest = amount;
        }
    });

    totalAmount.textContent = total.toFixed(2) + " JD";
    expenseCount.textContent = expenses.length;
    highestExpense.textContent = highest.toFixed(2) + " JD";
}

export function renderChart(expenses) {
    const categoryTotals = {
        Food: 0,
        Transport: 0,
        Bills: 0,
        Entertainment: 0,
        Other: 0
    };

    expenses.forEach(function(expense) {
       let key = "Other";

    if (expense.category in categoryTotals) {
         key = expense.category;
        }   

        categoryTotals[key] += Number(expense.amount);
    });

    const chartElement = document.getElementById("expenseChart");

    if (categoryChart) {
        categoryChart.destroy();
    }

    categoryChart = new Chart(chartElement, {
        type: "pie",

        data: {
            labels: Object.keys(categoryTotals),

            datasets: [
                {
                    data: Object.values(categoryTotals)
                }
            ]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,//no auto controll css does thay

            plugins: {
                legend: {
                    position: "bottom"
                }
            }
        }
    });
}

export function showAlert(
    message,
    type,
    containerId = "alertContainer",
    autoHide = true
) {
    const alertContainer = document.getElementById(containerId);

    alertContainer.innerHTML = `
        <div class="alert alert-${type}" role="alert">
            ${message}
        </div>
    `;

    if (autoHide) {
        setTimeout(function() {
            alertContainer.innerHTML = "";
        }, 3000);
    }
}