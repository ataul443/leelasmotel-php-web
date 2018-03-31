function main() {
  $(".wrapper").css("display", "");
  selectedOrders = [];
  initialData("inprocess");

  $("#search-i").click(function() {
    var searchQuery = $("#search").val();
    searchQuery = searchQuery.toUpperCase();
    var cat = $("#status-heading").text();
    var temp = cat.split(" ");
    cat = temp[0];
    cat = cat.toLowerCase();

    if (!searchQuery || searchQuery.length == 0) {
      return;
    } else {
      searchDatabase(searchQuery, cat);
    }
  });

  $("#action-btn").click(function() {
    var updatesArray = selectedId();
    var updates = updatesArray[0];
    $("#action-btn").text("Submitting...");

    Promise.all(
      updates.map(function(id) {
        var refIn = firebase.database().ref(`/database/orders/inprocess/${id}`);
        return refIn.once("value").then(function(snapshot) {
          ////console.log("Success", id);
          return snapshot.val();
        });
      })
    )
      .then(function(dataArray) {
        var dataUpdates = {};

        var action = actionManager();
        if (action) {
          for (var item of dataArray) {
            item.order.status = action;
            dataUpdates[`${item.order.orderId}`] = item;
            //console.log("inner", dataUpdates, "dataArray", dataArray);
          }
          var refUpdate = firebase.database().ref(`/database/orders/${action}`);
          refUpdate.update(dataUpdates).then(function() {
            var updates = selectedId();
            var delUpdates = updates[0];
            var mobiles = updates[1];
            var mobilesSize = Object.keys(mobiles).length;
            Promise.all(
              delUpdates.map(function(id) {
                var refIn = firebase
                  .database()
                  .ref(`/database/orders/inprocess/${id}`);
                refIn.set(null);
              })
            ).then(function() {
                initialData("inprocess");
              })
              .catch(function(error) {
                alert(`Error: ${error}`);
                $("#action-btn").text("Submit");
              });
            if (mobilesSize > 0) {
              messageSender(mobiles, action);
            } else {
              alert("Mobile Numbers Not FOUND!!");
              $("#action-btn").text("Submit");
              return
            }
            
          });
        }
      })
      .catch(function(error) {
        alert(`Error: ${error}`);
        $("#action-btn").text("Submit");
      });
  });

  $(document).on("click", "td a", function(e) {
    window.sessionStorage.setItem("ro_orderId", e.target.id);
    window.location.href = "orderDetail.html";
  });

  $("#status-selector").change(function() {
    var temp = statusManager();
    if (temp == null) {
      return;
    }
    var status = temp[0];
    var heading = temp[1];

    //////console.log(temp);
    if (status) {
      initialData(status);
      if (status != "inprocess") {
        $("#action-container").css("display", "none");
      } else {
        $("#action-container").css("display", "flex");
      }
      $("#status-heading").text(`${heading} Orders`);
    }
    return;
  });
}

function dataOrganizer(data, rows) {
  var dataPerPage = [];
  var keys = Object.keys(data);
  var dataSize = keys.length;
  ////////console.log(dataSize);
  var j = 0,
    k = rows;
  for (var i = 0; i <= dataSize; i += rows) {
    var reqKey = keys.slice(j, k);
    if (reqKey.length == 0) {
      break;
    }
    var reqRow = [];
    for (var key of reqKey) {
      reqRow.push({
        [key]: data[key]
      });
    }
    dataPerPage.push(reqRow);
    j = k;
    k = k + rows;
  }

  return dataPerPage;
}

function dataPopulator(stack) {
  $("#tBody").html("");
  for (var item of stack) {
    //console.log("item", item);
    var key = Object.keys(item);
    key = key.toString();
    var reqElement = item[key];
    window.sessionStorage.setItem(key, JSON.stringify(reqElement));

    $("#tBody").append(`
  
      <tr id="${key}">
      
                                      <td id="checkbox${key}" scope="row">
                                      <div class="form-check">
                                          <label class="contain">
                                              <input name ="rowData" id="inputCheckbox-${key}" type="checkbox" class="form-check-input">
                                              <span class="form-check-sign"></span>
                                          </label>
                                          </div>
                                      </td>
                                      <td id="orderId${key}">${key}</td>
                                      <td id="customer-${key}">${
      reqElement.customerName
    }</td>
                                      <td id="unpaidCost-${key}">${
      reqElement.order.cost.unpaid
    } Rs</td>
                                      <td id="total${key}">${
      reqElement.order.cost.total
    } Rs</td>
                                      <td id="orderDate${key}">0${
      reqElement.order.orderDate
    }</td>
                                      <td id="delivery${key}">${
      reqElement.order.extra.deliveryDate
    }</td>
    <td><a id="${key}"> More Info<style type="text/css">
    #detailData:hover {
        text-decoration: underline;
    }
</style> </a></td>
      <td class="hidden" id="mobile-${key}">${reqElement.customerMobile}</td>
                                  </tr>
  
      `);
  }
}

