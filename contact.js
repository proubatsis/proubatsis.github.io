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
        if (response.ok) {
            alert("Thank you!");
        } else {
            alert("An error has occured...");
        }
    });
};
