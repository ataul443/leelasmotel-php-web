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
function main() {
  $(".wrapper").css("display", "");
  var sphIntRight;
  var sphDecRight;
  var cylIntRight;
  var cylDecRight;
  var vaRight;
  var sphIntLeft;
  var sphDecLeft;
  var cylIntLeft;
  var cylDecLeft;
  var vaLeft;
  var age;
  var eyeRightVal = true;
  var eyeLeftVal = true;

  function validator() {
    //customer-info validation
  }
  var data = {};

  function customerValidator() {
    var mobVal = true;

    var name = $("#inputName").val();
    name = name.toUpperCase();
    if (name.length == 0) {
      $("#inputName").css("border", "1px solid red");
      name = undefined;
    } else {
      $("#inputName").css("border", "1px solid #e3e3e3");
    }

    var dob = $("#inputDob").val();
    {
      var dobArray = dob.split("-");
      dobArray = dobArray.reverse();

      var temp = dobArray.join("-");

      var age = getAge(dob)
      dob = temp;
      
      var today = new Date();
      var orderDate =
        today.getDate() +
        "-" +
        today.getMonth() +
        1 +
        "-" +
        today.getFullYear();

      if ((dob.length > 8 || dob.length < 11) && Number(age) < 101) {
        $("#inputDob").css("border", "1px solid #e3e3e3");
      } else {
        dob = "NA";
        age = "NA";
      }
    }

    var gender = {};
    {
      gender.value = $("#inputGender option:selected").val();
      if (gender.value == undefined || gender.value == "Gender...") {
        gender.validation = false;
        $("#inputGender").css("border", "1px solid red");
      } else {
        gender.validation = true;
        $("#inputGender").css("border", "1px solid #e3e3e3");
      }
    }

    var address = $("#inputAddress").val();
    address.length == 0 ? (address = "NA") : address;

    var mobile = $("#inputMobile").val();
    if (mobile.length == 0) {
      mobile = "XXXXXXXXXX";
    } else if (mobile.length != 10) {
      $("#inputMobile").css("border", "1px solid red");
      mobVal = false;
    } else {
      $("#inputMobile").css("border", "1px solid #e3e3e3");
      mobVal = true;
    }

    if (name && gender.validation && mobVal) {
      $("#customerSpan").addClass("hidden");
      var data = {
        customer: {
          name: name,
          dob: dob,
          age: age,
          gender: gender.value,
          address: address,
          mobile: mobile
        },
        orderDate: orderDate
      };

      return data;
    } else {
      $("#customerSpan").removeClass("hidden");
      return false;
    }
  }

  function eyeValidator(specificEye) {
    var sphInt = $(`#${specificEye} #sph #int option:selected`).val();
    var sphDec = $(`#${specificEye} #sph #dec option:selected`).val();

    var cylInt = $(`#${specificEye} #cyl #int option:selected`).val();
    var cylDec = $(`#${specificEye} #cyl #dec option:selected`).val();

    var addInt = $(`#${specificEye} #add #addInt option:selected`).val();
    var addDec = $(`#${specificEye} #add #addDec option:selected`).val();

    var va = $(`#${specificEye} #va option:selected`).val();
    var sphSign = $(`#${specificEye} #sph #sphSign option:selected`).val();
    var cylSign = $(`#${specificEye} #sph #cylSign option:selected`).val();
    var axis = $(`#${specificEye} #axis`).val();
    if (axis.length > 0) {
      axis = axis > 0 ? axis : axis;
    } else {
      axis = "NA";
    }

    if (va == undefined || va == "--") {
      va = "NA";
    }

    if (
      addInt == undefined ||
      addInt == "--" ||
      (addDec == undefined || addDec == "--")
    ) {
      var add = "NA";
    } else {
      var add = parseInt(addInt) + parseFloat(addDec);
      add = `+${parseFloat(add)}`;
    }

    if (
      sphInt == undefined ||
      sphInt == "--" ||
      (sphDec == undefined || sphDec == "--")
    ) {
      var sph = "NA";
    } else {
      var sph = parseInt(sphInt) + parseFloat(sphDec);
      sphSign == "+" ? (sph = sph * 1) : (sph = sph * -1);
      sph =
        sph > 0
          ? `+${parseFloat(sph).toFixed(2)}`
          : `${parseFloat(sph).toFixed(2)}`;
    }

    if (
      cylInt == undefined ||
      cylInt == "--" ||
      (cylDec == undefined || cylDec == "--")
    ) {
      var cyl = "NA";
    } else {
      var cyl = parseInt(cylInt) + parseFloat(cylDec);
      cylSign == "+" ? (cyl = cyl * 1) : (cyl = cyl * -1);
      cyl = cyl > 0 ? `+${parseFloat(cyl)}` : `${parseFloat(cyl).toFixed(2)}`;
      if (axis == "NA") {
        $(`#${specificEye} #axis`).css("border", "1px solid red");
        return false;
      }
    }

    return {
      sph: sph,
      cyl: cyl,
      axis: axis,
      va: va,
      add: add
    };
  }

  function costValidator() {
    var deliveryDate = $("#deliveryDate").val();
    deliveryDate.length == 0 ? (deliveryDate = "NA") : deliveryDate;

    var advancePaid = $("#advancePaid").val();
    advancePaid.length == 0 ? (advancePaid = "NA") : advancePaid;

    var remarks = $("#remarks").val();
    remarks.length == 0 ? (remarks = "NA") : remarks;

    var frameCost = $("#frameCost").val();
    var glassCost = $("#glassCost").val();

    if (frameCost.length == 0 || glassCost.length == 0) {
      $("#frameCost, #glassCost").css("border", "1px solid red");
      return false;
    } else {
      var totalCost = Number(frameCost) + Number(glassCost);
      var unpaidCost = 0;
      advancePaid == "NA"
        ? (unpaidCost = parseInt(totalCost))
        : (unpaidCost = parseInt(totalCost) - parseInt(advancePaid));
      $("#frameCost, #glassCost").css("border", "1px solid #e3e3e3");

      var costValidationData = [];
      costValidationData[0] = {
        frame: frameCost,
        glass: glassCost,
        total: totalCost,
        advance: advancePaid,
        unpaid: unpaidCost
      };

      costValidationData[1] = {
        deliveryDate: deliveryDate,
        remarks: remarks
      };

      return costValidationData;
    }
  }

  $("#cancel-btn").click(function() {
    window.location.href = "/shoploons-admin/home.php";
  });

  $("#submit-btn").click(function() {
    var data = {
      customer: "",
      order: {
        cost: "",
        extra: "",
        orderDate: ""
      },
      eye: {
        right: "",
        left: ""
      }
    };

    customerValidation = customerValidator();
    rightEyeValidation = eyeValidator("right");
    leftEyeValidation = eyeValidator("left");
    costValidation = costValidator();

    if (
      customerValidation &&
      rightEyeValidation &&
      leftEyeValidation &&
      costValidation
    ) {
      data.customer = customerValidation.customer;
      data.eye.right = rightEyeValidation;
      data.eye.left = leftEyeValidation;
      data.order.cost = costValidation[0];
      data.order.extra = costValidation[1];
      data.order.orderDate = customerValidation.orderDate;
      $("#form-box input,#form-box select").prop("disabled", true);
      $("#submit-btn").text("   Processing ...");
      $("#submitLoader").removeClass("hidden");
      //console.log(data);
      orderSubmit(data);
    } else {
      //console.log("Formdata - Invalid!");
    }
  });

  //Age Calculator;

  function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  function orderSubmit(dataOrder) {
    var customerName = dataOrder.customer.name;
    firebase
      .database()
      .ref("/database/customers")
      .orderByChild("customer/name")
      .equalTo(customerName)
      .once("value")
      .then(function(snapshot) {
        var data = snapshot.val();
        if (data == null) {
          firebase
            .database()
            .ref("/customerCounter")
            .once("value")
            .then(function(snap) {
              customerCounter = parseInt(snap.val());
              var customerId = `CU${customerCounter}`;
              dataUpdate(dataOrder, customerId, customerCounter);
            });
        } else {
          var keys = Object.keys(data);
          var customerId = keys[0];
          var customerCounter = customerId.slice(2);
          dataUpdate(dataOrder, customerId, customerCounter);
        }
      })
      .catch(function(error) {
        alert("Something Went Wrong!!\n\nPlease check form carefully.");
        $("#form-box input,#form-box select, #cancel-btn").prop(
          "disabled",
          false
        );
        $("#submitLoader").addClass("hidden");
        $("#submit-btn").text("Submit");
        return;
      });
  }

  function dataUpdate(data, customerId, customerCounter) {
    var customerData = {
      customer: data.customer,
      totalOrders: "X",
      orders: "XX"
    };
    var orderData = {
      eye: data.eye,
      order: data.order,
      customerId: customerId,
      customerName: data.customer.name,
      customerMobile: data.customer.mobile
    };
    var printOrder = {
      customer : data.customer,
      order: orderData
    }
    firebase
      .database()
      .ref("/orderCounter")
      .once("value")
      .then(function(snap) {
        orderCounter = parseInt(snap.val());
        var orderId = `RO${orderCounter}`;
        orderData.order.orderId = orderId;

        return firebase
          .database()
          .ref("/database/orders/inprocess/" + orderId)
          .set(orderData)
          .then(function() {
            return firebase
              .database()
              .ref(`/database/customers/${customerId}/totalOrders`)
              .once("value")
              .then(function(snapshot) {
                var totalOrders = snapshot.val();
                var updates = {};
                if (totalOrders != null) {
                  var updatedTotal = Number(totalOrders);
                  updation(
                    orderCounter,
                    customerCounter,
                    updatedTotal,
                    customerId,
                    orderId,
                    orderData.customerMobile,
                    orderData.customerName,
                    printOrder
                  );
                } else {
                  var updatedTotal = 0;
                  return firebase
                    .database()
                    .ref(`/database/customers/${customerId}`)
                    .set(customerData)
                    .then(function() {
                      updation(
                        orderCounter,
                        customerCounter,
                        updatedTotal,
                        customerId,
                        orderId,
                        orderData.customerMobile,
                        orderData.customerName,
                        printOrder
                      );
                    });
                }
              }).catch(function(error){
                alert("Something Went Wrong!!\n\nPlease check form carefully.");
                $("#form-box input,#form-box select, #cancel-btn").prop(
                  "disabled",
                    false
                  );
                  $("#submitLoader").addClass("hidden");
                  $("#submit-btn").text("Submit");
                  return;
              })
          }).catch(function(error){
            alert("Something Went Wrong!!\n\nPlease check form carefully.");
            $("#form-box input,#form-box select, #cancel-btn").prop(
              "disabled",
                false
              );
              $("#submitLoader").addClass("hidden");
              $("#submit-btn").text("Submit");
              return;
          })
      }).catch(function(error){
        alert("Something Went Wrong!!\n\nPlease check form carefully.");
        $("#form-box input,#form-box select, #cancel-btn").prop(
          "disabled",
            false
          );
          $("#submitLoader").addClass("hidden");
          $("#submit-btn").text("Submit");
          return;
      })
  }
}

