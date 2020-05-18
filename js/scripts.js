const galleryDiv = document.getElementById('gallery');
const body = document.querySelector('body');
let employees;

// Create the modal container
const modalContainer = document.createElement('div');
modalContainer.className = 'modal-container';

/*============== Fetch API ===================*/
fetch('https://randomuser.me/api/?results=12&nat=us,au,ca,gb,nz')
    .then(checkStatus)
    .then(data => displayUsers(data.results))
    .catch(error => console.log(error));


/*============== Error Status===================*/
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
        galleryDiv.appendChild(card);
    });
}

/*============== Modal Window Markup ===================*/

// Show modal
function showModal(employee) {

    let currentIndex = employee.getAttribute('data-index');
    let currentEmployee = employees[currentIndex];
    // Create the HTML to go inside the modal container
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
                <p class="modal-text">Birthday: ${formatBirthDate(currentEmployee.dob.date)}</p>
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

//format date of birth for the current employee
function formatBirthDate(string) {
    let date = new Date(Date.parse(string));
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let year = date.getYear();
    let dob = month + '/' + day + '/' + year;
    return dob;
}

// Close the modal
function closeModal() {
    body.removeChild(modalContainer);
}

// When an employee card is clicked
galleryDiv.addEventListener('click', function(e) {
    showModal(e.target.closest('.card'));
});

// When the modal close button or overlay is clicked
body.addEventListener('click', function(e) {
    const target = e.target;
    if (target.className === 'fa fa-times' || target.className === 'modal-close-btn' || target.className === 'modal-container') {
        closeModal();
    }
});



/*=========================Toggle======================================*/
// When the previous or next button is clicked
body.addEventListener('click', function(e) {

    const target = e.target;
    if (target.className === 'fa fa-chevron-right' || target.className === 'fa fa-chevron-left' || target.id === 'modal-prev' || target.id === 'modal-next') {

        // Get total cards from the page
        const card = Array.from(document.querySelectorAll('.card'));

        // Get the current modal
        let modal;
        if (target.id === 'modal-prev' || target.id === 'modal-next') {
            modal = target.parentElement.previousElementSibling; // <div class="modal">
        } else if (target.className === 'fa fa-chevron-left' || target.className === 'fa fa-chevron-right') {
            modal = target.parentElement.parentElement.previousElementSibling; // <div class="modal">
        }

        // Get the name from the modal
        const modalName = modal.lastElementChild.firstElementChild.nextElementSibling.textContent; // .modal-info-container h3 #name

        // Hide the current modal
        modal.style.display = 'none';

        // Get the current employee card
        const currentEmployee = card.filter(card => card.lastElementChild.firstElementChild.textContent === modalName);

        // Get the next employee card
        let next;
        let index;
        if (target.className === 'fa fa-chevron-left' || target.id === 'modal-prev') {
            next = currentEmployee[0].previousElementSibling;
            index = card.length - 1;
        } else if (target.className === 'fa fa-chevron-right' || target.id === 'modal-next') {
            next = currentEmployee[0].nextElementSibling;
            index = 0;
        }

        // Show the modal for the next employee
        (next) ? showModal(next): showModal(card[index]);
    }
});

/*============== Search Input ===================*/
const input = document.querySelector('.search-input');

input.addEventListener('keyup', function(e) {
    let employeeCard = document.querySelectorAll('.card');
    let currentCard = this.value;

    employeeCard.forEach((card, i) => {
        if (!employeeCard[i].innerText
            .toUpperCase()
            .includes(currentCard.toUpperCase())
        ) {
            employeeCard[i].style.display = 'none';
        } else {
            employeeCard[i].style.display = 'flex';
        }
    });
});

/*============ page refresh ==================*/
//click on submit to refresh and get the profiles back
body.addEventListener('click', (e) => {
    if (e.target.type === 'submit') {
        window.location.reload();
    }
});