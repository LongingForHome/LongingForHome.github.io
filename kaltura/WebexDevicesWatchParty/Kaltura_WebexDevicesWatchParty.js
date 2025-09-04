// This macro will use the Kaltura API to find upcoming live events that it should display/stream on the device

//IMPORTANT: this assumes xConfiguration RoomScheduler Enabled is True as we make use of the Bookings endpoint on the device

import xapi from 'xapi';

// Setting up some base variables 
let resourceId = 0; // this will get defined when the resourceRegistrationCheck() is called
const checkInterval = 60000;
const appTokenId = '';
const appToken = '';
const partnerId = ;
const secret = '';
const uiConfId = ;  // for this player, ensure that it is set to Autoplay = true
const kalturaApiBaseUrl = 'https://www.kaltura.com/api_v3';
// set url syntax for events
//V7 player
const eventUrlBase = "https://cdnapisec.kaltura.com/p/" + partnerId + "/embedPlaykitJs/uiconf_id/" + uiConfId + "?iframeembed=true&entry_id=";
//V2 player
//let eventUrlBase = "https://cdnapisec.kaltura.com/p/" + partnerId + "/sp/" + partnerId + "00/embedIframeJs/uiconf_id/" + uiConfId + "/partner_id/" + partnerId + "?iframeembed=true&playerId=kaltura_player&entry_id=";

// array to hold upcoming events that we get from Kaltura API
let upcomingEvents = new Map();

let session = "";
// parameters used to call the session.start() service of Kaltura API
let sessionParams = {
  expiry: 86400,
  partnerId: partnerId,
  secret: secret,
  type: 2,
  userId: '' //this needs to be handled by device user accounts and groups
};

// filter parameters used to call the scheduleEvent.list() service of Kaltura API
let eventListParams = {
  filter: {
    resourceIdEqual: resourceId,
    objectType: 'KalturaLiveStreamScheduleEventFilter',
    startDateGreaterThanOrEqual: Math.round(Date.now() / 1000)
  }
};

// function to find Map entries by GUID
function getMapItemByChildValue(map, childKey, childValue) {
  for (const [key, value] of map.entries()) {
    if (value[childKey] === childValue) {
      return [key, value];
    }
  }
  return ""; // Return empty string if no match is found
}

// GUID generator
function generateGUID() {
  return xapi.command('HttpClient Get', { 'Header': 'Content-Type: application/json' , 'Url': 'https://www.uuidgenerator.net/api/guid', 'AllowInsecureHTTPS': 'False', 'ResultBody': 'PlainText'});
}

// function to get Webex device info
async function getDeviceInformation() {
  const resourceName = await xapi.status.get('SystemUnit BroadcastName').catch(e => {return ''});
  const resourceModel = await xapi.status.get('SystemUnit ProductId').catch(e => {return ''});
  let deviceInfo = {Name: resourceName, Model: resourceModel};
  return deviceInfo;
}

// function to start a Kaltura API session
function sessionStart(params) {
  logger('starting Kaltura API session');
  return xapi.command('HttpClient Post', { 'Header': 'Content-Type: application/json' , 'Url': kalturaApiBaseUrl + '/service/session/action/start?format=1', 'AllowInsecureHTTPS': 'False', 'ResultBody': 'PlainText'}
     , JSON.stringify(params));
}

