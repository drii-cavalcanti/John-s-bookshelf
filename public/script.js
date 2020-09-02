// create/edit books
const bookTitle = document.querySelector("#book-title");
const bookState = document.querySelector("#book-state");

const dropzones = document.querySelectorAll('.dropzone');

const actions = document.getElementsByClassName('modal-action');

const states = document.querySelectorAll('.btn-state');
const create = document.getElementById('form-create');

let leaving = '';
let arriving = '';
let bookDragged = '';

// adding Book
const addBook = document.getElementById('btn-add');

async function getBooks() {
    try {
        const response = await fetch ('http://localhost:8081/api/book/list/');
        const data = await response.json();
        showBook(data.data);
    } catch (error){
        console.error(error);
    }
}

function showBook(books) {

    for (let book of books) {
        //document.getElementById(book.ownerName).innerHTML = book_div;
        if (book.ownerName != 'John') {
            
            let book_div = `<div id=${ book.id } class="book friend" draggable="true">
                                <div class="info-book">
                                    <div class="handle flex-center" style="display: none;">
                                        <i class="fa fa-bars" draggable="true"></i>
                                    </div>
                                    <div class="thumbnail flex-center" style="display: none;">
                                        <img src="https://picsum.photos/200?random=${ book.id }" alt="">
                                    </div>
                                    
                                    <div class="title">
                                        ${ book.title }
                                    </div>
                                    <div class="state ${ book.state }"></div>
                                    
                                </div>
                                <div class="edit-book flex-center" style="display: none;">
                                    <i class="fa fa-pencil"></i>
                                    <i class="fa fa-trash"></i>
                                </div>
                            </div>`
         
            let content = document.getElementById(book.ownerName).innerHTML;
            document.getElementById(book.ownerName).innerHTML = content + book_div;
        } else {

            let book_div = `<div class="book my-bookshelf">
                                <div class="info-book">
                                    <div class="handle flex-center">
                                        <i class="fa fa-bars" draggable="true"></i>
                                    </div>
                                    <div class="thumbnail flex-center">
                                        <img src="https://picsum.photos/200?random=${ book.id }" alt="">
                                    </div>
                                    
                                    <div class="title">
                                    ${ book.title }
                                    </div>
                                    <div class="state" hidden=true></div>
                                    
                                </div>
                                <div class="edit-book flex-center">
                                    <i class="fa fa-pencil"></i>
                                    <i class="fa fa-trash"></i>
                                </div>
                            </div>`
            
            let content = document.getElementById(book.ownerName).innerHTML;
            document.getElementById(book.ownerName).innerHTML = content + book_div;
        }
        // drag and drop functions
        const books = document.querySelectorAll('.book');
        
        books.forEach(book => {
            book.addEventListener('dragstart', dragstart);
            book.addEventListener('dragend', dragend);
        })
    }
}

getBooks() 

addBook.addEventListener('click', () =>{
    actions[1].classList.add('show');
})

states.forEach(state => {
    state.addEventListener('click', () => {
        st = bookDragged.getElementsByClassName('state')[0];
        st.classList.add(state.id);
        st.removeAttribute('hidden');
        actions[0].classList.remove('show');
    })
})

create.addEventListener('submit', function(event) {
    event.preventDefault();

    let newBook = {
        title:  bookState.value,
        ownerName: 'John',
        ownerID: '0',
        state: 'lend'
    };
    console.log(newBook);
    fetch('http://localhost:8081/api/book/create', 
            {method: 'POST',
             body:JSON.stringify(newBook)
    })
    .then(function(response){
        console.log(newBook);
        actions[1].classList.remove('show');
    })
    
})

function dragstart() {
    dropzones.forEach (dropzone => dropzone.classList.add('highlight'));
    leaving = this.parentElement.classList[1];
    bookDragged = this;
    console.log(bookDragged);
    this.classList.add('is-dragging');
}

function dragend() {
    dropzones.forEach (dropzone => dropzone.classList.remove('highlight'));
    arriving = this.parentElement.classList[1];

    if (arriving == 'friend' && leaving == 'my-bookshelf') {
        actions[0].classList.add('show');
    }
    this.classList.remove('is-dragging');
}

dropzones.forEach(dropzone => {
    dropzone.addEventListener('dragcenter', dragcenter);
    dropzone.addEventListener('dragover', dragover);
    dropzone.addEventListener('dragleave', dragleave);
    dropzone.addEventListener('drop', drop);
})

function dragcenter() {
    console.log('CARD: Start dragging');
}

function dragover() {
    const dragSpace = this.classList[1];
    this.classList.add('active');

    // get dragging book
    const bookDragged = document.querySelector('.is-dragging');
    bookDragged.className = 'is-dragging book';
    
    if (dragSpace == 'friend') {
        bookDragged.setAttribute('draggable', 'true');
        bookDragged.classList.add(dragSpace);
        bookDragged.children[0].children[0].style.display = 'none';
        bookDragged.children[0].children[1].style.display = 'none';
        bookDragged.children[1].style.display = 'none';

    } else {
        bookDragged.removeAttribute('draggable');
        bookDragged.classList.add(dragSpace);
        bookDragged.children[0].children[1].style.display = null;
        bookDragged.children[0].children[0].style.display = null;
        bookDragged.children[0].children[3].classList.remove('lend');
        bookDragged.children[0].children[3].classList.remove('gifted');
        bookDragged.children[0].children[3].setAttribute('hidden', 'true');
        bookDragged.children[1].style.display = '';

    }

    this.appendChild(bookDragged);
}

function dragleave() {
    this.classList.remove('active');
}

function drop() {
    console.log('CARD: End dragging');
}


