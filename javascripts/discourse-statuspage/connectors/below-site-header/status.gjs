import Component from "@ember/component";
import { classNames } from "@ember-decorators/component";
import StatusAlert from "../../../discourse/components/status-alert";

@classNames("below-site-header-outlet", "status")
export default class Status extends Component {
  <template><StatusAlert /></template>
}
