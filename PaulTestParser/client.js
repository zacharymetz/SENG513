// // // using jQuery
// // $("#subbtn").onClick(function(e) {

// //     $.ajax({
// //       url: "http://localhost:3000/",
// //       type: "POST",
// //       data: new FormData($("#myForm")),
// //       processData: false,
// //       contentType: false
// //     });
  
// //     return false;
// //   });


//   $('#file-drop-area').on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
//     e.preventDefault();
//     e.stopPropagation();
//     e.preventDefault();
//     e.stopPropagation();
//   })
//   .on('drop', function(e) {
//     console.log("adssadsda");
//     droppedFiles = e.originalEvent.dataTransfer.files;
//     var data = new FormData();
//     for(var i=0;i<droppedFiles.length;i++){
//         data.append('file-'+i, droppedFiles[i]);
//     }
//     $.ajax({
//         url: '/upload' ,
//         data: data,
//         cache: false,
//         contentType: false,
//         processData: false,
//         method: 'POST',
//         type: 'POST', // For jQuery < 1.9
//         done: function(data){
//             console.log(data)
//         }
//     });
    
//   });

  $form.on('submit', function(e) {
    if ($form.hasClass('is-uploading')) return false;
  
    $form.addClass('is-uploading').removeClass('is-error');
  
    if (isAdvancedUpload) {
      var droppedFiles = false;
  
      $form.on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
      })
      .on('dragover dragenter', function() {
        $form.addClass('is-dragover');
      })
      .on('dragleave dragend drop', function() {
        $form.removeClass('is-dragover');
      })
      .on('drop', function(e) {
        droppedFiles = e.originalEvent.dataTransfer.files;
      });    } else {
      // ajax for legacy browsers
    }
  });