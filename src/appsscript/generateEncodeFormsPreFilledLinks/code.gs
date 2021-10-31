// 
// implementacion
// descripcion: v0.0.1
// url: https://script.google.com/macros/s/AKfycbzOsyPiQLvrlr8MOE_YHSkbvJ-N2keuASO_LCYldJm5d5UaEuVUyyzHRnPWg8iEAo46/exec
// 
"use strict";

function doGet(e){
  const email = e.parameter.email;
  const formsURLs = e.parameters.formsURLs;
  
  let preFilledResponses = [];

  for (let formURL of formsURLs){
    preFilledResponses.push(generateNewResponse(email, formURL));
  }

  return ContentService.createTextOutput(JSON.stringify(preFilledResponses)).setMimeType(ContentService.MimeType.JSON); 
}

function generateNewResponse(email, formURL){
  const form = FormApp.openByUrl(formURL);
  const formId = form.getId();
  const isResponded = false;
  let formItems = form.getItems();
  let newFormResponse = form.createResponse();
  
  let emailItem = formItems[0].asMultipleChoiceItem().setChoiceValues([email]);
  let itemResponse = emailItem.createResponse(email);
  newFormResponse.withItemResponse(itemResponse);

  const preFilledURL = newFormResponse.toPrefilledUrl();

  const newResponse = {
    formID: formId,
    preFilledURL: preFilledURL,
    isResponded: isResponded
  };
  return newResponse;
}
