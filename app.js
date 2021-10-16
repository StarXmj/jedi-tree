  // Client ID and API key from the Developer Console
  var CLIENT_ID = '147729448139-8tn66o3dkg1bnq2o3lka0n9qogf1m1v2.apps.googleusercontent.com';
  var API_KEY = 'AIzaSyA0KyC0zUFKJAHCH9cf7vmnElyBT4BP7LI';

  // Array of API discovery doc URLs for APIs used by the quickstart
  var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

  // Authorization scopes required by the API; multiple scopes can be
  // included, separated by spaces.
  var SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

  var authorizeButton = document.getElementById('authorize_button');
  var signoutButton = document.getElementById('signout_button');

  /**
   *  On load, called to load the auth2 library and API client library.
   */
  function handleClientLoad() {
      gapi.load('client:auth2', initClient);
  }

  /**
   *  Initializes the API client library and sets up sign-in state
   *  listeners.
   */
  function initClient() {
      gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES
      }).then(function() {
          // Listen for sign-in state changes.
          gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

          // Handle the initial sign-in state.
          updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
          authorizeButton.onclick = handleAuthClick;
          signoutButton.onclick = handleSignoutClick;
      }, function(error) {
          appendPre(JSON.stringify(error, null, 2));
      });
  }

  /**
   *  Called when the signed in status changes, to update the UI
   *  appropriately. After a sign-in, the API is called.
   */
  function updateSigninStatus(isSignedIn) {
      if (isSignedIn) {
          authorizeButton.style.display = 'none';
          signoutButton.style.display = 'block';
          createDuo();
      } else {
          authorizeButton.style.display = 'block';
          signoutButton.style.display = 'none';
      }
  }

  /**
   *  Sign in the user upon button click.
   */
  function handleAuthClick(event) {
      gapi.auth2.getAuthInstance().signIn();
  }

  /**
   *  Sign out the user upon button click.
   */
  function handleSignoutClick(event) {
      gapi.auth2.getAuthInstance().signOut();
  }

  /**
   * Append a pre element to the body containing the given message
   * as its text node. Used to display the results of the API call.
   *
   * @param {string} message Text to be placed in pre element.
   */
  function appendPre(message) {
      var pre = document.getElementById('content');
      var textContent = document.createTextNode(message + '\n');
      pre.appendChild(textContent);
  }

  /**
   * Print the names and majors of students in a sample spreadsheet:
   * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
   */
  async function createRanges(letter, n) {
      var ranges = []
      for (var i = 2; i < n; i++) {
          ranges.push(letter + i)

      }
      //console.log(ranges)
      return ranges

  }


  async function numberOfCell(colonne) {
      return gapi.client.sheets.spreadsheets.values.get({
          spreadsheetId: "1zuICXUxw2OiKN2q9JO76DoVCaSLMcyVs_gbLlewuEMo",
          range: "q1"
      }).then((response) => {
          var result = response.result;
          var numRows = result.values;
          var finale = parseInt(numRows[0][0]);

          //console.log((typeof finale) + " " + finale)
          var nb = finale + 2;
          ranges = createRanges(colonne, nb)

          //for (var i = 2; i <= (go2() + 2); i++) {
          // ranges.push(i);

          //console.log(Promise.resolve(nb));
          // }

          //console.log(ranges);

          return Promise.resolve(ranges);
      });

  }

  async function getCell(colonne) {


      return numberOfCell(colonne).then((value) => {
          //console.log(value);
          // expected output: 123


          return gapi.client.sheets.spreadsheets.values.batchGet({
              spreadsheetId: "1zuICXUxw2OiKN2q9JO76DoVCaSLMcyVs_gbLlewuEMo",
              ranges: value
          }).then((response) => {
              var result = response.result;
              var resultf = result.valueRanges;
              listef = []
              for (var i = 0; i < resultf.length; i++) {
                  // console.log(i);
                  listef.push(resultf[i]["values"][0][0])


              }
              // console.log(listef

              return listef
          });
      });

  }

  async function createDuo() {
      google.charts.load('current', { packages: ["orgchart"] });
      google.charts.setOnLoadCallback(drawChart);

      return getCell("b").then(async(value) => {
          var name = value
          const value_3 = await getCell("d");
          var master = value_3;
          console.log(value_3);
          const value_5 = await getCell("g");
          var padawan = value_5;
          console.log(value_5);
          var liste = [];

          for (var k = 0; k < name.length; k++) {
              liste.push([name[k], master[k]])

          }
          var liste3 = []
          var liste4 = []


          for (var i = 0; i < 8; i++) {
              for (var j = 0; j < padawan[i].split(",").length - 1; j++) {

                  liste3.push(padawan[i].split(',')[j])

              }
          }
          liste4 = push(liste3)




          console.log(liste4)







          var data = new google.visualization.DataTable();
          data.addColumn('string', 'Name');
          data.addColumn('string', 'Manager');


          // For each orgchart box, provide the name, manager, and tooltip to show.
          data.addRows(liste);

          // Create the chart.
          var chart = new google.visualization.OrgChart(document.getElementById('chart_div'));
          // Draw the chart, setting the allowHtml option to true for the tooltips.
          chart.draw(data, { 'allowHtml': true });
          //return [name, master, padawan];

      });




  }



  async function drawChart() {

  }