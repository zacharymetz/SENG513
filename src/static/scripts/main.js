var currentPage = "home-page";
var previousPage = "home-page";

var pages =["home-page","school-page"]


function gotoPage(page){
  for(var i=0;i<pages.length;i++){
    if(page != pages[i]){
      $("#"+pages[i]).hide();
    }else{
      $("#"+pages[i]).show();
      currentPage = page;
    }
  }
}



function renderSchoolGrid(requestData=null){
  $.post("/GetSchools",requestData).done((data)=>{
    var html = "";
    console.log(data);
    data= JSON.parse(data);
    for(var i=0;i<data.items.length;i++){
      html +=  '<div class="collectItem" id="school-card-'+data.items[i].id+'">'
      html +=  '  <div>'
      html +=  '    <img id="barLogo" src="/static/img/'+data.items[i].img+'">'
      html +=  '  </div>'
      html +=  '</div>'
    }
    $("#SchoolGrid").html(html);
    for(var i=0;i<data.items.length;i++){
      $("#school-card-"+data.items[i].id).click(()=>{
        //go to school faculties
        gotoPage("school-page");
        renderFacultyGrid();
      });
    };
  })
}
function renderFacultyGrid(requestData=null){
  $.post("/GetFaculties",requestData).done((data)=>{
    var html = "";
    console.log(data);
    data= JSON.parse(data);
    for(var i=0;i<data.items.length;i++){
      html +=  '<div class="collectItem" id="faculty-card-'+data.items[i].id+'">'
      html +=  '  <div id="collectImage" style="background-image:url('+data.items[i].img+');"></div>'
      html +=  '  <div class="collectName">'+data.items[i].name+'</div>'
      html +=  '</div>'
    }
    $("#schoolContentGrid").html(html);
    for(var i=0;i<data.items.length;i++){
      $("#faculty-card-"+data.items[i].id).click(()=>{
        //reload page with departments
        renderDeptGrid();
      });
    };
  })
}
function renderDeptGrid(requestData=null){
  $.post("/GetDepts",requestData).done((data)=>{
    var html = "";
    console.log(data);
    data= JSON.parse(data);
    for(var i=0;i<data.items.length;i++){
      html +=  '<div class="collectItem" id="dept-card-'+data.items[i].id+'">'
      html +=  '  <div id="collectImage" style="background-image:url('+data.items[i].img+');"></div>'
      html +=  '  <div class="collectName">'+data.items[i].name+'</div>'
      html +=  '</div>'
    }
    $("#schoolContentGrid").html(html);
    for(var i=0;i<data.items.length;i++){
      $("#dept-card-"+data.items[i].id).click(()=>{
        //load dept course list
        renderCourseGrid();
      });
    };
  })
}

function renderCourseGrid(requestData=null){
  $.post("/GetCourses",requestData).done((data)=>{
    var html = "";
    console.log(data);
    data= JSON.parse(data);
    for(var i=0;i<data.items.length;i++){
      html +=  '<div class="listItem" id="course-card-'+data.items[i].id+'">'
      html +=  '  <div class="courseTopLine">'
      html +=  '    <div class="courseName">'
      html +=  '      <span class="oi oi-chevron-right" title="chevron-right" aria-hidden="true" id="rightArrow"></span>'
      html +=  '      <span class="oi oi-chevron-bottom" title="chevron-bottom" aria-hidden="true" id="downArrow"></span>'
      html +=  '      <span><b>'+data.items[i].course+': </b></span>'
      html +=  '      <span>'+data.items[i].name+'</span>'
      html +=  '    </div>'
      html +=  '    <div class="oi oi-plus" title="plus" aria-hidden="true"></div>'
      html +=  '  </div>'
      html +=  '  <div class="courseInfo">'+data.items[i].info+'</div>'
      html +=  '  <div class="courseBottomLine"></div>'
      html +=  '</div>'
    }
    $("#schoolContentGrid").hide();
    $("#schoolCourses").html(html);
    $("#schoolCourses").show();
    for(var i=0;i<data.items.length;i++){
      $("#course-card-"+data.items[i].id).click(()=>{
        //load dept course list

      });
    };
  })
}

// runs after the page has been loaded
$(()=>{
  renderSchoolGrid();
  gotoPage("home-page");
});
