function main() {
  $(".wrapper").css("display", "");
  $("#custom-text").val("Predefined Message");
  var customers = JSON.parse(sessionStorage.getItem("mobiles"));
  sessionStorage.removeItem("mobiles");
  if (customers == null) {
    alert("Mobile Numbers Not FOUND!!\nGoing Back ....");
    window.history.back();
    return;
  }
  var names = Object.keys(customers);
  var counter = 0;
  if (names.length > 0) {
    $("#list-ul").html(listMaker(names, customers));
    $("#send-btn").click(function() {
      var msg = $("#custom-text").val();
      msg = msg.trim();
      msg = encodeURI(msg);
      //console.log(msg);
      if (msg.length > 0) {
        $("#send-btn").text("Sending...");
        $("#custom-text").prop("disabled", true);
        for (var item of names) {
          makeCorsRequest(customers[item], msg);
        }
        setTimeout(() => {
          $("#send-btn").text("Send");
          $("#custom-text").val("");
          $("#custom-text").prop("disabled", false);
          sessionStorage.removeItem("mobiles");
        }, 2000);
      }
    });
  }
  //makeCorsRequest();
}

function listMaker(keys, customers) {
  var str = "";
  for (var item of keys) {
    str = `
        ${str}
        <li class="list-group-item">
        <span id="cust-name">${item}</span>
        <span> | Mob.- </span>
        <span id="cust-id">${customers[item]}</span>
        </li>
        `;
  }
  return str;
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

