// The answer (hardcoded for now)
const answer = {
    book: "John",
    chapter: 3,
    verse: 16,
    text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life."
};

let attempts = 0;
const maxAttempts = 6;

// Display the verse text
document.getElementById('verse-text').textContent = answer.text;

function makeGuess() {
    const guessedBook = document.getElementById('book').value;
    const guessedChapter = parseInt(document.getElementById('chapter').value);
    const guessedVerse = parseInt(document.getElementById('verse').value);

    // Validate input
    if (!guessedBook || !guessedChapter || !guessedVerse) {
        alert("Please fill in all fields");
        return;
    }

    attempts++;

    // Check the guess and get stars
    const result = checkGuess(guessedBook, guessedChapter, guessedVerse);
    displayGuess(result, guessedBook, guessedChapter, guessedVerse);

    // Check if won
    if (result.stars === 3) {
        alert('Congratulations! You found the correct verse! 🌟🌟🌟');
        disableInputs();
        return;
    }

    // Check if lost
    if (attempts >= maxAttempts) {
        alert(`Game Over! The correct verse was ${answer.book} ${answer.chapter}:${answer.verse}`);
        disableInputs();
    }

    // Clear inputs
    clearInputs();
}

function checkGuess(book, chapter, verse) {
    let stars = 0;
    let bookCorrect = false;
    let chapterCorrect = false;

    if (book === answer.book) {
        stars++;
        bookCorrect = true;
        if (chapter === answer.chapter) {
            stars++;
            chapterCorrect = true;
            if (verse === answer.verse) {
                stars++;
            }
        }
    }

    return {
        book: bookCorrect ? 'correct' : 'incorrect',
        chapter: chapterCorrect ? 'correct' : 'incorrect',
        verse: (bookCorrect && chapterCorrect && verse === answer.verse) ? 'correct' : 'incorrect',
        stars: stars
    };
}

function displayGuess(result, book, chapter, verse) {
    const guessDiv = document.createElement('div');
    guessDiv.className = 'guess';
    
    const guessText = document.createElement('div');
    guessText.className = 'guess-text';
    guessText.innerHTML = `
        <span class="${result.book}">${book}</span> 
        <span class="${result.chapter}">${chapter}</span>:
        <span class="${result.verse}">${verse}</span>
    `;

    const starsSpan = document.createElement('div');
    starsSpan.className = 'stars';
    starsSpan.textContent = '⭐'.repeat(result.stars);

    guessDiv.appendChild(guessText);
    guessDiv.appendChild(starsSpan);

    document.getElementById('guesses').insertBefore(guessDiv, document.getElementById('guesses').firstChild);
}

function clearInputs() {
    document.getElementById('book').value = '';
    document.getElementById('chapter').value = '';
    document.getElementById('verse').value = '';
}

function disableInputs() {
    document.getElementById('book').disabled = true;
    document.getElementById('chapter').disabled = true;
    document.getElementById('verse').disabled = true;
    document.querySelector('button').disabled = true;
}
