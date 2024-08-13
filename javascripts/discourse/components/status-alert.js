import Component from "@ember/component";
const API_ENDPOINT = settings.status_endpoint;
const IMPACT = {
  minor: 0,
  major: 1,
  critical: 2
};

export default Component.extend({
  showStatus: null,
  statusText: null,
  statusHref: null,
  indicator: null,

  init() {
    this._super(...arguments);
    this.set(
      "statusHref",
      settings.status_more_info_link.replace(/http(s)*:\/\//g, "")
    );

    if (settings.failed_status_test) {
      this.set("showStatus", true);
      this.set("statusMessage", settings.test_status_message);
      this.set("indicator", settings.test_status_indicator);
    } else {
      try {
        fetch(API_ENDPOINT)
          .then((response) => response.json())
          .then((data) => {
            let { status, incidents } = data;
            
            // if no incidents, show nothing
            if (!incidents.length) {
              this.set("showStatus", false);
              return;
            }

            // we have at least one incident
            // set default display to first incident
            let maxImpact = incidents[0].impact;
            let currentStatusMessage = incidents[0].name;

            // check for higher impact incidents 
            // in case there are multiple active
            for(let incident of incidents) {
              console.log('### incident', {incident});
              let incidentImpact = incident.impact;
              if (IMPACT[incidentImpact] > IMPACT[maxImpact]) {
                maxImpact = incidentImpact;
                currentStatusMessage = incident.name;
              }
            }

            // show status banner
            this.set("statusMessage", currentStatusMessage);
            this.set("indicator", maxImpact);
            this.set("showStatus", true);
          });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn(error);
      }
    }
  },
});
