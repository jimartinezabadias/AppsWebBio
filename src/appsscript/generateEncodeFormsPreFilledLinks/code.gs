"use strict";

function doGet(e){
  const email = e.parameter.email;
  const formsURLs = e.parameters.formsURLs;
  
  let preFilledResponses = [];

  for (let formURL of formsURLs){
    preFilledResponses.push(generateResponseURL(email, formURL));
  }

  return ContentService.createTextOutput(JSON.stringify(preFilledResponses)).setMimeType(ContentService.MimeType.JSON); 
}

function generateResponseURL(email, formURL){
  let form = FormApp.openByUrl(formURL);
  let formItems = form.getItems();
  let newFormResponse = form.createResponse();
  
  let emailItem = formItems[0].asMultipleChoiceItem().setChoiceValues([email]);
  let itemResponse = emailItem.createResponse(email);
  newFormResponse.withItemResponse(itemResponse);

  let preFilledURL = newFormResponse.toPrefilledUrl();
  return preFilledURL;
}