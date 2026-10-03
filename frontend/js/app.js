import {
    getExpenses,
    getExpenseById,
    addExpense,
    updateExpense,
    deleteExpense as removeExpense
} from "./api.js";

import {
    renderTable,
    renderSummary,
    renderChart,
    showAlert,
    showSpinner,
    hideSpinner
} from "./ui.js";

let allExpenses = [];

function validateExpense(data) {
    if (data.title === "") {
        return "Title is required.";
    }

    if (isNaN(data.amount) || data.amount <= 0) {
        return "Amount must be greater than 0.";
    }

    if (data.category === "") {
        return "Please select a category.";
    }

    if (data.date === "") {
        return "Date is required.";
    }

    return null;
}

function applyFilter() {
    const filter = document.getElementById("categoryFilter").value;

    const visibleExpenses = filter === "All"
        ? allExpenses
        : allExpenses.filter(function(expense) {
            return expense.category === filter;
        });

    renderTable(visibleExpenses);
}

async function refresh() {
    showSpinner();

    try {
        allExpenses = await getExpenses();

        applyFilter();
        renderSummary(allExpenses);
        renderChart(allExpenses);
    } catch (error) {
        showAlert(error.message, "danger", "alertContainer", false);
    } finally {
        hideSpinner();
    }
}

document.getElementById("expenseForm").addEventListener(
    "submit",
    async function(event) {
        event.preventDefault();

        const data = {
            title: document.getElementById("title").value.trim(),
            amount: Number(document.getElementById("amount").value),
            category: document.getElementById("category").value,
            date: document.getElementById("date").value
        };

        const errorMessage = validateExpense(data);

        if (errorMessage) {
            showAlert(errorMessage, "danger");
            return;
        }

        try {
            await addExpense(data);

            showAlert("Expense added successfully.", "success");

            document.getElementById("expenseForm").reset();

            await refresh();
        } catch (error) {
            showAlert(error.message, "danger");
        }
    }
);

document.getElementById("categoryFilter").addEventListener(
    "change",
    applyFilter
);

async function editExpense(id) {
    try {
        const expense = await getExpenseById(id);

        document.getElementById("editAlertContainer").innerHTML = "";

        document.getElementById("editTitle").value = expense.title;
        document.getElementById("editAmount").value = expense.amount;
        document.getElementById("editCategory").value = expense.category;
        document.getElementById("editDate").value = expense.date;

        document.getElementById("saveEditButton").onclick = function() {
            saveEdit(id);
        };

        const modal = new bootstrap.Modal(
            document.getElementById("editModal")
        );

        modal.show();
    } catch (error) {
        showAlert(error.message, "danger");
    }
}

async function saveEdit(id) {
    const data = {
        title: document.getElementById("editTitle").value.trim(),
        amount: Number(document.getElementById("editAmount").value),
        category: document.getElementById("editCategory").value,
        date: document.getElementById("editDate").value
    };

    const errorMessage = validateExpense(data);

    if (errorMessage) {
        showAlert(errorMessage, "danger", "editAlertContainer");
        return;
    }

    try {
        await updateExpense(id, data);

        const modalElement = document.getElementById("editModal");
        const modal = bootstrap.Modal.getInstance(modalElement);

        modal.hide();

        showAlert("Expense updated successfully.", "success");

        await refresh();
    } catch (error) {
        showAlert(error.message, "danger", "editAlertContainer");
    }
}

async function deleteExpense(id) {
    const confirmed = confirm(
        "Are you sure you want to delete this expense?"
    );

    if (!confirmed) {
        return;
    }

    try {
        await removeExpense(id);

        showAlert("Expense deleted successfully.", "success");

        await refresh();
    } catch (error) {
        showAlert(error.message, "danger");
    }
}

window.editExpense = editExpense;
window.deleteExpense = deleteExpense;

refresh();