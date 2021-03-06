import Component from '@ember/component';
import { inject as service } from '@ember-decorators/service';

export default class TalkjsInboxComponent extends Component {
  @service talkjs

  didInsertElement () {
    this._super(...arguments) 

    Talk.ready
      .then(() => this.talkjs.setupSession())
      .then(talkSession => {
        const inbox = talkSession.createInbox()
      inbox.mount(this.element)
      })
  }
}
