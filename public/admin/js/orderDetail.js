function main() {
  $(".wrapper").css("display", "");
  var orderId = window.sessionStorage.getItem("ro_orderId");
  var order = JSON.parse(window.sessionStorage.getItem(orderId));
  console.log(orderId);
  var customer = JSON.parse(window.sessionStorage.getItem('prescriptionCustomerData'));
  console.log(customer);
  if(customer != null || customer != undefined ){
    var fullOrderData = {
      customer: customer.customer,
      order: order
    }
    window.sessionStorage.setItem(
      "prescriptionData",
      JSON.stringify(fullOrderData)
    );
    window.sessionStorage.removeItem('prescriptionCustomerData');
    $('#print-btn').removeClass('hidden');
  }
  
  $('#print-btn').click(function(){
    window.open('prescription.html','__blank');
  })
  dataMapper(order);
}

function dataMapper(data) {
  orderMapper(data);

  //console.log("Succcess");
}

function orderMapper(data) {
  $()
  $("#name").text(data.customerName);
  $("#orderId").text(data.order.orderId);
  $("#customerId").text(data.customerId);
  $("#totalCost").text(data.order.cost.total);
  $("#orderDate").text(data.order.orderDate);
  $("#mobile").text(data.customerMobile);
  $("#remarksText").text(data.order.extra.remarks);

  eyeSpecMapper(data, "right");
  eyeSpecMapper(data, "left");
}
function eyeSpecMapper(data, eye) {
  var sph = data.eye[eye].sph;

  var axis = data.eye[eye].axis;

  var cyl = data.eye[eye].cyl;

  var va = data.eye[eye].va;

  var add = data.eye[eye].add;

  $(`#sph${eye}`).text(sph);
  $(`#cyl${eye}`).text(cyl);
  $(`#axis${eye}`).text(axis);
  $(`#va${eye}`).text(va);
  $(`#add${eye}`).text(add);
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
$("#logout").click(function() {
  logout();
});
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



function logout() {
  window.sessionStorage.clear();
  window.localStorage.clear();
  window.localStorage.removeItem('userRecentOpticals');
  var user = JSON.parse(window.localStorage.getItem('userRecentOpticals'));
  initApp(user);
}
