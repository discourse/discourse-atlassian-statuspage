import Component from "@ember/component";
const API_ENDPOINT = settings.status_endpoint;

export default Component.extend({
  showStatus: null,
  statusText: null,
  statusHref: null,
  inidcator: null,

  init() {
    this._super(...arguments);
    this.set(
      "statusHref",
      settings.status_more_info_link.replace(/http(s)*:\/\//g, "")
    );

    if (settings.failed_status_test) {
      this.set("showStatus", true);
      this.set("statusMessage", settings.test_status_message);
      this.set("indicator", settings.test_status_indicator)
    } else {
      try {
        fetch(API_ENDPOINT)
          .then(response => response.json())
          .then(data => {
            let { status } = data;
            if (status.description !== "All Systems Operational") {
              let statusMessage =
                status.inidcator.toLowerCase() === "minor"
                  ? settings.minor_status_message
                  : status.indicator.toLowerCase() === "major"
                  ? settings.major_status_message
                  : settings.critical_status_message;

              this.set("statusMessage", statusMessage);
              this.set("indictor", status.inidcator.toLowerCase());
              this.set("showStatus", true);
            }
          });
      } catch (error) {
        console.warn(error);
      }
    }
  }
});