function searchDatabase(query, category) {
  var orderRef = firebase.database().ref(`/database/orders/${category}`);
  var orderTerm = '';
  if(Number(query)) orderTerm = 'customerMobile';
  else orderTerm = 'customerName';

  orderRef
    .orderByChild(orderTerm)
    .startAt(query)
    .endAt(query + "\uff8f")
    .once("value", function(snapshot) {
      var data = snapshot.val();
      //console.log(data);
      if (data == null) {
        alert("No Record Found!!");
        ////console.log(category);
        return;
      }
      var data = snapshot.val();
      var totalDataSize = Object.keys(data).length;
      var reqRows = totalDataSize >= 10 ? 10 : totalDataSize;
      organisedData = dataOrganizer(data, reqRows);
      dataControl(organisedData, reqRows, totalDataSize);
    });
}

function dataControl(organisedData, reqRows, totalDataSize) {
  var pages = organisedData.length;
  var stack = organisedData[0];
  dataPopulator(stack);
  var counter = 0;
  if (pages <= 1) {
    $("#page-next").addClass("disabled");
  }
  $("#rowIndicator").text(`Showing 1 to ${reqRows} of ${totalDataSize} Rows`);
  Btn(counter, pages, organisedData, reqRows, totalDataSize);
}

function initialData(status) {
  var ordersRef = firebase.database().ref(`/database/orders/${status}`);

  return ordersRef.once("value").then(function(snapshot) {
    var originalData = snapshot.val();
    if (originalData == undefined || originalData == null) {
      $("#tBody").html("");
      alert("No data Found");

      return;
    }
    var keys = Object.keys(originalData);
    keys = keys.reverse();
    var data = {};
    for (var key of keys) {
      data[key] = originalData[key];
    }
    var totalDataSize = Object.keys(data).length;
    var reqRows = totalDataSize >= 10 ? 10 : totalDataSize;
    organisedData = dataOrganizer(data, reqRows);
    dataControl(organisedData, reqRows, totalDataSize);
  });
}

function Btn(counter, pages, organisedData, reqRows, totalDataSize) {
  $("#page-next, #page-pre").click(function(e) {
    //////console.log(counter, pages, reqRows);
    if (e.target.text == "Next") {
      if (counter != pages) {
        $("#page-pre, #page-next").removeClass("disabled");
      }

      if (counter < pages - 1) {
        counter++;
        var newStack = organisedData[counter];
        //////console.log(newStack);

        dataPopulator(newStack);
        $("#page-item a").text(counter + 1);
        $("#rowIndicator").text(`
          Showing ${1 + counter * reqRows} to ${
          reqRows * (counter + 1) > totalDataSize
            ? totalDataSize
            : reqRows * (counter + 1)
        } of ${totalDataSize} entries.
        `);

        //////console.log(counter);
      }
      if (counter + 1 == pages && counter != 0) {
        $("#page-next").addClass("disabled");
      }
    } else if (e.target.text == "Previous") {
      if (counter != pages) {
        $("#page-pre, #page-next").removeClass("disabled");
      }

      if (counter < pages && counter > 0) {
        //////console.log("pre", counter);
        counter--;
        //////console.log("after", counter);
        var newStack = organisedData[counter];
        ////console.log(newStack);

        dataPopulator(newStack);
        $("#page-item a").text(counter + 1);
        $("#rowIndicator").text(`
          Showing ${1 + counter * reqRows} to ${
          reqRows * (counter + 1) > totalDataSize
            ? totalDataSize
            : reqRows * (counter + 1)
        } of ${totalDataSize} entries.
        `);
      }
      if (counter == 0) {
        $("#page-pre").addClass("disabled");
      }
    }
  });
}

