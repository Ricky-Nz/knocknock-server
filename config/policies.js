/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#!/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.policies.html
 */


module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions (`true` allows public     *
  * access)                                                                  *
  *                                                                          *
  ***************************************************************************/
  '*': false,

  UserController: {
    appLogIn: ['authenticate', 'canLoginApp'],
    webLogIn: ['authenticate', 'canLoginWeb'],
    backendLogIn: ['authenticate', 'canLoginBackend'],

    register: ['userNotRegisted'],
    createClient: ['authorize'],
    createWorker: ['authorize', 'canCreateWorker'],
    createAdmin: ['authorize', 'canCreateAdmin'],

    getClient: ['authorize'],
    getWorker: ['authorize'],
    getAdmin: ['authorize'],
    fileUpload: ['authorize']
  },

  LaundryOrderController: {
    create: ['authorize', 'ensureUid', 'canCreateOrder'],
    update: ['authorize', 'canCreateOrder'],
    find: ['authorize'],
    findOne: ['authorize'],
    destroy: ['authorize']
  }
};
