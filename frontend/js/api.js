const API_URL = "http://localhost:3000/api/expenses";

export async function getExpenses() {//summons the server.js
    let result;

    try {
        result = await fetch(API_URL)//by default fetch is get unless stated otherwise
    } catch (error) {
        // fetch only throws when it can't reach the server at all
        throw new Error("Cannot reach the server. Is it running?");
    }

    if(!result.ok)//res ok is a bool return from the fetch
    {
        throw new Error("Failed to load the expenses");
    }

    const expenses = await result.json()//although we fetched the data through the url
    // it consists of json and bunch of other data about the api request in order to single
    // the json data we use res.json()

    return expenses
}

export async function getExpenseById(id) {
    let result;

    try {
        result = await fetch(API_URL + "/" + id);
    } catch (error) {
        throw new Error("Cannot reach the server. Is it running?");
    }

    if(!result.ok)
    {
        throw new Error("Failed to load the Expense of id " + id);
    }

    const expense = await result.json();

    return expense;
}

export async function addExpense(data) {//as written before the default method for fetch is
    //get unless stated otherwise like this format below
    let result;

    try {
        result = await fetch(API_URL,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },//type of the data you're about to
                // receive is json

                body: JSON.stringify(data)//while the body contains the actual data
            })//ps must be a json
    } catch (error) {
        throw new Error("Cannot reach the server. Is it running?");
    }

    const expense = await result.json();

    if(!result.ok)
    {
        // use the message the server sent (e.g. "Title is required")
        throw new Error(expense.message);
    }

    return expense;
}

export async function updateExpense(id, data) {
    let result;

    try {
        result = await fetch(API_URL + "/" + id,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
    } catch (error) {
        throw new Error("Cannot reach the server. Is it running?");
    }

    const expenses = await result.json();

    if(!result.ok)
    {
        // use the message the server sent
        throw new Error(expenses.message);
    }

    return expenses;
}

export async function deleteExpense(id)
{
    let result;

    try {
        result = await fetch(API_URL + "/" + id,
            {
                method: "DELETE"
            })
    } catch (error) {
        throw new Error("Cannot reach the server. Is it running?");
    }

    const expenses = await result.json();

    if(!result.ok)
    {
        throw new Error(expenses.message);
    }

    return expenses;
}