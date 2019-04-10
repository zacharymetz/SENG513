var currentSchool = 1;
var currentPage = "home-page";
var navHistory = [];
var pages =["home-page","school-page","faculty-page","dept-page","course-page"];
var clientCity = "";
var currentSchoolID;
var currentFacultyID;
var currentDepartmentID;
var currentCourseID;

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

function renderSchoolGrid(requestData=null){
  $.post("/GetSchools",{
    city: clientCity
  }).done((data)=>{
    var html = "";
    data= JSON.parse(data);
    for(var i=0;i<data.rows.length;i++){
      html +=  '<div class="collectItem" id="school-card-'+data.rows[i].institutionid+'">'
      html +=  '  <div>'
      html +=  '    <img  id ='+data.rows[i].institutionid+' id="barLogo" src="/static/img/'+"UofC.png"+'">'
      html +=  '  </div>'
      html +=  '</div>'
    }
    $("#schoolGrid").html(html);
    for(var i=0;i<data.rows.length;i++){
      $("#school-card-"+data.rows[i].institutionid).click(()=>{
        //go to school faculties
        currentSchoolID = event.target.id;
        navHistory.push(currentPage);
        gotoPage("faculty-page");
      });
    };
  })
}
function renderFacultyGrid(requestData=null){
  $.post("/GetFaculties",{
    city: clientCity,
    schoolID: currentSchoolID
  }).done((data)=>{
    var html = "";
    data= JSON.parse(data);
    for(var i=0;i<data.rows.length;i++){
      html +=  '<div class="collectItem" id="faculty-card-'+data.rows[i].academicgroupid+'">'
      html +=  '  <div id="collectImage" style="background-image:url('+"https://d2ai0ibaxpbki1.cloudfront.net/v2/images/collections/video-music-licensing-collection-optimistic.jpg"+');"></div>'
      html +=  '  <div class ='+data.rows[i].academicgroupid+' class="collectName">'+data.rows[i].code+'</div>'
      html +=  '</div>'
    }
    $("#faculty-page").html(html);
    for(var i=0;i<data.rows.length;i++){
      $("#faculty-card-"+data.rows[i].academicgroupid).click(()=>{
        //reload page with departments
        currentFacultyID = event.target.nextElementSibling.className;
        navHistory.push(currentPage);
        gotoPage("dept-page");
      });
    };
  })
}
function renderDeptGrid(requestData=null){
  $.post("/GetDepts",{
    city:clientCity,
    schoolID:currentSchool,
    facultyID:currentFacultyID
  }).done((data)=>{
    var html = "";
    data= JSON.parse(data);
    for(var i=0;i<data.rows.length;i++){
      html +=  '<div class="collectItem" id="dept-card-'+data.rows[i].subjectid+'">'
      html +=  '  <div id="collectImage" style="background-image:url('+"https://pbs.twimg.com/profile_images/787764476078587904/vcAZZNg1_400x400.jpg"+');"></div>'
      html +=  '  <div class ='+data.rows[i].subjectid+' class="collectName">'+data.rows[i].code+'</div>'
      html +=  '</div>'
    }
    $("#dept-page").html(html);
    for(var i=0;i<data.rows.length;i++){
      $("#dept-card-"+data.rows[i].subjectid).click(()=>{
        //load dept course list
        currentDepartmentID = event.target.nextElementSibling.className;
        navHistory.push(currentPage);
        gotoPage("course-page");
      });
    };
  })
}

function renderCourseGrid(requestData=null){
  $.post("/GetCourses",{
    city: clientCity,
    schoolID: currentSchoolID,
    facultyID: currentFacultyID,
    departmentID: currentDepartmentID
  }).done((data)=>{
    var html = "";
    data= JSON.parse(data);
    for(var i=0;i<data.rows.length;i++){
      html +=  '<div class="listItem" id="course-card-'+data.rows[i].id+'">'
      html +=  '  <div class="courseTopLine">'
      html +=  '    <div class ='+data.rows[i].id+' class="courseName">'
      html +=  '      <span class="oi oi-chevron-right" title="chevron-right" aria-hidden="true" id="rightArrow"></span>'
      html +=  '      <span class="oi oi-chevron-bottom" title="chevron-bottom" aria-hidden="true" id="downArrow"></span>'
      html +=  '      <span><b>'+data.rows[i].catalognumber+': </b></span>'
      html +=  '      <span>'+data.rows[i].description+'</span>'
      html +=  '    </div>'
      html +=  '    <div class="oi oi-plus" title="plus" aria-hidden="true"></div>'
      html +=  '  </div>'
      html +=  '  <div class="courseInfo">'+data.rows[i].topicdescription+'</div>'
      html +=  '  <div class="courseBottomLine"></div>'
      html +=  '</div>'
    }
    $("#course-page").html(html);
    for(var i=0;i<data.rows.length;i++){
      $("#course-card-"+data.rows[i].id).click(()=>{
        //load dept course list

        currentCourseID = event.target.parentElement.className;
      });
    };
  })
}

// runs after the page has been loaded
$(()=>{
  ipLookUp(()=>{
    gotoPage("home-page");
    $("#backButton").click(()=>{
      console.log(navHistory);
      var prevPage = navHistory.pop();
      console.log("previous page: " + prevPage);
      if (prevPage == "home-page") {
        navHistory = [];
      }
      gotoPage(prevPage);

    });
  });
  //console.log(localStorage.length);


  // searching for cities in the database
  $("#searchCityButton").click(() => {
    console.log("sending request to get univeristies from cities");
    $.post("/GetSchoolsByText",
      { cityName: $("#searchCityText").val() })
      .done((data) => {
        console.log(data);
        data = JSON.parse(data);
      });
  });  

  //searching for courses in the databae
  $("#searchCoursesButton").click(()=>
  {
    console.log("sending request to get courses");
    $.post("/searchCoursesByText",
    { courseName: $("#searchCoursesText").val() })
    .done((data) => {
      console.log(data);
      data = JSON.parse(data);
    });
  });



});


function ipLookUp (callback) {
  $.ajax('http://ip-api.com/json')
  .then(
      function success(response) {
          console.log('User\'s Location Data is ', response);
          console.log('User\'s Country', response.country);
          clientCity = response.city;
          console.log(clientCity);
          callback();
      },

      function fail(data, status) {
        data = JSON.parse(data);
        
          console.log('Request failed.  Returned status of',
                      status);
          callback();
      }
  );
}


