//gets the type of browser
function getNavigatorName() { 
  if((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1 ) {
      return 'Opera';
  } else if(navigator.userAgent.indexOf("Chrome") != -1 ) {
      return 'Chrome';
  } else if(navigator.userAgent.indexOf("Safari") != -1) {
      return 'Safari';
  } else if(navigator.userAgent.indexOf("Firefox") != -1 ){
      return 'Firefox';
  } else if((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.documentMode == true )) {
      return 'IE';//crap
  } else {
      return 'Unknown';
  }
} 

export const navigatorName = getNavigatorName();
export const Browser = (chrome != undefined)? chrome : browser;
export const webexVersion = "0.4.0"

/**
 * Writing date in a "time ago" format
 * @param {*} date 
 * @returns 
 */
export function timeSince(date) {

    //return date;

    var seconds = Math.floor((new Date() - date) / 1000);
  
    var interval = seconds / 31536000;
    let s = "";
    if (interval >= 1) {
      s = (interval >= 2) ? "s":"";
      return Math.floor(interval) + " year"+s;
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      s = (interval >= 2) ? "s":"";

      return Math.floor(interval) + " month"+s;
    }
    interval = seconds / 86400;
    if (interval > 1) {
      s = (interval >= 2) ? "s":"";

      return Math.floor(interval) + " day"+s;
    }
    interval = seconds / 3600;
    if (interval > 1) {
      s = (interval >= 2) ? "s":"";

      return Math.floor(interval) + " hour"+s;
    }
    interval = seconds / 60;
    if (interval > 1) {
      s = (interval >= 2) ? "s":"";

      return Math.floor(interval) + " minute"+s;
    }
    s = (interval >= 2) ? "s":"";

    return Math.floor(seconds) + " second"+s;
  }

  /**
   * Get a parent node by its class
   * @param {*} DOMelement child DOM element
   * @param {*} class CSS class to identify the parent
   * @returns The closest parent with the given CSS class, and null if not found
   */
  export function getClosestParentByClass(DOMelement, className){
    let parent = null;
    let element = DOMelement;
    
    while ( parent == null
    || element.tagName == 'BODY' ) {
      element = element.parentNode;
      if(element.className.split(" ").indexOf(className) != -1)
        parent = element;
    }

    return parent;
  }

  /**
   * Convert an object into an array with its fields
   * @param {Object} o 
   * @param {function} cond The condition for the object field to be taken in a account (parameters are field, object[field], object)
   * @returns A array with the objet fields as items
   */
  export function objectToArray(o,cond){
    let arr = new Array();
    Object.keys(o).forEach((f)=>{
      if(cond == undefined || (cond != undefined && cond(f,o[f],o))){
        arr.push(o[f]);
      }
    })
    return arr;
  }