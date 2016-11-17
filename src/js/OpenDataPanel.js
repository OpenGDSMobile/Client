/**
 * Created by intruder on 16. 11. 17.
 */
goog.provide('openGDSMobile.OpenDataPanel');

goog.require('openGDSMobile.util.applyOptions');
goog.require('goog.dom');
goog.require('goog.array');


openGDSMobile.OpenDataPanel = function(_apiBaseURL, _collectionName){
  this.baseURL = _apiBaseURL;
  this.collection = _collectionName;

}