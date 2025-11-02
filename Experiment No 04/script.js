function validateForm() {
    clearErrors();

    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const mobile = document.getElementById('mobile').value.trim();
    const address = document.getElementById('address').value.trim();

    let isValid = true;

    if (firstName === "") {
        setError('firstNameError', 'First Name should not be empty.');
        isValid = false;
    } else if (firstName.length < 6) {
        setError('firstNameError', 'First Name should not be less than 6 characters.');
        isValid = false;
    } else if (!/^[A-Za-z]+$/.test(firstName)) {
        setError('firstNameError', 'First Name should contain only alphabets.');
        isValid = false;
    }

    if (lastName === "") {
        setError('lastNameError', 'Last Name should not be empty.');
        isValid = false;
    }

    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (email === "") {
        setError('emailError', 'E-mail ID should not be empty.');
        isValid = false;
    } else if (!emailPattern.test(email)) {
        setError('emailError', 'E-mail ID must follow the standard pattern.');
        isValid = false;
    }

    if (password === "") {
        setError('passwordError', 'Password should not be empty.');
        isValid = false;
    } else if (password.length < 6) {
        setError('passwordError', 'Password should not be less than 6 characters.');
        isValid = false;
    }

    const mobilePattern = /^\d{10}$/;
    if (mobile === "") {
        setError('mobileError', 'Mobile Number should not be empty.');
        isValid = false;
    } else if (!mobilePattern.test(mobile)) {
        setError('mobileError', 'Mobile Number should contain 10 digits only.');
        isValid = false;
    }

    if (address === "") {
        setError('addressError', 'Address should not be empty.');
        isValid = false;
    }

    if (isValid) {
        alert('Registration Successful!');
    }

    return isValid;
}

function setError(id, message) {
    document.getElementById(id).innerText = message;
}

function clearErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(element => {
        element.innerText = '';
    });
}
