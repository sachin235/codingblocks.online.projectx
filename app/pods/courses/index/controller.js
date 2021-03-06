import Controller from '@ember/controller';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import { alias }  from '@ember/object/computed';

export default Controller.extend({
  queryParams: ['limit', 'offset', 'org'],
  limit: 8,
  offset: 0,
  currentUser: service(),
  organization: alias('currentUser.organization'),
  taskMoreCourses: task(function * () {
    const extraWhere = {}
    const organization = this.organization || this.org
    
    if (organization) {
      extraWhere.organization = organization
    }

    const nextCourses = yield this.store.query ('course', {
      include: 'instructors,runs',
      sort: 'difficulty',
      exclude: 'ratings,instructors.*',
      filter: {
        unlisted: false,
        ...extraWhere
      },
      page:{
        limit: this.limit,
        offset: this.offset
      }
    })
    this.courses.addObjects(nextCourses)
  }),

  actions:{
    loadMore () {
      this.set('limit', Math.min(this.limit + 8, this.count))
      this.taskMoreCourses.perform()
    }
  }
})