function updation(
  orderCounter,
  customerCounter,
  updatedTotal,
  customerId,
  orderId,
  customerMobile,
  customerName,printOrder
) {
  var newUpdates = {};
  var index = Number(updatedTotal) + 1;
  newUpdates[`/database/customers/${customerId}/totalOrders`] = index;
  newUpdates[`/database/customers/${customerId}/orders/${index - 1}`] = orderId;
  newUpdates["/orderCounter"] = Number(orderCounter) + 1;
  newUpdates["/customerCounter"] = Number(customerCounter) + 1;
  return firebase
    .database()
    .ref()
    .update(newUpdates)
    .then(function() {
      var msg = `Dear ${customerName}\n\nYour order has been placed successfully. Pleasure to serve you.\n\nThanks for visiting us.\nRecent Opticals`;
      if (customerMobile != "XXXXXXXXXX") {
        //console.log(customerMobile, msg);
        msg = encodeURI(msg);
        makeCorsRequest(customerMobile, msg);
      }
      alert("Order Processed Successfully\n");
      $("#submit-btn").addClass("hidden");
      window.sessionStorage.setItem(
        "prescriptionData",
        JSON.stringify(printOrder)
      );
      console.log(printOrder);
      $("#print-btn").click(function(){
        window.open('prescription.html','__blank');
      })
      $("#print-btn").removeClass("hidden");
      
      return;
    }).catch(function(error){
      alert("Something Went Wrong!!\n\nPlease check form carefully.");
      $("#form-box input,#form-box select, #cancel-btn").prop(
        "disabled",
          false
        );
        $("#submitLoader").addClass("hidden");
        $("#submit-btn").text("Submit");
        return;
    })
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

var url;

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
  console.log(mobile, msg);
}
