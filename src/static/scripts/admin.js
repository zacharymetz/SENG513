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
        sorting: true,
        paging: true,
        autoload: true,
 
        pageSize: 15,
        pageButtonCount: 5,
 
        
 
        controller: db,
 
        fields: [
            { name: "Course Name", type: "text", width: 100 },
            { name: "Level", type: "number", width: 50 },
            { name: "Department", type: "text", width: 150 },
            { name: "Faculty", type: "text" ,width: 150},
            
            { type: "control" }
        ]
    });
  $("#accountGrid").jsGrid({
        height: "80%",
        width: "100%",
 
        filtering: true,
        sorting: true,
        paging: true,
        autoload: true,
 
        pageSize: 15,
        pageButtonCount: 5,
 
        
 
        controller: db,
 
        fields: [
            { name: "First", type: "text", width: 100 },
            { name: "Last", type: "text", width: 100 },
            { name: "Insitution", type: "text", width: 150 },
            { name: "Last Login", type: "text" },
            { name: "Active", type: "checkbox", sorting: false },
            { type: "control" }
        ]
    });
    $("#facultyGrid").jsGrid({
        height: "80%",
        width: "100%",
 
        filtering: true,
        sorting: true,
        paging: true,
        autoload: true,
 
        pageSize: 15,
        pageButtonCount: 5,
 
        
 
        controller: db,
 
        fields: [
            { name: "Course Name", type: "text", width: 100 },
            { name: "Level", type: "number", width: 50 },
            { name: "Department", type: "text", width: 150 },
            { name: "Faculty", type: "text" ,width: 150},
            
            { type: "control" }
        ]
    });
    $("#departmentGrid").jsGrid({
        height: "80%",
        width: "100%",
 
        filtering: true,
        sorting: true,
        paging: true,
        autoload: true,
 
        pageSize: 15,
        pageButtonCount: 5,
 
        
 
        controller: db,
 
        fields: [
            { name: "Course Name", type: "text", width: 100 },
            { name: "Level", type: "number", width: 50 },
            { name: "Department", type: "text", width: 150 },
            { name: "Faculty", type: "text" ,width: 150},
            
            { type: "control" }
        ]
    });

    $("#courseGrid").jsGrid({
        height: "80%",
        width: "100%",
 
        filtering: true,
        sorting: true,
        paging: true,
        autoload: true,
 
        pageSize: 15,
        pageButtonCount: 5,
 
        
 
        controller: db,
 
        fields: [
            { name: "Course Name", type: "text", width: 100 },
            { name: "Level", type: "number", width: 50 },
            { name: "Department", type: "text", width: 150 },
            { name: "Faculty", type: "text" ,width: 150},
            
            { type: "control" }
        ]
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