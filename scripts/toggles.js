PLUS = "fa-plus-square";
MINUS = "fa-minus-square";

/**
* Slide toggle an item in the HTML document.
*
* @param {string} toggle - ID of a toggle-bar
* @param {string} item - ID of the element to be toggled
*/
function toggleItem(toggle, item)
{
 // Format in the form: "#toggleID i:first"
 var toggle_selector = "#" + toggle + " i:first";
 // Format in the form: "#itemID"
 var item_selector = "#" + item
 
 var toggle = $(toggle_selector);
 
 if(toggle.hasClass(PLUS))
 {
  // Change plus to minus
  toggle.toggleClass(PLUS + " " + MINUS);
 }
 else
 {
  // Change minus to plus
  toggle.toggleClass(MINUS + " " + PLUS);
 }
 
 $(item_selector).slideToggle();
}

/** Slide toggle the programming language bar graph. */
function toggleProgrammingLanguages()
{
 toggleItem("programming-language-toggle", "programming-language-row");
}

/** Slide toggle the projects. */
function toggleProjects()
{
 toggleItem("projects-toggle", "projects-row");
}

// ==================================================
// Projects Sub-Toggles
// ==================================================

/** Slide toggle android applications (Projects sub-toggle) */
function toggleAndroid()
{
 toggleItem("projects-android-toggle", "projects-android-container");
}

/** Slide toggle ardunio projects (Projects sub-toggle) */
function toggleArduino()
{
 toggleItem("projects-arduino-toggle", "projects-arduino-row");
}

/** Slide toggle ardunio projects (Projects sub-toggle) */
function toggleWeb()
{
 toggleItem("projects-web-toggle", "projects-web-row");
}

/** Slide toggle ardunio projects (Projects sub-toggle) */
function toggleDesktop()
{
 toggleItem("projects-desktop-toggle", "projects-desktop-row");
}