function selectedId() {
  var selectedRows = $("tr input[name='rowData']:checked");
  var updates = [],
    mobiles = {};

  for (var item of selectedRows) {
    var temp = item.id.split("-");
    var id = temp[1];
    updates.push(id);
    var mobile = $(`#mobile-${id}`).text();
    var unpaid = $(`#unpaidCost-${id}`).text();
    var customerName = $(`#customer-${id}`).text();
    if (mobile != "XXXXXXXXXX") {
      mobiles[customerName] = [mobile, unpaid];
      //console.log(mobiles);
    }
  }
  ////console.log("mobilesIntermediate", mobiles, updates);
  return [updates, mobiles];
}

function actionManager() {
  var action = $("#action-selector option:selected").val();

  if (action == "What to do?") {
    return null;
  } else if (action == "Completed") {
    action = "completed";
  } else if (action == "Cancel") {
    action = "canceled";
  }
  return action;
}

function statusManager() {
  var status = $("#status-selector")
    .find("option:selected")
    .val();
  var heading;
  if (status == "Status") {
    return null, null;
  } else if (status == "Inprocess") {
    status = "inprocess";
    heading = "Inprocess";
  } else if (status == "Completed") {
    status = "completed";
    heading = "Completed";
  } else {
    status = "canceled";
    heading = "Canceled";
  }
  return [status, heading];
}

function initApp(user) {
  if (user != null || user != undefined) {
    main();
  } else {
    //console.log("user is NOT logged in", user);
    window.location.href = "index.html";
  }

}


window.onload = function() {
var user = JSON.parse(window.localStorage.getItem('userRecentOpticals'));
initApp(user);
};

$(document).ready(function() {
  var element = $(".navbar-brand").text();
  switch (element) {
    case "Status":
      $("#status").addClass("active");
      break;
    case "New Order":
      $("#orders").addClass("active");
      break;
    case "Customer":
      $("#customers").addClass("active");
      break;
    case "Dashboard":
      $("#dashboard").addClass("active");
    default:
      return;
  }
});

function messageSender(mobilesArray, action) {
  var msgCanceled = `Your order canceled`;
  var names = Object.keys(mobilesArray);
  if (names.length > 0) {
    for (var item of names) {
      //console.log(mobilesArray, mobilesArray[item], item);
      var mobile = mobilesArray[item];
      mobile = mobile[0];
      var unpaid = mobilesArray[item];
      unpaid = unpaid[1];
      //console.log(mobilesArray, mobile, unpaid);
      var msgCompleted = `Dear ${item}\n\nYour Order has been completed successfully.Please visit our outlet.\nYour total remaining balance is ${unpaid}.We accept all kind of credit and debit cards.\n\nThanks\nRecent Opticals\n\nB/Nau Jalandhar\n+91 9814855528`;

      if (action != "completed") {
        var msg = msgCanceled;
      } else {
        msg = msgCompleted;
      }
      msg = encodeURI(msg);
      makeCorsRequest(mobile, msg);
      $("#action-btn").text("Submit");
    }
  }
}

function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    // XHR for Chrome/Firefox/Opera/Safari.
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
    // XDomainRequest for IE.
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // CORS not supported.
    xhr = null;
  }
  return xhr;
}

// Helper method to parse the title tag from the response.
function getTitle(text) {
  return text.match("<title>(.*)?</title>")[1];
}

// Make the actual CORS request.
function makeCorsRequest(mobile, msg) {
  // This is a sample server that supports CORS.
  var url = `http://203.129.225.68/API/WebSMS/Http/v1.0a/index.php?username=recentopt&password=123456&sender=RECENT&to=${mobile}&message=${msg}&reqid=1&format={json|text}&route_id=334`;

  var xhr = createCORSRequest("GET", url);
  if (!xhr) {
    alert("CORS not supported");
    return;
  }

  // Response handlers.
  xhr.onload = function() {
    var text = xhr.responseText;
    var title = getTitle(text);
  };

  xhr.onerror = function() {};

  xhr.send();
}

$("#logout").click(function() {
  logout();
});

function logout() {
  window.sessionStorage.clear();
  window.localStorage.clear();
  window.localStorage.removeItem('userRecentOpticals');
  var user = JSON.parse(window.localStorage.getItem('userRecentOpticals'));
  initApp(user);
}
