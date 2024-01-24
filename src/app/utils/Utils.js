export class Utils {
    /**
     * forEach implementation for Objects/NodeLists/Arrays, automatic type loops and context options
     * 
     * @param {Array|Object|NodeList} collection - Collection of items to iterate, could be an Array, Object or NodeList
     * @param {Function} callback - Callback function for each iteration.
     * @param {any} [scope=null] - The value to use as `this` when executing callback.
     */
    static forEach(collection, callback, scope = null) {
      if (Object.prototype.toString.call(collection) === "[object Object]") {
        for (const [key, value] of Object.entries(collection)) {
          callback.call(scope, value, key, collection);
        }
      } else {
        for (let i = 0; i < collection.length; i++) {
          callback.call(scope, collection[i], i, collection);
        }
      }
    }
  }