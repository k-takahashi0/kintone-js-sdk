"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * GetViewsRequest model
 */
class GetViewsRequest {
  /**
     * @param {Integer} app
     * @param {String} lang
     */
  constructor(app, lang) {
    this.app = app;
    this.lang = lang;
  }
  /**
     * Get JSON struct of this model
     * @return {JSON}
     */


  toJSON() {
    const data = {
      app: this.app,
      lang: this.lang
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

var _default = GetViewsRequest;
exports.default = _default;