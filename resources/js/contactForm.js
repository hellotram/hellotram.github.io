window.addEventListener('DOMContentLoaded', function () {
    // get the form elements defined in your form HTML above

    var form = document.getElementById('my-form');
    var button = document.getElementById('my-form-button');
    var status = document.getElementById('my-form-status');

    // Success and Error functions for after the form is submitted

    function onSuccess() {
        form.reset();
        button.style = 'display: none ';
        status.innerHTML = 'Thanks! Let\'s keep in touch!';
    }

    function onError() {
        status.innerHTML = 'Oops! There was a problem. Please try again.';
        status.style.color = '#e87e6f';
    }

    // handle the form submission event

    form.addEventListener('submit', function (ev) {
        ev.preventDefault();
        var data = new FormData(form);
        ajax(form.method, form.action, data, onSuccess, onError);
    });
});

// helper function for sending an AJAX request

function ajax(method, url, data, onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== XMLHttpRequest.DONE) return;
        if (xhr.status === 200) {
            onSuccess(xhr.response, xhr.responseType);
        } else {
            onError(xhr.status, xhr.response, xhr.responseType);
        }
    };
    xhr.send(data);
}
