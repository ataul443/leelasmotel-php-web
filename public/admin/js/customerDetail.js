function main() {
  $(".wrapper").css("display", "");
  var customerId = window.sessionStorage.getItem("customerId");
  dataCollector(customerId);
  dataAllOrders(customerId);

  $(document).on("click", "td a", function(e) {
    window.sessionStorage.setItem("ro_orderId", e.target.id);
    window.location.href = "orderDetail.html";
  });
}

function dataCollector(customerId) {
  var customerRef = firebase
    .database()
    .ref(`/database/customers/${customerId}`)
    .once("value")
    .then(function(snapshot) {
      return snapshot.val();
    });
  var orderRef = firebase
    .database()
    .ref(`/database/customers/${customerId}/orders`)
    .once("value")
    .then(function(snapshot) {
      var latestOrder = snapshot.val();
      latestOrder = latestOrder.pop();
      return Promise.all([
        searchAllCategoryByKey("inprocess", latestOrder),
        searchAllCategoryByKey("completed", latestOrder),
        searchAllCategoryByKey("canceled", latestOrder)
      ]).then(function(data) {
        return data;
      });
    });

  Promise.all([customerRef, orderRef]).then(function(data) {
    var customerData = data[0];
    var temp = data[1],
      latest;
    for (var item of temp) {
      if (item != null || item != undefined) {
        var key = Object.keys(item);
        latest = item[key];
        break;
      }
    }
    //console.log(latest);
    dataMapper(customerData, latest);
  });
}

function dataMapper(customer, order) {
  customerMapper(customer);
  window.sessionStorage.setItem(
    "prescriptionCustomerData",
    JSON.stringify(customer)
  );
  eyeSpecMapper(order, "right");
  eyeSpecMapper(order, "left");
  //console.log("Succcess");
}

function customerMapper(data) {
  $("#name").text(data.customer.name);
  $("#gender").text(data.customer.gender);
  $("#dob").text(data.customer.dob);
  $("#age").text(data.customer.age);
  $("#mobile").text(data.customer.mobile);
  $("#address").text(data.customer.address);
  $("#totalOrders").text(data.totalOrders);
}
function eyeSpecMapper(data, eye) {
  var sph = data.eye[eye].sph;
  sph = sph > 0 ? `+${sph}` : sph;
  var axis = data.eye[eye].axis;

  var cyl = data.eye[eye].cyl;
  cyl = cyl > 0 ? `+${cyl}` : cyl;
  var va = data.eye[eye].va;
  va = va > 0 ? `+${va}` : va;
  var add = data.eye[eye].add;
  add = add > 0 ? `${add}` : add;

  $(`#sph${eye}`).text(sph);
  $(`#cyl${eye}`).text(cyl);
  $(`#axis${eye}`).text(axis);
  $(`#va${eye}`).text(va);
  $(`#add${eye}`).text(add);
}

function searchAllCategoryByKey(category, latestOrder) {
  return firebase
    .database()
    .ref(`/database/orders/${category}`)
    .orderByKey()
    .equalTo(latestOrder)
    .once("value")
    .then(function(snapshot) {
      return snapshot.val() ? snapshot.val() : null;
    });
}

function searchALLCategoryByChild(category, query) {
  return firebase
    .database()
    .ref(`/database/orders/${category}`)
    .orderByChild("customerId")
    .equalTo(query)
    .once("value")
    .then(function(snapshot) {
      return snapshot.val() ? snapshot.val() : null;
    });
}

function dataAllOrders(customerId) {
  return Promise.all([
    searchALLCategoryByChild("inprocess", customerId),
    searchALLCategoryByChild("completed", customerId),
    searchALLCategoryByChild("canceled", customerId)
  ]).then(function(data) {
    var newData = [];
    for (var item of data) {
      if (item != null || item != undefined) {
        newData.push(item);
      }
    }
    tableMapper(newData);
  });
}

function tableMapper(dataArray) {
  for (var itemKey of dataArray) {
    var data = Object.keys(itemKey);
    var key = data[0];
    data = itemKey[key];
    window.sessionStorage.setItem(key, JSON.stringify(data));
    $("#tBody").html("");
    $("#tBody").append(`
  
      <tr id="${key}">
      
                                      <td id="orderId${key}">${key}</td>
                                      <td id="totalCost${key}">${
      data.order.cost.total
    } Rs</td>
                                                               
                                      
                                      <td id="frame${key}">${
      data.order.cost.frame
    } Rs</td>
    <td id="glass${key}">${data.order.cost.glass} Rs</td>
                                               
                                      <td id="orderDate${key}">${
      data.order.orderDate
    }</td>
    <td><a id="${data.order.orderId}"> More Info<style type="text/css">
    #${data.order.orderId}:hover {
        text-decoration: underline;
    }
</style> </a></td>

                                  </tr>
  
      `);
  }
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
  var user = JSON.parse(window.localStorage.getItem("userRecentOpticals"));
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

$("#logout").click(function() {
  logout();
});

function logout() {
  window.sessionStorage.clear();
  window.localStorage.clear();
  window.localStorage.removeItem("userRecentOpticals");
  var user = JSON.parse(window.localStorage.getItem("userRecentOpticals"));
  initApp(user);
}
