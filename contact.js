const DIALOG_DURATION = 3000;
const ID_TO_JSON_MAP = {
    "nameContactField": "name",
    "emailContactField": "email",
    "subjectContactField": "subject",
    "contentContactField": "content",
};

const sendMessageButton = document.getElementById("sendMessageButton");
sendMessageButton.onclick = () => {
    showLoadingSpinner();
    const requestBody = Object.keys(ID_TO_JSON_MAP).reduce((body, id) => {
        return {...body, [ID_TO_JSON_MAP[id]]: document.getElementById(id).value};
    }, {});
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
            setTimeout(hideDialog, DIALOG_DURATION);
        } else {
            showDialog("failure");
            setTimeout(hideDialog, DIALOG_DURATION);
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
};

const hideDialog = () => {
    const dialog = document.getElementById("contactConfirmationDialog");
    dialog.style.display = "none";
};
