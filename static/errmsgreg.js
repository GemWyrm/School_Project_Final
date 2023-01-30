const loginForm = document.querySelector('form');
const errormsg = document.getElementById('errormsg');
loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    let formData = new FormData (
        loginForm
    );
    const iterableFormData = formData.entries();
    const body = {};
    for (const pair of iterableFormData) {
        body[pair[0]] = pair[1]
    }
    console.log(body, JSON.stringify(body));
    fetch('/register/auth', {
        method: 'POST',
        headers:{ 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        if (response.redirected) {
            window.location.href = response.url;
        } else {
            return response.text();
        }
    })
    .then((text) => errormsg.textContent = text)
    .catch((error) => errormsg.textContent = `Could not fetch: ${error}`);
});