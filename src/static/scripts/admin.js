//  add your id to the list and then just add 
//  it as an on click option with 
//  just make sure the button is named id-btn
var pages = ["add-univeristy-page","help-page","courses-page","accounts-page","upload-page","customize-page","help-page","settings-page","insitution-setup-page"];
var currentPage = pages.length -1;
//  hide all the pages
for(var i=0;i<pages.length;i++){
  if(i != currentPage){
    $("#"+pages[i]).hide();
  }
}
$(document).ready(function(){
  
  
  pages.forEach(function(id,i){
    $("#" + id + "-btn").click(function(){
      goToPage(id);
    });
  });
  var db ="";
  $("#institutionGrid").jsGrid({
        height: "80%",
        width: "100%",
 
        filtering: true,
               editing: false,
               sorting: true,
               paging: true,
               autoload: true,
               pageSize: 20,
               pageLoading:true,
              pageButtonCount: 7,
 
        pageSize: 15,
        pageButtonCount: 5,
 
        
 
        controller: {
          loadData: function(filter) {
                var d = $.Deferred();
                console.log(filter);
                $.ajax({
                  type: 'POST',
                    url: "/adminGrid/GetInstitutions",
                    dataType: "json",
                    data: filter
                }).done(function(dataResult) {
                  console.log(dataResult);
                    d.resolve(dataResult);
                });
                return d.promise();
            }
          },
 
        fields: [
            { name: "name", type: "text", width: 100 },
            
            { type: "control" }
        ]
    });
  $("#accountGrid").jsGrid({
        height: "80%",
        width: "100%",
 
        filtering: true,
               editing: false,
               sorting: true,
               paging: true,
               autoload: true,
               pageSize: 20,
               pageLoading:true,
              pageButtonCount: 7,
 
        
 
        
        fields: [
            { name: "firstname", type: "text", width: 100 },
            { name: "lastname", type: "text", width: 100 },
            { type: "control" }
        ],
        controller: {
          loadData: function(filter) {
                var d = $.Deferred();
                console.log(filter);
                $.ajax({
                  type: 'POST',
                    url: "/adminGrid/GetAccounts",
                    dataType: "json",
                    data: filter
                }).done(function(dataResult) {
                  console.log(dataResult);
                    d.resolve(dataResult);
                });
                return d.promise();
            }
          }
    });
    
    
});
    

function goToPage(id){
  
  for(var i=0;i<pages.length;i++){
    console.log(i);
    if(id == pages[i]){
      currentPage = i;
      
    }else{
      console.log("hiding",id);
      $("#"+pages[i]).hide();
      $("#"+pages[i] + "-btn").removeClass("active-item");
    }
  }
  //  hide the current page
  
  //show the selected page 
  $("#"+id).show();
  $("#"+id + "-btn").addClass("active-item");
  //  find the current page on the list 
  
  return;
}



function initLocationSelect(prefix){
  $.ajax({
      type: 'POST',
      url: "/adminGrid/GetCountries",
      dataType: "json",
      data: {name : "",
      pageIndex: 1,
      pageSize: 300,}
  }).done(function(dataResult) {
      //  lets fill up the select with countries
      var html = "";
      for(var i=0;i<dataResult.data.length;i++){
          html = html + "<option value="+dataResult.data[i].countryid+" >"+dataResult.data[i].name+"</option>";
          
      }
      console.log(html);
      $("#"+prefix+"country_select").html(html);
      //  create an onclick change functron 
      $("#"+prefix+"country_select").change(()=>{
        getStates($("#"+prefix+"country_select").val(),prefix);
        console.log($("#"+prefix+"country_select").val());
      });
      console.log(dataResult);

  });

}

//  get the associated states 
function getStates(countryid,prefix){
  //  load states
    $.ajax({
        type: 'POST',
        url: "/adminGrid/GetStates",
        dataType: "json",
        data: {countryid : $("#"+prefix+"country_select").val(),
        pageIndex: 1,
        pageSize: 300,}
    }).done(function(dataResult) {
        //  lets fill up the select with countries
        console.log("fdasfdsa",dataResult);
        var html = "";
        for(var i=0;i<dataResult.data.length;i++){
            html = html + "<option value="+dataResult.data[i].stateid+" >"+dataResult.data[i].statename+"</option>";
            
        }
        console.log(html);
        $("#"+prefix+"state_select").html(html);
        $("#"+prefix+"state_select").change(()=>{
          getCities($("#"+prefix+"state_select").val(),prefix);
        });
        console.log(dataResult);

    });
    //  also load all of the cities 
    $.ajax({
        type: 'POST',
        url: "/adminGrid/GetCities",
        dataType: "json",
        data: {countryid : $("#"+prefix+"country_select").val(),
        pageIndex: 1,
        pageSize: 300,}
    }).done(function(dataResult) {
        //  lets fill up the select with countries
        var html = "";
        for(var i=0;i<dataResult.data.length;i++){
            html = html + "<option >"+dataResult.data[i].name+"</option>";
            
        }
        console.log(html);
        $("#"+prefix+"city_select").html(html);
        console.log(dataResult);

    });

}
function getCities(stateid,prefix){
  $.ajax({
        type: 'POST',
        url: "/adminGrid/GetCities",
        dataType: "json",
        data: {stateid : stateid,
        pageIndex: 1,
        pageSize: 300,}
    }).done(function(dataResult) {
        //  lets fill up the select with countries
        var html = "";
        for(var i=0;i<dataResult.data.length;i++){
            html = html + "<option >"+dataResult.data[i].name+"</option>";
            
        }
        console.log(html);
        $("#"+prefix+"city_select").html(html);
        console.log(dataResult);

    });
}


