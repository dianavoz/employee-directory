/*============== Variables ===================*/
const gallery = document.getElementById('gallery');
const body = document.querySelector('body');

// Create the modal container
const modalContainer = document.createElement('div');
modalContainer.className = 'modal-container';
let employees;


/*============== Fetch API ===================*/
fetch('https://randomuser.me/api/?results=12')
    .then(checkStatus)
    .then(data => displayUsers(data.results))
    .catch(error => console.log(error));

/*============== API Error ===================*/
function checkStatus(res) {
    if (!res.ok) {
        throw new TypeError("Oops, we haven't got JSON!");
    } else {
        return res.json();
    }
}

/*============== Search Form Markup ===================*/
function searchInput() {
    const markup = `
        <form action="#" method="get">
            <input type="search" id="search-input" class="search-input" placeholder="Search...">
            <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
        </form>
        `;
    document.querySelector('.search-container').innerHTML = markup;
}
searchInput()

/*============== Card Markup ===================*/
function displayUsers(data) {

    // Add the data to the employees variable
    employees = data;

    // Iterate over the data
    data.forEach((employee, index) => {

        // Create a new card
        const card = document.createElement('div');
        card.className = 'card';
        card.setAttribute("data-index", index);

        // Create markup to go inside the card
        const markup = `
            <div class="card-img-container">
                <img class="card-img" src="${employee.picture.large}" alt="profile picture">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${employee.name.first} ${employee.name.last}</h3>
                <p class="card-text">${employee.email}</p>
                <p class="card-text cap">${employee.location.city}, ${employee.location.state}</p>
            </div>
        `;
        card.innerHTML = markup;

        // Append the card to the gallery
        gallery.appendChild(card);
    });
}

/*============== Modal Window Markup ===================*/
// Show modal
function showModal(employee) {

    let currentIndex = employee.getAttribute('data-index');
    let currentEmployee = employees[currentIndex];
    // Create the markup to go inside the modal container
    const markup = `
        <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn" aria-label="Close"><i class="fa fa-times" aria-hidden="true"></i></button>
            <div class="modal-info-container">
                <img class="modal-img" src="${currentEmployee.picture.large}" alt="profile picture">
                <h3 id="name" class="modal-name cap">${currentEmployee.name.first} ${currentEmployee.name.last}</h3>
                <p class="modal-text">${currentEmployee.email}</p>
                <p class="modal-text cap">${currentEmployee.location.city}</p>
                <hr>
                <p class="modal-text">${currentEmployee.phone}</p>
                <p class="modal-text">${currentEmployee.location.street}, ${currentEmployee.location.city}, ${currentEmployee.location.state} ${currentEmployee.location.postcode}</p>
                <p class="modal-text">Birthday: ${formatDateOfBirth(currentEmployee.dob.date)}</p>
            </div>
        </div>
        <div class="modal-btn-container">
            <button type="button" id="modal-prev" class="modal-prev btn" aria-label="Previous"><i class="fa fa-chevron-left" aria-hidden="true"></i></button>
            <button type="button" id="modal-next" class="modal-next btn" aria-label="Next"><i class="fa fa-chevron-right" aria-hidden="true"></i></button>
        </div>
    `;
    modalContainer.innerHTML = markup;

    // Append the modal container to the body
    body.appendChild(modalContainer);
}

function formatDateOfBirth(string) {
    let date = new Date(Date.parse(string));
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let year = date.getYear();
    let dob = month + '/' + day + '/' + year;
    return dob;
}

// When an employee card is clicked
gallery.addEventListener('click', function(event) {
    showModal(event.target.closest('.card'));
    // if (event.target.className !== 'gallery') {
    //     showModal(event.target.closest('.card'));
    // }
});

// When the modal close button or overlay is clicked
body.addEventListener('click', function(e) {
    const target = e.target;
    if (target.className === 'fa fa-times' || target.className === 'modal-close-btn' || target.className === 'modal-container') {
        closeModal();
    }
});

// Close the modal
function closeModal() {
    body.removeChild(modalContainer);
}

/*=========================Next Modal======================================*/