// function to check if the device is registered to Kaltura and if not, then register
function resourceRegistrationCheck() {
  logger('starting resourceRegistrationCheck');
  
  return new Promise((resolve, reject) => {
    // get Webex device information
    getDeviceInformation().then(
      function (getDeviceInfoSuccess) {
        logger('retrieved Webex device info');
        let deviceInfo = getDeviceInfoSuccess;
        logger(JSON.stringify(deviceInfo));

        // now, start a Kaltura API session
        sessionStart(sessionParams).then(
          function (sessionStartSuccess) {
            let ks = sessionStartSuccess.Body.replace(/['"]+/g, '');
            if (ks.includes("{")) {
              return reject('failed to start Kaltura API session: ' + ks);
            }

            logger('successfully started Kaltura API session: ' + ks);
            let resourceListFilter = { filter: { nameEqual: deviceInfo.Name } };

            // check for existing registration
            logger('checking registration status for resource ' + deviceInfo.Name);
            xapi.command('HttpClient Post', { 
              'Header': 'Content-Type: application/json', 
              'Url': kalturaApiBaseUrl + '/service/schedule_scheduleresource/action/list?format=1&ks=' + ks, 
              'AllowInsecureHTTPS': 'False', 
              'ResultBody': 'PlainText'
            }, JSON.stringify(resourceListFilter)).then(
              function (scheduleResourceListSuccess) {
                let resourceList = JSON.parse(scheduleResourceListSuccess.Body);
                if (resourceList.totalCount == 1) {
                  resourceId = resourceList.objects[0].id;
                  logger('found resource with id: ' + resourceId);
                  resolve(true);
                } else {
                  logger('resource not found');
                  let resourceAddFilter = { 
                    scheduleResource: {
                      objectType: "KalturaLocationScheduleResource",
                      description: deviceInfo.Name,
                      name: deviceInfo.Name,
                      systemName: deviceInfo.Name,
                      tags: "webex_device," + deviceInfo.Model
                    }
                  };

                  xapi.command('HttpClient Post', { 
                    'Header': 'Content-Type: application/json',
                    'Url': kalturaApiBaseUrl + '/service/schedule_scheduleresource/action/add?format=1&ks=' + ks, 
                    'AllowInsecureHTTPS': 'False', 
                    'ResultBody': 'PlainText'
                  }, JSON.stringify(resourceAddFilter)).then(
                    function (resourceAddSuccess) {
                      let resourceAddResult = JSON.parse(resourceAddSuccess.Body);
                      resourceId = resourceAddResult.id;
                      logger('successfully registered device to Kaltura. New resourceId: ' + resourceId);
                      resolve(true);
                    },
                    function (resourceAddError) {
                      reject('failed to register resource with Kaltura');
                    }
                  );
                }
              },
              function (scheduleResourceListError) {
                reject('failed to get list of resources from Kaltura API');
              }
            );
          },
          function (sessionStartError) {
            reject('failed to start Kaltura API session');
          }
        );
      },
      function (getDeviceInfoError) {
        reject('failed to retrieve Webex device info');
      }
    );
  });
}

// Function to get a list of events in Kaltura associated with the device resource
function getEventsList() {
  //first need to get a session
  sessionStart(sessionParams).then(
    (result) => {
      let ks = result.Body.replace(/['"]+/g, '');
      session = ks; //temp
      let listUrl = kalturaApiBaseUrl + '/service/schedule_scheduleevent/action/list?format=1&ks=' + ks;
      //logger(listUrl);
      eventListParams.filter.resourceIdEqual = resourceId;
      eventListParams.filter.startDateGreaterThanOrEqual = Math.round(Date.now() / 1000);
      xapi.command('HttpClient Post', { 'Header': 'Content-Type: application/json' , 'Url': listUrl, 'AllowInsecureHTTPS': 'False', 'ResultBody': 'PlainText'}
      , JSON.stringify(eventListParams)).then(
        (response) => {
          logger(response.Body);
          let kEventList = JSON.parse(response.Body);
          if (kEventList.totalCount > 0) {
            // loop through events and pass to handleEvent() 
            kEventList.objects.forEach(handleListEvent);
          }          
        }
      );
    }
  );
}

// Function to handle events returned from the getEventsList() and validate their Booking status and Map existence
function handleListEvent(event) {
  logger('handling event passed from getEventsList()');
  logger(JSON.stringify(event));
  // event.summary = title
  // event.startDate and event.endDate
  // event.templateEntryId
  // check if the event already has a booking entry
  // see if we know of a Booking GUID
  let eventInfo = upcomingEvents.get(event.templateEntryId);
  if (eventInfo !== undefined){
    logger('checking for booking');
    xapi.command('Bookings Get', {Id: eventInfo.GUID}).then(
      function (success) {
        // Booking exists
        logger('Booking exists');
        logger(success);
        //@TODO: should add some logic here to verify the event time hasn't changed
      },
      function (error) {
        //handle error here
      }
    );
  } else {
    let startTime = new Date(event.startDate * 1000);
    let duration = (event.endDate - event.startDate) / 60;
    // generate a GUID
    let GUID = generateGUID().then(
      function (success) {
        // add the event to the device Bookings
        xapi.command('Bookings Book', {BookingRequestUUID: GUID.Body, Duration: duration, StartTime: startTime.toISOString(), Title: event.summary}).then(
          function (success) {
            // and add/update the Map
            upcomingEvents.set(event.templateEntryId, {State: 'inactive', GUID: GUID, Event: event});
          },
          function (error) {
            // handle the error
            logger('failed to add booking');
            logger(error);
          }
        );
      },
      function (error) {
        logger('failed to retrieve GUID');
      }
    );
  } 
}

// function to handle Booking events triggered in the UI (can probably rewrite to handle this more elegantly with case statements)
function bookingHandler(event) {
  logger('Bookings UI event');
  logger(event);
  // convert to object
  let eventObj = JSON.parse(event);
  // handle event start or checkin
  if (('Start' in eventObj) || ('CheckedIn' in eventObj)) {
    let eventId = '';
    if ('Start' in eventObj) {
      eventId = eventObj.Start.Id;
      logger('Bookings Start event caught for id ' + eventId);
    } else if ('CheckedIn' in eventObj) {
      eventId = eventObj.CheckedIn.Id;
      logger('Bookings CheckedIn event caught for id ' + eventId);
    } else {
      logger('somehow we missed Start or CheckedIn');
    }
    // check if the event is a relevant Kaltura event
    if (upcomingEvents.has(eventId)) {
      logger('matched Booking to Kaltura event');
      // check to see if event is already actively launched and launch if it is 'inactive'
      let eventInfo = upcomingEvents.get(eventId);
      if (eventInfo.State == 'inactive') {
        // Get the event timeframe and generate a ks for the event
        xapi.command('Bookings Get', {Id: eventId}).then(
          function (BookingGetSuccess) {
            logger('Booking details');
            logger(BookingGetSuccess);
            let bookingDetail = JSON.parse(BookingGetSuccess);
            // generate the ks
            let eventSessionParams = sessionParams;
            //@TODO: should calculate session expiry based on event duration
            //eventSessionParams.expiry = 
            sessionStart(eventSessionParams).then(
              function (SessionStartSuccess) {
                let ks = SessionStartSuccess.Body.replace(/['"]+/g, '');
                // now take the ks and append to the eventBaseUrl and launch
                let eventUrl = eventUrlBase + eventObj.Start.Id + "&ks=" + ks;
                logger('generated url for event launch: ' + eventUrl);
                xapi.command('UserInterface WebView Display', {Title: bookingDetail.Booking.Title, URL: eventUrl});
                // set the event to active
                let update = upcomingEvents.get(eventId);
                update.State = 'active';
                upcomingEvents.set(eventId, update);
                // check if the reminder popup is there and see if we can dismiss it so it's not overlaying the stream
              },
              function (error) {
                logger('unable to generate session for event start');
              }
            );
          },
          function (error) {
            //@TODO: need to somehow handle here
            logger('failed to get Booking for event');
          }  
        );
      } else {
        logger('event is already active');
      }      
    }    
  // handle Booking end or ManualCheckOut
  } else if (('End' in eventObj) || ('Deleted' in eventObj)){
    let eventId = '';
    if ('End' in eventObj) {
      eventId = eventObj.End.Id;
      logger('Bookings "End" event caught for id ' + eventId);
    } else if ('Deleted' in eventObj) {
      eventId = eventObj.Deleted.Id;
      if (eventObj.Deleted.Cause == 'ManualCheckOut') {
        logger('ManualCheckOut event caught for id ' + eventId);
      } else {
        logger('unhandled Deleted event');
      }
    }
    //@TODO: need more robust logic to see if the Booking is indeed a Kaltura event
    // the End or ManualCheckOut events will automatically clear the Booking, so we just need to handle the Map and session closure
    // Check the stream display state
    let event = upcomingEvents.get(eventId);
    if (event.State == 'active') {
      // close the browser
      xapi.command('UserInterface WebView Clear', {Target: 'OSD'});
      // and remove event from upcomingEvents map (no need to change the State since we're just deleting the event anyway)
      upcomingEvents.delete(eventId);
      //@TODO: consider running xCommand RoomCleanup Run to clear any sessions from the device
    }
  } else {
    logger('Bookings UI event not handled');
  }
}

function startAppTokenSession(){
  //start a widget session with Kaltura API
  logger("session check");
  let widgetJson = {expiry: 86400, widgetId: "_1688742"};
  // try to get a widget session
  xapi.command('HttpClient Post', { 'Header': 'Content-Type: application/json' , 'Url': kalturaApiBaseUrl + '/service/session/action/startWidgetSession?format=1', 'AllowInsecureHTTPS': 'False', 'ResultBody': 'PlainText'}
     , JSON.stringify(widgetJson)).then(
    (response) => {
      //hash the KS with the appToken
      
    });   
}

// Generic logging function
function logger(message) {
  // replace the console.log with any custom logging you may have
  console.log(message);
}

// main function to trigger the macro to run
function main() {
  // first, we need to check registration status
  try {
    // check resource registration to Kaltura
    resourceRegistrationCheck().then(
      function (success) {
        // initial check for upcoming events
        getEventsList();
        // then schedule periodic interval check
        setInterval(getEventsList, checkInterval);
        // and finally register booking event handler
        xapi.event.on('Bookings', bookingHandler);
      },
      function (error) {
        logger(error);
      }
    );
  } catch (e) {
    logger(e);
  }
}

// start the process
main();


//@TODO

//add logic route to bypass bookings
//add GUID generator
//entitlements for sessions
//appTokens