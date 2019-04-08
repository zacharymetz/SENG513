var currentSchool = 1;
var currentPage = "home-page";
var navHistory = [];
var pages =["home-page","school-page","faculty-page","dept-page","course-page"];
var userCity = "";
var socket = io();

function gotoPage(page){
  for(var i=0;i<pages.length;i++){
    if(page != pages[i]){
      $("#"+pages[i]).hide();
    }else{
      $("#"+pages[i]).show();
      currentPage = page;
    }
  }

  if (page == "home-page"){
    renderSchoolGrid();
  }else if ((page == "school-page") || (page == "faculty-page")){
    renderFacultyGrid();
    $("#school-page").show();
  }else if (page == "dept-page"){
    renderDeptGrid();
    $("#school-page").show();
  }else{
    renderCourseGrid();
    $("#school-page").show();
  }
};

function renderSchoolGrid(requestData={city: userCity}){
  $.post("/GetSchools",requestData).done((data)=>{
    var html = "";
    //console.log(data);
    data= JSON.parse(data);
    for(var i=0;i<data.items.length;i++){
      html +=  '<div class="collectItem" id="school-card-'+data.items[i].id+'">'
      html +=  '  <div>'
      html +=  '    <img id="barLogo" src="/static/img/'+data.items[i].img+'">'
      html +=  '  </div>'
      html +=  '</div>'
    }
    $("#schoolGrid").html(html);
    for(var i=0;i<data.items.length;i++){
      $("#school-card-"+data.items[i].id).click(()=>{
        //go to school faculties
        navHistory.push(currentPage);
        gotoPage("faculty-page");
      });
    };
  })
}
function renderFacultyGrid(requestData=null){
  $.post("/GetFaculties",requestData).done((data)=>{
    var html = "";
    //console.log(data);
    data= JSON.parse(data);
    for(var i=0;i<data.items.length;i++){
      html +=  '<div class="collectItem" id="faculty-card-'+data.items[i].id+'">'
      html +=  '  <div id="collectImage" style="background-image:url('+data.items[i].img+');"></div>'
      html +=  '  <div class="collectName">'+data.items[i].name+'</div>'
      html +=  '</div>'
    }
    $("#faculty-page").html(html);
    for(var i=0;i<data.items.length;i++){
      $("#faculty-card-"+data.items[i].id).click(()=>{
        //load page with departments in faculty
        navHistory.push(currentPage);
        gotoPage("dept-page");
      });
    };
  })
}
function renderDeptGrid(requestData=null){
  $.post("/GetDepts",requestData).done((data)=>{
    var html = "";
    //console.log(data);
    data= JSON.parse(data);
    for(var i=0;i<data.items.length;i++){
      html +=  '<div class="collectItem" id="dept-card-'+data.items[i].id+'">'
      html +=  '  <div id="collectImage" style="background-image:url('+data.items[i].img+');"></div>'
      html +=  '  <div class="collectName">'+data.items[i].name+'</div>'
      html +=  '</div>'
    }
    $("#dept-page").html(html);
    for(var i=0;i<data.items.length;i++){
      $("#dept-card-"+data.items[i].id).click(()=>{
        //load courses in department
        navHistory.push(currentPage);
        gotoPage("course-page");
      });
    };
  })
}

function renderCourseGrid(requestData=null){
  $.post("/GetCourses",requestData).done((data)=>{
    var html = "";
    //console.log(data);
    data= JSON.parse(data);
    for(var i=0;i<data.items.length;i++){
      html +=  '<div class="listItem">'
      html +=  '  <div class="courseTopLine">'
      html +=  '    <div class="courseName" id="course-card-'+data.items[i].id+'">'
      html +=  '      <span class="oi oi-chevron-right" title="chevron-right" aria-hidden="true" id="right-Arrow-'+data.items[i].id+'"></span>'
      html +=  '      <span class="oi oi-chevron-bottom" title="chevron-bottom" aria-hidden="true" id="down-Arrow-'+data.items[i].id+'"></span>'
      html +=  '      <span><b class="course-'+data.items[i].id+'" id="course-card-'+data.items[i].id+'">'+data.items[i].course+': </b></span>'
      html +=  '      <span id="course-card-'+data.items[i].id+'">'+data.items[i].name+'</span>'
      html +=  '    </div>'
      html +=  '    <div id="courseNameGap"></div>'
      html +=  '    <div class="oi oi-plus" title="plus" aria-hidden="true" id="course-add-'+data.items[i].id+'" ></div>'
      html +=  '  </div>'
      html +=  '  <div class="courseInfo" id="course-info-'+data.items[i].id+'">'+data.items[i].info+'</div>'
      html +=  '  <div class="courseBottomLine"></div>'
      html +=  '</div>'
    }
    $("#course-page").html(html);
    for(var i=0;i<data.items.length;i++){
      $("#course-card-"+data.items[i].id).click(()=>{
        var idStr = event.target.id;
        var idParts = idStr.split('-', 3);
        var courseID = idParts[2];
        if ($("#course-info-"+courseID).is(":visible")) {
          $("#course-info-"+courseID).hide();
          $("#right-Arrow-"+courseID).show();
          $("#down-Arrow-"+courseID).hide();
        }else{
          $("#course-info-"+courseID).show();
          $("#down-Arrow-"+courseID).show();
          $("#right-Arrow-"+courseID).hide();
        }
      });
      $("#course-add-"+data.items[i].id).click(()=>{
        var idStr = event.target.id;
        var idParts = idStr.split('-', 3);
        var courseID = idParts[2];
        var nameParts = $(".course-"+courseID).html().split(":", 2);
        localStorage.setItem(courseID, nameParts[0]);
        updateUserList();
      });
    };
  })
}

function updateUserList() {
  //emit through socket to update user list
  renderUserList();
}

function renderUserList() {

}

function ipLookUp () {
  $.ajax('http://ip-api.com/json')
  .then(
      function success(response) {
          userCity = response.city;
          console.log("city: " + response.city);
          gotoPage("home-page");
      },

      function fail(data, status) {
          console.log('Request failed.  Returned status of',
                      status);
      }
  );
}

// runs after the page has been loaded
$(()=>{

  ipLookUp();

  $("#backButton").click(()=>{
    var prevPage = navHistory.pop();
    if (prevPage == "home-page") {
      navHistory = [];
    }
    gotoPage(prevPage);
  });

  $("#syncButton").click(()=>{
    var syncPass = $("#viewerPass").val();
    localStorage.setItem("syncPass", syncPass);
    //emit through socket to sync lists
  });

  //receive through socket any updates/sync

});
