const EVENT_LOG_API_URL = "https://event-log-api.panagiotis.io";
class EventLogApiClient {
    constructor() {
        this.clientInfoId = "";
    }

    initialize() {
        return fetch(
            `${EVENT_LOG_API_URL}/client_info/`,
            {
                "method": "POST",
                "headers": {
                    "Content-Type": "application/json",
                },
                "body": JSON.stringify({
                    "app": "8034a2f3-61bc-42ac-a15d-cd2d3b8a8120",
                }),
                credentials: "include",
            },
        )
        .then(response => response.json())
        .then((responseBody) => {
            this.clientInfoId = responseBody.id;
        });
    }

    sendEvent(eventType, data) {
        fetch(
            `${EVENT_LOG_API_URL}/events/`,
            {
                "method": "POST",
                "headers": {
                    "Content-Type": "application/json",
                },
                "body": JSON.stringify({
                    clientInfo: this.clientInfoId,
                    eventType,
                    data,
                }),
                credentials: "include",
            },
        );
    }
}

window.eventLogClient = new EventLogApiClient();
for (const aElement of document.getElementsByTagName("a")) {
    if (aElement.target === "_blank") {
        // This is an external link
        aElement.onclick = () => {
            window.eventLogClient.sendEvent("CLICK_EXTERNAL_LINK", {
                url: aElement.href,
            });
        };
   }
}
