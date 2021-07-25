const MAX_NAME_LENGTH = 128
const MAX_SUBJECT_LENGTH = 255;
const MAX_CONTENT_LENGTH = 10000;

const DIALOG_DURATION = 2000;
const ID_TO_JSON_MAP = {
    "nameContactField": "name",
    "emailContactField": "email",
    "subjectContactField": "subject",
    "contentContactField": "content",
};

const sendMessageButton = document.getElementById("sendMessageButton");
sendMessageButton.onclick = () => {
    const requestBody = Object.keys(ID_TO_JSON_MAP).reduce((body, id) => {
        return {...body, [ID_TO_JSON_MAP[id]]: document.getElementById(id).value};
    }, {});
    const validationErrors = validateContactForm(requestBody);
    clearValidationErrors();
    if (validationErrors.length > 0) {
        showValidationErrors(validationErrors);
        return;
    }

    showLoadingSpinner();
    fetch(
        "http://contact-api.panagiotis.io/message",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        },
    ).then((response) => {
        hideLoadingSpinner();
        if (response.ok) {
            clearForm();
            showDialog("success");
            window.eventLogClient.sendEvent("SEND_CONTACT_ME_MESSAGE", {
                name: requestBody.name,
                email: requestBody.email,
                subject: requestBody.subject,
            });
        } else if (response.status === 422) {
            showDialog("validation");
            response.json().then((json) => {
                showValidationErrors(json.detail.map(detail => `${detail.loc[detail.loc.length - 1]}: ${detail.msg}`));
            });
        } else {
            showDialog("failure");
        }
    });
};

const showLoadingSpinner = () => {
    for (const child of sendMessageButton.children) {
        if(child.classList.contains("loading-spinner")) {
            child.setAttribute("loading", "");
        } else {
            child.style.display = "none";
        }
    }
};

const hideLoadingSpinner = () => {
    for (const child of sendMessageButton.children) {
        if(child.classList.contains("loading-spinner")) {
            child.removeAttribute("loading");
        } else {
            child.style.display = "";
        }
    }
};

const clearForm = () => {
    Object.keys(ID_TO_JSON_MAP).forEach((id) => {
        document.getElementById(id).value = "";
    });
};

const showDialog = (classToDisplay) => {
    const dialog = document.getElementById("contactConfirmationDialog");
    for (const child of dialog.children) {
        if (child.classList.contains(classToDisplay)) {
            child.style.display = "";
        } else {
            child.style.display = "none";
        }
    }
    dialog.style.display = "";
    setTimeout(hideDialog, DIALOG_DURATION);
};

const hideDialog = () => {
    const dialog = document.getElementById("contactConfirmationDialog");
    dialog.style.display = "none";
};

const clearValidationErrors = () => {
    const validationErrorsElement = document.getElementById("validationErrors");
    validationErrorsElement.innerHTML = "";
};

const showValidationErrors = (validationErrors) => {
    const validationErrorsElement = document.getElementById("validationErrors");
    validationErrorsElement.style.display = "";
    validationErrors.forEach((errorMessage) => {
        const p = document.createElement("p");
        p.innerText = errorMessage;
        validationErrorsElement.appendChild(p);
    });
    showDialog("validation");
    window.eventLogClient.sendEvent("VALIDATE_CONTACT_ME_FAILED", {
        validationErrors: validationErrors.join(", "),
    });
};

const validateContactForm = (requestBody) => {
    const validationErrors = [];
    validateField(requestBody, validationErrors, "name", MAX_NAME_LENGTH);
    validateField(requestBody, validationErrors, "subject", MAX_SUBJECT_LENGTH);
    validateField(requestBody, validationErrors, "email");
    validateField(requestBody, validationErrors, "content", MAX_CONTENT_LENGTH, false);
    if (!/\S+@\S+\.\S+/.test(requestBody.email)) {
        // Verify that email format is roughly correct, it'll be more thoroughly validated by the server.
        validationErrors.push("Invalid email!");
    }
    return validationErrors;
};

const validateField = (requestBody, validationErrors, fieldName, maxLength=0, shouldTrimWhitespace=true) => {
    const value = shouldTrimWhitespace ? requestBody[fieldName].trim() : requestBody[fieldName];
    if (maxLength > 0 && value.length > maxLength) {
        validationErrors.push(`Length of ${fieldName} is too long: ${value.length} > ${maxLength}`);
    } else if (value.length === 0) {
        validationErrors.push(`${fieldName} must not be left blank!`);
    }
};
