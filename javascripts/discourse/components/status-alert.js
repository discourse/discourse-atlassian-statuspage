import Component from "@ember/component";
const API_ENDPOINT = settings.status_endpoint;

export default Component.extend({
  showStatus: null,
  statusText: null,
  statusHref: null,

  init() {
    this._super(...arguments);
    this.set("statusHref", settings.status_more_info_link.replace(/http(s)*:\/\//g,""));

    if (settings.failed_status_test) {
      this.set("showStatus", true);
      this.set("statusMessage", settings.failed_status_message);
    } else {
      try {
        fetch(API_ENDPOINT)
        .then(response => response.json())
        .then(data => {
          let { status } = data;
          if (status.description !== "All Systems Operational" ) {
            this.set("statusMessage", settings.failed_status_message)
            this.set("showStatus", true)
          }
        }); 
      } catch (error) {
        console.warn(error)
      }
    }
  },

})