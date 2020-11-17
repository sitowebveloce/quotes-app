// PARSE DATA
// console.log(JSON.parse(data));
data = JSON.parse(data);
// SELECT CONTAINER
const container = document.querySelector('.container');

// LOOP THROUGH DATA ARRAY
data.forEach(q => {
    // CREATE A DIV
    let quoteDiv = document.createElement('div');
    // Assign a class
    quoteDiv.classList.add('quote');
    // Set inner Html
    quoteDiv.innerHTML = `
        <form class='formUpdate' action="/update/${q.id}" method="POST">
            <textarea rows="4" cols="50" name='quote'>"${q.quote}"</textarea><br />
            <input name='author' value='${q.author}'><br />
            <input hidden name='like' value='${q.like}'><br />
            <button>Update</button>
        </form>
        <button onclick="like('${q.id}','${q.quote}', '${q.author}', '${q.like}')" class='thumbUp'><img src='/img/thumbUp.svg'> ${q.like}</button>
        <button class='delete' onclick="deleteQuote(${q.id})">Delete</button>
    `;
    // Prepend
    container.prepend(quoteDiv);
});

// LIKE QUOTE
const like = async(id, quote, author, like) => {
    try {
        // CHECK LIKE LOCALSTORAGE 
        let likes = localStorage.getItem('like');
        if (likes < 1) {
            // Create object to fetch/send
            let likeObj = {
                id,
                quote,
                author,
                like: ++like
            };
            // Define url to fetch
            let url = `http://localhost:3001/update/${id}`;
            let likeFetch = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(likeObj),
                headers: { 'Content-Type': 'application/json' }
            });
            // console.log(likeFetch);

            // Set local storage and session
            localStorage.setItem('like', JSON.stringify(1));
            sessionStorage.setItem('lastname', 'Anonymous');
            // Reload
            window.location.reload();
        } else {
            // Allert
            alert(sessionStorage.getItem('lastname') + ' you have already liked it.');
        }

    } catch (error) {
        console.error(error);
    }
};

// DELETE QUOTE FUNCTION
const deleteQuote = async id => {
    try {
        // console.log(id);
        // FETCH DELETE
        // Define url
        let url = `http://localhost:3001/delete/${id}`;
        let deleteFetch = await fetch(url, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
        // console.log(deleteFetch.status);
        // console.log(deleteFetch);
        // Reload
        window.location.reload();

    } catch (error) {
        console.error(error);
    }
}

// NEW QUOTE
// CREATE A DIV
let quoteDiv = document.createElement('div');
// Assign a class
quoteDiv.classList.add('quote');
// Set inner Html
quoteDiv.innerHTML = `
<details>
    <summary>New Quote</summary>
        <form class='formNew' action="/" method="POST">
            <textarea rows="4" cols="50" name='quote' placeholder="New Quote here"></textarea><br />
            <input name='author' placeholder='Author'>
            <br />
            <button onclick='newQuote()'>Add</button>
        </form>
</details>
`;
// Prepend to the container
container.prepend(quoteDiv);

// NEW QUOTE FUNCTION
// Select form
const newQuoteForm = document.querySelector('.formNew');

const newQuote = async e => {
    try {
        // Prevent default
        // console.log(e)
        e.preventDefault();

        // Take values
        let quote = newQuoteForm.quote.value.replace(/['"]+/g, '');
        let author = newQuoteForm.author.value;
        let like = 0;
        // console.log(quote, author);
        // DEFINE NEW QUOTE OBJECT
        let newQuoteObj = {
            quote,
            author,
            like
        };
        // console.log(newQuoteObj);
        // DEFINE URL
        let url = 'http://localhost:3001/';
        // Add note
        await fetch(url, {
            method: 'POST',
            body: JSON.stringify(newQuoteObj),
            headers: { 'Content-Type': 'application/json' }
        });
        // Reset form
        newQuoteForm.reset();
        // Reload
        window.location.reload();

    } catch (error) {
        console.error(error);
    }
};

// New quote event listener
newQuoteForm.onsubmit = e => newQuote(e);