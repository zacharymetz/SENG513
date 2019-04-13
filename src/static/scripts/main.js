var currentPage = "home-page";
var navHistory = [];
var pages =["home-page","school-page","faculty-page","dept-page","course-page"];
var clientCity = "";
var currentSchoolID;
var currentFacultyID;
var currentDepartmentID;
var socket;
var listSynced = false;
var facultyImages;

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
    //console.log(data);
    data= JSON.parse(data);
    var html = data.html;
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
    //console.log(data);
    data= JSON.parse(data);
    var html = data.html;
    $("#faculty-page").html(html);
    for(var i=0;i<data.rows.length;i++){
      $("#faculty-card-"+data.rows[i].facultyid).click(()=>{
        //reload page with departments
        var idStr = event.target.id;
        var idParts = idStr.split('-', 3);
        currentFacultyID = idParts[2];
        navHistory.push(currentPage);
        gotoPage("dept-page");
      });
    };
  })
}
function renderDeptGrid(requestData=null){
  $.post("/GetDepts", {
    city:clientCity,
    schoolID:currentSchoolID,
    facultyID:currentFacultyID
  }).done((data)=>{
    //console.log(data);
    data= JSON.parse(data);
    var html = data.html;
    $("#dept-page").html(html);
    for(var i=0;i<data.rows.length;i++){
      $("#dept-card-"+data.rows[i].departmentid).click(()=>{
        //load dept course list
        var idStr = event.target.id;
        var idParts = idStr.split('-', 3);
        currentDepartmentID = idParts[2];
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
    //console.log(data);
    data= JSON.parse(data);
    var html = data.html;
    $("#course-page").html(html);
    for(var i=0;i<data.rows.length;i++){
      $("#course-card-"+data.rows[i].courseid).click(()=>{
        var idStr = event.target.id;
        var idParts = idStr.split('-', 3);
        var courseID = idParts[2];
        if ($("#course-info-"+courseID).is(":visible")) {
          $("#course-info-"+courseID).hide();
          $("#course-notes-"+courseID).hide();
          $("#right-Arrow-"+courseID).show();
          $("#down-Arrow-"+courseID).hide();
        }else{
          $("#course-info-"+courseID).show();
          $("#course-notes-"+courseID).show();
          $("#down-Arrow-"+courseID).show();
          $("#right-Arrow-"+courseID).hide();
        }
      });
      $("#course-add-"+data.rows[i].courseid).click(()=>{
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
  socket.emit('updateList', localStorage);
}

function renderUserList() {
  var html = "";
  var htmlModal = "";
  var listKeys = [];
    for (var i = 0; i < localStorage.length; i++) {
      var storageKey = localStorage.key(i);
      if ((storageKey === "syncPass") || (storageKey === "currentSchoolID")) continue;
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
  localStorage.removeItem("syncPass");
  socket = io();

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
      socket.emit('syncList', localStorage);
    }
  });

  // searching for cities in the database
  $("#searchCityButton").click(() => {
    console.log("sending request to get univeristies from cities");
    $.post("/GetSchoolsByText",
      { cityName: $("#searchCityText").val() })
      .done((data) => {
        console.log(data);
        data = JSON.parse(data);
        var html = data.html;
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
      });
  });

  //receive through socket any updates/sync
  socket.on('syncList', function(userStorage) {
    console.log(userStorage.syncPass);
    if ((userStorage.syncPass === localStorage.getItem("syncPass")) && (userStorage.currentSchoolID === localStorage.getItem("currentSchoolID"))) {
      var listKeys = Object.keys(userStorage);
      var listVals = Object.values(userStorage);
      for (var i = 0; i < listKeys.length; i++) {
        localStorage.setItem(listKeys[i], listVals[i]);
      }
      renderUserList();
    }
  });

  socket.on('updateList', function(userStorage) {
    if (userStorage.syncPass != null) {
      if ((userStorage.syncPass === localStorage.getItem("syncPass")) && (userStorage.currentSchoolID === localStorage.getItem("currentSchoolID"))) {
        localStorage.clear();
        var listKeys = Object.keys(userStorage);
        var listVals = Object.values(userStorage);
        for (var i = 0; i < listKeys.length; i++) {
          localStorage.setItem(listKeys[i], listVals[i]);
        }
      }
    }
    renderUserList();
  });

});
