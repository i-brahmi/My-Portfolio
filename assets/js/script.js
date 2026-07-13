'use strict';

// 1. Initialize Supabase
const SUPABASE_URL = 'https://zcghihtzasxuazxrfwzm.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjZ2hpaHR6YXN4dWF6eHJmd3ptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5NTU4NzAsImV4cCI6MjA5OTUzMTg3MH0.ri2teVdWkTHXc2hEDp_RCSfYKYGA73VHWWFJ4o5SwQU';

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
);

// ---- Toast notification (replaces alert()) ----
(function injectToastStyles() {
  const style = document.createElement('style');
  style.textContent = `
    #toast-container {
      position: fixed;
      top: 24px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    }
    .toast {
      min-width: 260px;
      max-width: 90vw;
      padding: 14px 20px;
      border-radius: 8px;
      font-family: 'Poppins', sans-serif;
      font-size: 14px;
      line-height: 1.4;
      color: #fff;
      box-shadow: 0 4px 12px rgba(0,0,0,0.25);
      opacity: 0;
      transform: translateY(-12px);
      transition: opacity 0.25s ease, transform 0.25s ease;
      pointer-events: auto;
    }
    .toast.show {
      opacity: 1;
      transform: translateY(0);
    }
    .toast.success { background: #1e8e3e; }
    .toast.error { background: #d93025; }
  `;
  document.head.appendChild(style);

  const container = document.createElement('div');
  container.id = 'toast-container';
  document.body.appendChild(container);
})();

function showToast(message, type = 'success', duration = 3500) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  // trigger enter animation
  requestAnimationFrame(() => toast.classList.add('show'));

  setTimeout(() => {
    toast.classList.remove('show');
    toast.addEventListener('transitionend', () => toast.remove(), {
      once: true,
    });
  }, duration);
}

// 2. Select your contact form using its actual ID
const contactForm = document.getElementById('contact-form');

// 3. Listen for the form submission
contactForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // Stop the page from refreshing

  // Optional: Visual indicator that it's sending
  const submitBtn = contactForm.querySelector('.form-btn');
  const btnText = submitBtn.querySelector('span');
  const originalText = btnText.textContent;
  btnText.textContent = 'Sending...';
  submitBtn.disabled = true;

  // Grab data from the form using the 'name' attributes
  const formData = new FormData(contactForm);
  const fullName = formData.get('fullname').trim();
  const emailAddress = formData.get('email').trim();
  const message = formData.get('message').trim();

  // 4. Send it to your PostgreSQL table 'messages'
  const { data, error } = await supabaseClient.from('messages').insert([
    {
      full_name: fullName,
      email_address: emailAddress,
      message: message,
    },
  ]);

  // 5. Handle response status
  if (error) {
    // console.error('Supabase Error:', JSON.stringify(error, null, 2));
    showToast(
      'Something went wrong. Please check your data or try again!',
      'error',
    );
  } else {
    showToast('Your message was sent successfully!', 'success');
    contactForm.reset(); // Clear the form inputs
  }

  // Reset button state
  btnText.textContent = originalText;
  submitBtn.disabled = false;
});

// element toggle function
const elementToggleFunc = function (elem) {
  elem.classList.toggle('active');
};

// sidebar variables
const sidebar = document.querySelector('[data-sidebar]');
const sidebarBtn = document.querySelector('[data-sidebar-btn]');

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener('click', function () {
  elementToggleFunc(sidebar);
});

// testimonials variables
const testimonialsItem = document.querySelectorAll('[data-testimonials-item]');
const modalContainer = document.querySelector('[data-modal-container]');
const modalCloseBtn = document.querySelector('[data-modal-close-btn]');
const overlay = document.querySelector('[data-overlay]');

// modal variable
const modalImg = document.querySelector('[data-modal-img]');
const modalTitle = document.querySelector('[data-modal-title]');
const modalText = document.querySelector('[data-modal-text]');

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle('active');
  overlay.classList.toggle('active');
};

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {
  testimonialsItem[i].addEventListener('click', function () {
    modalImg.src = this.querySelector('[data-testimonials-avatar]').src;
    modalImg.alt = this.querySelector('[data-testimonials-avatar]').alt;
    modalTitle.innerHTML = this.querySelector(
      '[data-testimonials-title]',
    ).innerHTML;
    modalText.innerHTML = this.querySelector(
      '[data-testimonials-text]',
    ).innerHTML;

    testimonialsModalFunc();
  });
}

// add click event to modal close button
modalCloseBtn.addEventListener('click', testimonialsModalFunc);
overlay.addEventListener('click', testimonialsModalFunc);

// custom select variables
const select = document.querySelector('[data-select]');
const selectItems = document.querySelectorAll('[data-select-item]');
const selectValue = document.querySelector('[data-selecct-value]');
const filterBtn = document.querySelectorAll('[data-filter-btn]');

select.addEventListener('click', function () {
  elementToggleFunc(this);
});

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener('click', function () {
    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);
  });
}

// filter variables
const filterItems = document.querySelectorAll('[data-filter-item]');

const filterFunc = function (selectedValue) {
  for (let i = 0; i < filterItems.length; i++) {
    if (selectedValue === 'all') {
      filterItems[i].classList.add('active');
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add('active');
    } else {
      filterItems[i].classList.remove('active');
    }
  }
};

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {
  filterBtn[i].addEventListener('click', function () {
    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove('active');
    this.classList.add('active');
    lastClickedBtn = this;
  });
}

// contact form variables
const formInputs = document.querySelectorAll('[data-form-input]');
const formBtn = contactForm.querySelector('.form-btn');

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener('input', function () {
    // check form validation
    if (contactForm.checkValidity()) {
      formBtn.removeAttribute('disabled');
    } else {
      formBtn.setAttribute('disabled', '');
    }
  });
}

// page navigation variables
const navigationLinks = document.querySelectorAll('[data-nav-link]');
const pages = document.querySelectorAll('[data-page]');

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener('click', function () {
    const clickedPage = this.innerHTML.toLowerCase().trim();

    for (let j = 0; j < pages.length; j++) {
      if (clickedPage === pages[j].dataset.page) {
        pages[j].classList.add('active');
        window.scrollTo(0, 0);
      } else {
        pages[j].classList.remove('active');
      }
    }

    for (let j = 0; j < navigationLinks.length; j++) {
      if (this === navigationLinks[j]) {
        navigationLinks[j].classList.add('active');
      } else {
        navigationLinks[j].classList.remove('active');
      }
    }
  });
}
