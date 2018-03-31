function main() {
  var data = JSON.parse(window.sessionStorage.getItem("prescriptionData"));
  console.log(data);
  window.sessionStorage.removeItem('prescriptionCustomerData');
  window.sessionStorage.removeItem('prescriptionData');
  var keys = ["sph", "cyl", "axis", "va", "add"];
  for (var item of keys) {
    var temp = data.order.eye.right[item];
    if (temp == "NA") {
      data.order.eye.right[item] = "";
    }
    var temp1 = data.order.eye.left[item];
    if (temp1 == "NA") {
      data.order.eye.left[item] = "";
    }
  }

var number = 1.0;
number.num

  $("#orderId").text(data.order.order.orderId);
  $("#name").text(data.order.customerName);
  $("#age").text(data.customer.age);
  $("#orderDate").text(data.order.order.orderDate);
  $("#address").text(data.customer.address);
  $("#mobile").text(data.order.customerMobile);
  $("#customerId").text(data.order.customerId);
  $("#gender").text(data.customer.gender);

  var rSph = data.order.eye.right.sph;
  if(Number(rSph) > 0 && Number(rSph) <10){
    rSph = `+0${Number(rSph).toFixed(2)}`;
  }else if(Number(rSph) <0 && Number(rSph) >-10){
    rSph = Number(rSph) * -1;
    rSph = `-0${rSph.toFixed(2)}`;
  }
  $("#rightSph").text(rSph);

  var rCyl = data.order.eye.right.cyl;
  if(Number(rCyl) > 0 && Number(rCyl) <10){
    rCyl = `+0${Number(rCyl).toFixed(2)}`;
  }else if(Number(rCyl) <0 && Number(rCyl) >-10){
    rCyl = Number(rCyl) * -1;
    rCyl = `-0${rCyl.toFixed(2)}`;
  }
  $("#rightCyl").text(rCyl);
  $("#rightAxis").text(data.order.eye.right.axis);
  $("#rightVa").text(data.order.eye.right.va);
  $("#rightAdd").text(data.order.eye.right.add);


  var lSph = data.order.eye.left.sph;
  if(Number(lSph) > 0 && Number(lSph) <10){
    lSph = `+0${Number(lSph).toFixed(2)}`;
  }else if(Number(lSph) <0 && Number(lSph) >-10){
    lSph = Number(lSph) * -1;
    lSph = `-0${lSph.toFixed(2)}`;
  }
  $("#leftSph").text(lSph);

  var lCyl = data.order.eye.left.cyl;
  if(Number(lCyl) > 0 && Number(lCyl) <10){
    lCyl = `+0${Number(lCyl).toFixed(2)}`;
  }else if(Number(lCyl) <0 && Number(lCyl) >-10){
    lCyl = Number(lCyl) * -1;
    lCyl = `-0${lCyl.toFixed(2)}`;
  }
  $("#leftCyl").text(lCyl);
  $("#leftAxis").text(data.order.eye.left.axis);
  $("#leftVa").text(data.order.eye.left.va);
  $("#leftAdd").text(data.order.eye.left.add);
}

main();
