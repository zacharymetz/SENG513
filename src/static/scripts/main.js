var currentPage = "home-page";
var navHistory = [];
var pages =["home-page","school-page","faculty-page","dept-page","course-page"];
var clientCity = "";
var currentSchoolID;
var currentFacultyID;
var currentDepartmentID;
var socket = io();
var listSynced = false;

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

function renderSchoolGrid(requestData={city: clientCity}){
  $.post("/GetSchools",requestData).done((data)=>{
    var html = "";
    //console.log(data);
    data= JSON.parse(data);
    for(var i=0;i<data.rows.length;i++){
      html +=  '<div class="collectItem" id="school-card-'+data.rows[i].institutionid+'">'
      html +=  '  <div>'
      html +=  '    <img id="school-card-'+data.rows[i].institutionid+'" class="barLogo" src="/static/img/'+data.rows[i].institutionid+'">'
      html +=  '  </div>'
      html +=  '</div>'
    }
    $("#schoolGrid").html(html);
    for(var i=0;i<data.rows.length;i++){
      $("#school-card-"+data.rows[i].institutionid).click(()=>{
        var idStr = event.target.id;
        var idParts = idStr.split('-', 3);
        currentSchoolID = idParts[2];
        localStorage.setItem("currentSchoolID", currentSchoolID);
        renderUserList();
        navHistory.push(currentPage);
        gotoPage("faculty-page");
      });
    };
  })
}
function renderFacultyGrid(requestData=null){
  $.post("/GetFaculties",{city: clientCity, schoolID: currentSchoolID}).done((data)=>{
    var html = "";
    //console.log(data);
    data= JSON.parse(data);
    for(var i=0;i<data.rows.length;i++){
      html +=  '<div class="collectItem" id="faculty-card-'+data.rows[i].academicgroupid+'">'
      html +=  '  <div id="collectImage" style="background-image:url("https://d2ai0ibaxpbki1.cloudfront.net/v2/images/collections/video-music-licensing-collection-optimistic.jpg");"></div>'
      html +=  '  <div class='+data.rows[i].academicgroupid+' class="collectName">'+data.rows[i].code+'</div>'
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
  $.post("/GetDepts", {
    city:clientCity,
    schoolID:currentSchool,
    facultyID:currentFacultyID
  }).done((data)=>{
    var html = "";
    //console.log(data);
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
  $.post("/GetCourses", {
    city: clientCity,
    schoolID: currentSchoolID,
    facultyID: currentFacultyID,
    departmentID: currentDepartmentID
  }).done((data)=>{
    var html = "";
    //console.log(data);
    data= JSON.parse(data);
    for(var i=0;i<data.rows.length;i++){
      html +=  '<div class="listItem">'
      html +=  '  <div class="courseTopLine">'
      html +=  '    <div class="courseName" id="course-card-'+data.rows[i].id+'">'
      html +=  '      <span class="oi oi-chevron-right" title="chevron-right" aria-hidden="true" id="right-Arrow-'+data.rows[i].id+'"></span>'
      html +=  '      <span class="oi oi-chevron-bottom" title="chevron-bottom" aria-hidden="true" id="down-Arrow-'+data.rows[i].id+'"></span>'
      html +=  '      <span><b class="course-'+data.rows[i].id+'" id="course-card-'+data.rows[i].id+'">'+data.rows[i].catalognumber+': </b></span>'
      html +=  '      <span id="course-card-'+data.rows[i].id+'">'+data.rows[i].description+'</span>'
      html +=  '    </div>'
      html +=  '    <div id="courseNameGap"></div>'
      html +=  '    <div class="oi oi-plus" title="plus" aria-hidden="true" id="course-add-'+data.rows[i].id+'" ></div>'
      html +=  '  </div>'
      html +=  '  <div class="courseInfo" id="course-info-'+data.rows[i].id+'">'+data.rows[i].topicdescription+'</div>'
      html +=  '  <div class="courseBottomLine"></div>'
      html +=  '</div>'
    }
    $("#course-page").html(html);
    for(var i=0;i<data.rows.length;i++){
      $("#course-card-"+data.rows[i].id).click(()=>{
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
      $("#course-add-"+data.rows[i].id).click(()=>{
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
  socket.emit('updateList', JSON.stringify(localStorage));
}

function renderUserList() {
  var html = "";
  var htmlModal = "";
  var listKeys = [];
  if (localStorage.length > 1) {
    for (var i = 0; i < localStorage.length; i++) {
      var storageKey = localStorage.key(i);
      if ((storageKey === "syncPass") || (storageKey === "currentSchool")) continue;
      listKeys.push(storageKey);
      html +=  '<li><div class="courseInList" id="in-list-'+storageKey+'">'+localStorage.getItem(storageKey)+'</div> <div id="course-trash-'+storageKey+'" class="oi oi-trash" title="trash" aria-hidden="true"></div></li>'
      htmlModal +=  '<li><div class="courseInList" id="in-list-'+storageKey+'">'+localStorage.getItem(storageKey)+'</div> <div id="modal-trash-'+storageKey+'" class="oi oi-trash" title="trash" aria-hidden="true"></div></li>'
    }
    $("#courseList").html(html);
    $("#courseList-modal").html(htmlModal);
    //for loop to add click on trash for each course in list
    for (var i = 0; i < listKeys.length; i++) {
      $("#course-trash-"+listKeys[i]).click(()=>{
        var idStr = event.target.id;
        var idParts = idStr.split('-', 3);
        var courseID = idParts[2];
        localStorage.removeItem(courseID);
        updateUserList();
      });
    }
    for (var i = 0; i < listKeys.length; i++) {
      $("#modal-trash-"+listKeys[i]).click(()=>{
        var idStr = event.target.id;
        var idParts = idStr.split('-', 3);
        var courseID = idParts[2];
        localStorage.removeItem(courseID);
        updateUserList();
      });
    }
  }
}

function ipLookUp () {
  $.ajax('http://ip-api.com/json')
  .then(
      function success(response) {
          clientCity = response.city;
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
    if (syncPass != "") {
      localStorage.setItem("syncPass", syncPass);
      socket.emit('syncList', JSON.stringify(localStorage));
    }
  });

  //receive through socket any updates/sync
  socket.on('syncList', function(userData) {
    var userStorage = JSON.parse(userData);
    if ((userStorage.syncPass === localStorage.getItem(syncPass)) && (userStorage.currentSchool === currentSchool)) {
      if(!listSynced) {
        listSynced = true;
        for (var key in userStorage) {
          localStorage.setItem(key, userStorage.key);
        }
        renderUserList();
        socket.emit('syncList', JSON.stringify(localStorage));
      }
    }
  });

  socket.on('updateList', function(userStorage) {
    var userStorage = JSON.parse(userData);
    localStorage.clear();
    if ((userStorage.syncPass === localStorage.getItem(syncPass)) && (userStorage.currentSchool === currentSchool)) {
      for (var key in userStorage) {
        localStorage.setItem(key, userStorage.key);
      }
    }
    renderUserList();
  });

});
