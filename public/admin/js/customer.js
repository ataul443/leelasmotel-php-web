function main() {
  $(".wrapper").css("display", "");
  selectedOrders = [];
  initialData();

  $("#search-i").click(function() {
    var searchQuery = $("#search").val();
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
    var mobiles = updatesArray[1];

    if (updates.length > 0) {
      if (Object.keys(mobiles).length > 0) {
        window.sessionStorage.setItem("mobiles", JSON.stringify(mobiles));
        window.location.href = "message.html";
      } else {
        alert("Mobile Numbers Not Found!!");
        window.sessionStorage.removeItem("mobiles");
        return;
      }
    } else {
      alert("Please Select atleast One Record!");
      window.sessionStorage.removeItem("mobiles");
      return;
    }
  });

  $(document).on("click", "td a", function(e) {
    window.sessionStorage.setItem("customerId", e.target.id);
    window.location.href = "customerDetail.html";
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
    var key = Object.keys(item);
    key = key.toString();
    var reqElement = item[key];
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
                                          <td id="customerId-${key}">${key}</td>
                                          <td id="name-${key}">${
      reqElement.customer.name
    }</td>
                                          <td id="gender${key}">${
      reqElement.customer.gender
    }</td>
                                          <td id="dob${key}">${
      reqElement.customer.dob
    }</td>
                                          <td id="age${key}">${
      reqElement.customer.age
    }</td>
                                          <td id="mobile-${key}">${
      reqElement.customer.mobile
    }</td>
    <td><a id="${key}"  href="#"> More Info<style type="text/css">
    #detailData:hover {
        text-decoration: underline;
    }
</style> </a></td>
      
          `);
  }
}

function searchDatabase(query) {
 var orderRef = firebase.database().ref(`/database/customers`);
  var searchQuery = query.toUpperCase();
  var orderTerm = '';
  if(Number(query)) orderTerm = 'customer/mobile';
  else orderTerm = 'customer/name';
  orderRef
    .orderByChild(orderTerm)
    .startAt(searchQuery)
    .endAt(searchQuery + "\uff8f")
    .once("value", function(snapshot) {
      var data = snapshot.val();
      console.log(data);
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

function initialData() {
  var customersRef = firebase.database().ref(`/database/customers`);
  return customersRef.once("value").then(function(snapshot) {
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
    var customerName = $(`#name-${id}`).text();
    if (mobile != "XXXXXXXXXX") {
      mobiles[customerName] = mobile;
    }
  }
  ////console.log("mobilesIntermediate", mobiles, updates);
  return [updates, mobiles];
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

function JSON2CSV(objArray) {
  var array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;

  var str = "";
  var line = "";

  if ($("#labels").is(":checked")) {
    var head = array[0];
    if ($("#quote").is(":checked")) {
      for (var index in array[0]) {
        var value = index + "";
        line += '"' + value.replace(/"/g, '""') + '",';
      }
    } else {
      for (var index in array[0]) {
        line += index + ",";
      }
    }

    line = line.slice(0, -1);
    str += line + "\r\n";
  }

  for (var i = 0; i < array.length; i++) {
    var line = "";

    if ($("#quote").is(":checked")) {
      for (var index in array[i]) {
        var value = array[i][index] + "";
        line += '"' + value.replace(/"/g, '""') + '",';
      }
    } else {
      for (var index in array[i]) {
        line += array[i][index] + ",";
      }
    }

    line = line.slice(0, -1);
    str += line + "\r\n";
  }
  return str;
}

$('#exampleModal').on('hidden.bs.modal', function (e) {
  $(".modal-body").html("");
  $(".modal-body").append(`<label for='inputDownload'>Enter Download Password</label>
  <input id='inputDownload' class="form-control" type="password"/>`);
  $('#button-download-data').removeClass("hidden");
})
$("#button-download-data").click(function() {
  var downloadPass = $(".modal-body").find('input').map(function(){
    return $(this).val();
  }).get();
  console.log(downloadPass);
  if(downloadPass == null || downloadPass == undefined || downloadPass != 'alliswell' ){
    $(".modal-body").html("");
    $('#button-download-data').addClass("hidden");
    $(".modal-body").append(`<div id="alert" class="alert alert-danger d-none" role="alert">Password Incorrect
    </div>`)
    return;
  }

  var _this = this;
  firebase
    .database()
    .ref("/database/customers")
    .once("value")
    .then(function(snapshot) {
      var data = snapshot.val();
      var newData = [
        {
          "Customer Id": "Customer Id",
          Name: "Name",
          Gender: "Gender",
          DOB: "DOB",
          Age: "Age",
          Mobile: "Mobile",
          Address: "Address"
        }
      ];
      var keys = Object.keys(data);
      for (var key of keys) {
        var name = data[key].customer.name;
        var age = data[key].customer.age;
        var dob = data[key].customer.dob;
        var mobile = data[key].customer.mobile;
        var gender = data[key].customer.gender;
        var address = data[key].customer.address;
        var customerId = key;

        var temp = {
          "Customer Id": customerId,
          Name: name,
          Gender: gender,
          DOB: dob,
          Age: age,
          Mobile: mobile,
          Address: address
        };

        newData.push(temp);
      }
      var newData = JSON.stringify(newData);
      var json = $.parseJSON(newData);
      var csv = JSON2CSV(json);
      //window.open("data:text/csv;charset=utf-8," + escape(csv));

      csvDownloader(csv, "customersAllExport.csv");
      $("#exampleModal").modal('hide');
    });
});

function csvDownloader(csv, filename) {
  if (false && window.navigator.msSaveBlob) {
    var blob = new Blob([decodeURIComponent(csv)], {
      type: "text/csv;charset=utf8"
    });
    //console.log("if");
    // Crashes in IE 10, IE 11 and Microsoft Edge
    // See MS Edge Issue #10396033: https://goo.gl/AEiSjJ
    // Hence, the deliberate 'false'
    // This is here just for completeness
    // Remove the 'false' at your own risk
    window.navigator.msSaveBlob(blob, filename);
  } else if (window.Blob && window.URL) {
    // HTML5 Blob
    //console.log("elseif");
    var blob = new Blob([csv], { type: "text/csv;charset=utf8" });
    var csvUrl = URL.createObjectURL(blob);

    var a = document.createElement("a");
    a.style.display = "none";
    a.download = filename;
    a.href = csvUrl;

    a.dataset.downloadurl = ["text/csv", a.download, a.href].join(":");
    a.click();
  } else {
    //console.log("else");
    // Data URI
    var csvData =
      "data:application/csv;charset=utf-8," + encodeURIComponent(csv);

    var a = document.createElement("a");
    a.style.display = "none";
    a.download = filename;
    a.href = csvUrl;

    a.dataset.downloadurl = ["text/csv", a.download, a.href].join(":");
    a.click();
  }
}

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

