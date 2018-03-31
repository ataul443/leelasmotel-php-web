function main() {
  $(".wrapper").css("display", "");
  initDataCollector();
  birthdaySpecial();

  

  $(document).on("click", "td[id='birthday'] a", function(e) {
    window.sessionStorage.setItem("customerId", e.target.id);
    window.location.href = "customerDetail.html";
  });

  $(document).on("click", "td[id='recentOrder'] a", function(e) {
    window.sessionStorage.setItem("ro_orderId", e.target.id);
    window.location.href = "orderDetail.html";
  });
  $(document).on("click", "td[id='recentCustomer'] a", function(e) {
    window.sessionStorage.setItem("customerId", e.target.id);
    window.location.href = "customerDetail.html";
  });
  $("#action-btn-order").click(function() {
    window.location.href = "status.html";
  });
  $("#action-btn-customer").click(function() {
    window.location.href = "customer.html";
  });
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
function logout() {
  window.sessionStorage.clear();
  window.localStorage.clear();
  var user = JSON.parse(window.localStorage.getItem('userRecentOpticals'));
initApp(user);
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



//Recent-orders-Code

function initDataCollector(){
  var ordersRef = firebase.database().ref("/database/orders/inprocess");
  var customerRef = firebase.database().ref("/database/customers");
  var orderInit = ordersRef.once("value").then(function(snapshot) {
    return snapshot.val();
  })
  var customerInit = customerRef.once('value').then(function(snapshot){
    return snapshot.val();
  })

  Promise.all([orderInit,customerInit]).then(function(dataArray){
    dataArray.map(function(originalData,idx){
      if (originalData == undefined || originalData == null) {
        $("#tBody-order,#tBody-customer").html("");
        alert("No data Found");
        return;
      }else{
        if(idx != 0) initialData(originalData,"customer");
        else initialData(originalData,"order");
        
      }
    })
  }).catch(function(error){
    alert("Error: "+ error);
  })
}



function initialData(originalData,identifier) {

    var keys = Object.keys(originalData);
    keys = keys.reverse();
    var data = {};
    for (var key of keys) {
      data[key] = originalData[key];
    }
    var totalDataSize = Object.keys(data).length;
    var reqRows = totalDataSize >= 6 ? 6 : totalDataSize;
    organisedData = dataOrganizer(data, reqRows);
    dataControl(organisedData, reqRows, totalDataSize, identifier);
  
}

function dataOrganizer(data, rows) {
  var dataPerPage = [];
  var keys = Object.keys(data);
  var dataSize = keys.length;
  //////////console.log(dataSize);
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

function dataControl(organisedData, reqRows, totalDataSize, identifier) {
  var pages = organisedData.length;
  var stack = organisedData[0];
  if (identifier != "order") {
    dataPopulatorCustomer(stack);
    return;
  } else {
    dataPopulator(stack);
  }
}

function dataPopulator(stack) {
  $("#tBody-order").html("");
  for (var item of stack) {
    ////console.log("item", item);
    var key = Object.keys(item);
    key = key.toString();
    var reqElement = item[key];
    console.log("dataPopulator",key);
    window.sessionStorage.setItem(key, JSON.stringify(reqElement));

    $("#tBody-order").append(`
  
      <tr id="${key}" style="font-size:12px;">
      
                                      <td id="orderId${key}">${key}</td>
                                      <td id="customer-${key}">${
      reqElement.customerName
    }</td>
                                      <td id="unpaidCost-${key}">${
      reqElement.order.cost.unpaid
    } Rs</td>
                                      <td id="orderDate${key}">${
      reqElement.order.orderDate
    }</td>
    <td id="recentOrder"><a id="${key}"> More Info<style type="text/css">
    #detailData:hover {
        text-decoration: underline;
    }
</style> </a></td>
      <td class="hidden" id="mobile-${key}">${reqElement.customerMobile}</td>
                                  </tr>
  
      `);
  }
  $("#action-btn-order").removeClass("hidden");
}

function dataPopulatorCustomer(stack) {
  $("#tBody-customer").html("");
  for (var item of stack) {
    var key = Object.keys(item);
    key = key.toString();
    var reqElement = item[key];
    $("#tBody-customer").append(`
      
          <tr id="${key} style="font-size:10px;">
                                
                                          <td id="customerId-${key}">${key}</td>
                                          <td id="name-${key}">${
      reqElement.customer.name
    }</td>
                                          <td id="mobile-${key}">${
      reqElement.customer.mobile
    }</td>
    <td id="recentCustomer"><a id="${key}"  href="#"> More Info<style type="text/css">
    #detailData:hover {
        text-decoration: underline;
    }
</style> </a></td>
      
          `);
  }
  $("#action-btn-customer").removeClass("hidden");
}

function birthdaySpecial() {
  var customerRef = firebase.database().ref("/database/customers");
  var today = new Date();
  var temp = today.getDate();
  temp = temp.length < 2 ? `0${temp}` : temp;
  var tempMonth = today.getMonth();
  tempMonth = Number(tempMonth)+1
  tempMonth = tempMonth <10? `0${tempMonth}`:temp;
  today = `${temp}-${tempMonth}`;
  console.log(today);
  customerRef
    .orderByChild("customer/dob")
    .startAt(today)
    .endAt(today + "\uf8ff")
    .once("value")
    .then(function(snapshot) {
      var data = snapshot.val();
      console.log(data);
      if (data == null || data == undefined) {
        $('#birthday-content').html("");
        $('#alert-text').removeClass('hidden');
        return;
      }
      
      var keys = Object.keys(data);
      var mobiles = {};
      $("#tBody-birthday").html("");
      for (var item of keys) {
        dataMapper(item, data); 
      }
      function msgWisher(){
        for(var item of keys){
          var temp1 = data[item];
        if (temp1.customer.mobile != "XXXXXXXXXX") {
          var name = temp1.customer.name;
          var mobile = temp1.customer.mobile;
          var age = temp1.customer.age;

          var birthdayMsg = `Dear ${name}\n\nWishing you a very happy Birthday, may your all dreams come true. On this Special Day we have special Offer for you get 30% Discount on Complete Spectacle offer valid for 2 days.\n\nRecent Opticals\nB/Nau Jalandhar\n+91 9814855528`;
          birthdayMsg = encodeURI(birthdayMsg);
          makeCorsRequest(mobile,birthdayMsg);
        }
        }
      }
      $("#action-btn-birthday").click(function() {
        msgWisher();
      });
    });
}

function dataMapper(key, data) {
  console.log(key);
  var reqElement = data[key];
  //console.log(reqElement, key, data);
  $("#tBody-birthday").append(`
      
          <tr id="${key}">
                                          <td id="customerId-${key}">${key}</td>
                                          <td id="name-${key}">${
    reqElement.customer.name
  }</td>
                                          <td id="age-${key}">${
    reqElement.customer.age
  }</td>
                                          <td id="mobile-${key}">${
    reqElement.customer.mobile
  }</td>
    <td id="birthday"><a id="${key}"  href="#"> More Info<style type="text/css">
    #detailData:hover {
        text-decoration: underline;
    }
</style> </a></td>
      
          `);
  $("#action-btn-birthday").removeClass("hidden");
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
