"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * AddFormFieldsRequest model
 */
class AddFormFieldsRequest {
  /**
     * @param {Integer} app
     * @param {Array<HashTable<String, Field>>} fields
     * @param {Integer} revision
     */
  constructor(app, fields, revision) {
    this.app = app;
    this.fields = fields;
    this.revision = revision;
  }
  /**
     * Get JSON struct of this model
     * @return {JSON}
     */


  toJSON() {
    const data = {
      app: this.app,
      properties: this.fields,
      revision: this.revision
    };
    return data;
  }
  /**
     * Convert this model to JSON string
     * @return {String}
     */


  toJSONString() {
    return JSON.stringify(this.toJSON());
  }

}

var _default = AddFormFieldsRequest;
exports.default = _default;