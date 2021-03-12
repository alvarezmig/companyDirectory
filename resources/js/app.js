//PRELOADER
$(window).on('load', function () {    
  if ($('#preloader').length) {  

   $('#preloader').delay(100).fadeOut('slow', function () {   

       $(this).remove();    

        });   
   }})
//DOCUMENT READY FUNCTION
$(document).ready(function() {

  
//======= AJAX - CONNECTS TO DATABASE VIA PHP AND POPULATE SELECT MENUS WITH DATA =======

  $.ajax({
    type: 'POST',
    dataType: 'JSON',
    cache: false,
    url: 'resources/php/getAllLocations.php',
    success: function(locations) {

      $('#selectLocationsFilter').find('option').not(':first').remove();
      $('#selectLocationsNew').find('option').not(':first').remove();
      $('#selectLocationsUpdate').find('option').not(':first').remove();
      $('#selectLocationsMove').find('option').not(':first').remove();
      $('#selectLocationsDelete').find('option').not(':first').remove();

      $.each(locations.data, function(i) {
        $('#selectLocationsFilter').append($("<option>", {
            value: locations.data[i].id,
            text: locations.data[i].name
        }));
        $('#selectLocationsNew').append($("<option>", {
            value: locations.data[i].id,
            text: locations.data[i].name
        }));
        $('#selectLocationsUpdate').append($("<option>", {
            value: locations.data[i].id,
            text: locations.data[i].name
        }));
        $('#selectLocationsMove').append($("<option>", {
            value: locations.data[i].id,
           text: locations.data[i].name
        }));
        $('#selectLocationsDelete').append($("<option>", {
          value: locations.data[i].id,
          text: locations.data[i].name
      }));
       })
  },
  error: function(){
     alert('Error retrieving information');
  }
})

$.ajax({
  type: 'POST',
  dataType: 'JSON',
  cache: false,
  url: 'resources/php/getAll.php',
  success: function(employeeInfo) {

    $('#selectfName').find('option').not(':first').remove();
    $('#selectfNameUpdate').find('option').not(':first').remove();

    $.each(employeeInfo.data, function(index) {
      $('#selectfName').append($('<option>', {
          value: employeeInfo.data[index].firstName,
          text: employeeInfo.data[index].firstName
      }))
      $('#selectfNameUpdate').append($("<option>", {
        value: employeeInfo.data[index].firstName,
        text: employeeInfo.data[index].firstName
    }));
  });

  $("#selectfName").change(function(){

    $("#selectlName").removeAttr("disabled");
    $('#selectlName').empty();

    $.each(employeeInfo.data, function(i){
        if($("#selectfName option:selected").text() === employeeInfo.data[i].firstName){
          $('#selectlName').append($("<option>", {
            value: employeeInfo.data[i].lastName,
            text: employeeInfo.data[i].lastName
        }));
        }
    })

  })
  },
  error: function(){
     alert('Error retrieving information');
  }
})

$.ajax({
  type: 'POST',
  dataType: 'JSON',
  cache: false,
  url: 'resources/php/getAllDepartments.php',
  success: function(departments) {

    $('#selectDepartmentsFilter').find('option').not(':first').remove();
    $('#selectDepartmentsUpdate').find('option').not(':first').remove();
    $('#selectDeptNewEmployee').find('option').not(':first').remove();
    $('#selectDepartmentsDelete').find('option').not(':first').remove();
    $('#selectDeptDeleteEmployee').find('option').not(':first').remove();

    $.each(departments.data, function(i) {

      $('#selectDepartmentsFilter').append($("<option>", {
          value: departments.data[i].id,
          text: departments.data[i].name
      }));

      var locationDepartmentID = [departments.data[i].locationID, departments.data[i].id]
      $('#selectDepartmentsUpdate').append($("<option>", {
          value: locationDepartmentID,
          text: departments.data[i].name
      }));
      $('#selectDeptNewEmployee').append($("<option>", {
        value: departments.data[i].id,
        text: departments.data[i].name
      }));
      $('#selectDepartmentsDelete').append($("<option>", {
        value: departments.data[i].id,
        text: departments.data[i].name
      }));
      
      $(`#selectDeptDeleteEmployee`).append($(`<option>`, {
         value: departments.data[i].id,
         text: departments.data[i].name
      }));

      });
    },
    error: function(){
       alert('Error retrieving information');
    }
  })

  
  //======= SHOWS ALL EMPLOYEES DATA WITH LATEST UPDATE INFO =======

  $('.seeEmployees').click(function () {

    function allInfo(){ 

    $.ajax({
    type: 'POST',
    dataType: 'JSON',
    cache: false,
    url: 'resources/php/getAll.php',
    beforeSend: function(){
      $('#loader').show();
    },
    success: function(employeeInfo) {

     $('#selectDepartmentsFilter').change(function(){
        $('#emptyMessage').hide();

      $.each(employeeInfo.data, function(i){ 

        $(`#info${i}`).hide();

        if($('#selectDepartmentsFilter option:selected').text() === $(`#dept${i}`).text()){
          $(`#info${i}`).show()
        }
        if($("#employeeList").children(':visible').length == 0){
          $('#emptyMessage').show();
        }
      })
     })

    $('#selectLocationsFilter').change(function(){
      $('#emptyMessage').hide();

      $.each(employeeInfo.data, function(i){ 

        $(`#info${i}`).hide();

        if($('#selectLocationsFilter option:selected').text() === $(`#loc${i}`).text()){
          $(`#info${i}`).show()
         }

         if($("#employeeList").children(':visible').length == 0){
          $('#emptyMessage').show();
        }
        })
      })


      $('#sendToAllEmployees').click(function () {
        $('#manageEmployees').hide();
        $('#closeUpdateModal').click();
        $('#allEmployeesSection').show();
        $('#employeeList').show();
        
        $.each(employeeInfo.data, function(i){ 
          $(`#info${i}`).show();
  
          $('.resetFilter').click(function(){
            $('#selectDepartmentsFilter').val("default")
            $('#selectLocationsFilter').val("default")
            $(`#info${i}`).show()
            $('#emptyMessage').hide()
          })
        })
      })


    $(".searchInput").on("keyup", function() {
      $('#emptyMessage').hide();
      var value = $(this).val().toLowerCase();

      $.each(employeeInfo.data, function(i){ 

      $(`#info${i}`).filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      })
      });
      if($("#employeeList").children(':visible').length == 0){
        $('#emptyMessage').show();
      }
    });

    $(".searchInputReset").click(function(){
      $(".searchInput").val("")
      $("#emptyMessage").hide()
      $('#selectDepartmentsFilter').val("default")
      $('#selectLocationsFilter').val("default")
      $.each(employeeInfo.data, function(i){
      $(`#info${i}`).show()
      })
    })
  

 

    $.ajax({
      type: 'POST',
      dataType: 'JSON',
      cache: false,
      url: 'resources/php/getAllDepartments.php',
      success: function(departments) {
      
          $("#employeeList").empty()
      
            $.each(employeeInfo.data, function(i){
      
            $("#employeeList").append(
      
              `<div id=info${i} style="display:none;">
              <div class="card card-toggle cardCenter">
            
              <div>
            
              <img src="resources/images/icon.png" id="icon" class="img-thumbnail" alt="image">
            
                <div id="titleDiv">
            
                  <h5 class="card-title employeeTitle employee${i}">${employeeInfo.data[i].firstName} ${employeeInfo.data[i].lastName}</h5>
                  <p class="card-text employeeJob${i}">${employeeInfo.data[i].jobTitle}</p>
                  <p>${employeeInfo.data[i].email}</p>
            
                  <table id="detailsTable" class="table">
            
                      <tbody>
                        <tr>
                          <th scope="row">Department </th>
                          <td id="dept${i}">${employeeInfo.data[i].department}</td>
                        </tr>
                        <tr>
                          <th scope="row">Location </th>
                          <td id="loc${i}">${employeeInfo.data[i].location}</td>
                        </tr>
                      </tbody>
                    </table>
            
                </div>
            
                <div id="footerNav" class="card-footer">
                  <button class="btn btn-warning editDetailsButton" type="button" data-bs-toggle="modal" data-bs-target="#updateDetailsModal${i}">Edit Details</button>
                  <a href="mailto:${employeeInfo.data[i].email}"><button id="emailButton" type="button" class="btn btn-warning"><i class="far fa-envelope"></i></button></a>
                </div>
            
              </div>
            </div>
            
            
            <div class="modal fade" id="updateDetailsModal${i}" tabindex="-1" aria-labelledby="updateDetails${i}Label" aria-hidden="true">
              
              <div class="modal-dialog modal-dialog-centered">
                
                <div class="modal-content">
                  
                  <div class="modal-header">
                    <h5 class="modal-title">Edit details</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
            
                  <div class="modal-body">
            
                    <form class="updateForm${i}" action="resources/php/updateEmployee.php" method="POST">
                              
                      <fieldset>
            
                      <label for="id${i}" class="col-form-label id">ID</label>
                      <input id="id${i}" name="id" type="text" class="form-control id">
            
                      <label for="firstName${i}" class="col-form-label">First Name</label>
                      <input id="firstName${i}" name="firstName" type="text" class="form-control">
            
                      <label for="lastName${i}" class="form-label">Last Name</label>
                      <input id="lastName${i}" name="lastName" type="text" class="form-control">
            
                      <label for="jobTitle${i}" class="col-form-label">Job Title</label>
                      <input id="jobTitle${i}" name="jobTitle" type="text" class="form-control">
            
                      <label for="email${i}" class="form-label">e-mail</label>
                      <input id="email${i}" name="email" type="text" class="form-control">
            
                      <label for="departmentID${i}" class="col-form-label">Department</label>
                      <select class="form-select" id="selectDeptEmployeeUpdate${i}" name="departmentID">
                      </select>
            
                      <div class="modal-footer">
                      <button id="submitButton${i}" type="submit" class="btn btn-warning">Save Changes</button>
                      <button type="button" class="btn btn-warning" data-bs-dismiss="modal">Cancel</button>
                      </div>
            
                      </fieldset>
            
                    </form>
                  </div>
                </div>
              </div>
            </div>
            </div>`
            )
      
            if($(`.employeeJob${i}`).val() === ""){
              $(`.employeeJob${i}`).append("<br>")
            }
      
            $.each(departments.data, function(index) {
          
              $(`#selectDeptEmployeeUpdate${i}`).append($(`<option>`, {
                  id:`opt${i}` + (index + 1),
                  value: departments.data[index].id,
                  text: departments.data[index].name
              }));
            });
      
            $.each(departments.data, function(index) {
              if($(`#opt${i}${index+1}`).text() === employeeInfo.data[i].department){
                $(`#opt${i}${index+1}`).attr("selected", "selected")
              }
            });
      
            
            $(`#id${i}`).val(employeeInfo.data[i].id)
            $(`#id${i}`).text(employeeInfo.data[i].id)
      
            $(`#firstName${i}`).val(employeeInfo.data[i].firstName)
            $(`#firstName${i}`).text(employeeInfo.data[i].firstName)
      
            $(`#lastName${i}`).val(employeeInfo.data[i].lastName)
            $(`#lastName${i}`).text(employeeInfo.data[i].lastName)
      
            $(`#jobTitle${i}`).val(employeeInfo.data[i].jobTitle)
            $(`#jobTitle${i}`).text(employeeInfo.data[i].jobTitle)
      
            $(`#email${i}`).val(employeeInfo.data[i].email)
            $(`#email${i}`).text(employeeInfo.data[i].email)
      
            $(`.updateForm${i}`).on("submit", function(event){
              $('.saveModal').click()
              event.preventDefault(); 
              $('.confirm').click(function (){ 
                $(`.updateForm${i}`)[0].submit()
              })
            })
      
          $.each(employeeInfo.data, function(j){ 
            $(`#info${j}`).show();
      
            $('.resetFilter').click(function(){
              $('#selectDepartmentsFilter').val("default")
              $('#selectLocationsFilter').val("default")
              $(`#info${j}`).show()
              $('#emptyMessage').hide()
            })
          })
        })
       } ,
       complete: function(){
        $('#loader').hide();
       },
      error: function(){
          alert('Error retrieving information');
       }
     })
    
   },
   complete:function(){
    setTimeout(allInfo, 300000)
   },
    error: function(){
         alert('Error retrieving information');
      }
  })
 }
 allInfo();
})
  
  //======= AJAX - CONNECTS TO DATABASE VIA PHP AND POPULATE SELECT MENUS WITH EMPTY DEPARTMENTS DATA =======

    $.ajax({
      type: 'POST',
      dataType: 'JSON',
      cache: false,
      url: 'resources/php/getEmptyDepartment.php',
      success: function(emptyDepartments) {
     

  $('.deleteDepartmentForm').submit(function (event){  

    var emptyDeptNames = [];
    $.each(emptyDepartments.data, function(i){
      emptyDeptNames.push(emptyDepartments.data[i].name)
    })

    if(emptyDepartments.data.length === 0 || !emptyDeptNames.includes($('#selectDepartmentsDelete option:selected').text())){
      $('.errorModalDept').click()
      event.preventDefault(); 

    }else{
      
      $('.saveModal').click()
      event.preventDefault(); 
      $('.confirm').click(function (){ 
        $('.deleteDepartmentForm')[0].submit()
      })

    }
  })
      },
      error: function(){
        alert('Error retrieving information');
    }
  })
  

  //======= AJAX - CONNECTS TO DATABASE VIA PHP AND POPULATE SELECT MENUS WITH EMPTY LOCATIONS DATA =======

  $.ajax({
    type: 'POST',
    dataType: 'JSON',
    cache: false,
    url: 'resources/php/getEmptyLocation.php',
    success: function(emptyLocations) {

      var emptyLocName = [];
      $.each(emptyLocations.data, function(i){
        emptyLocName.push(emptyLocations.data[i].name)
      })
    
      $('.deleteLocationForm').submit(function (event){  
    
        if(emptyLocations.data.length === 0 || !emptyLocName.includes($('#selectLocationsDelete option:selected').text())){
          $('.errorModalLoc').click()
          event.preventDefault(); 
        }else{
          $('.saveModal').click()
          event.preventDefault(); 
          $('.confirm').click(function (){ 
            $('.deleteLocationForm')[0].submit()
          })
      }
      })
    },
    error: function(){
      alert('Error retrieving information');
  }
})

  
//======= EMPLOYEE LIST - QUICK ACCESS FUNCTIONALITY =======

$('[data-bs-target="#employeeListModal"]').click(function () {

    $.ajax({
    type: 'POST',
    dataType: 'JSON',
    cache: false,
    url: 'resources/php/getAll.php',
    beforeSend: function(){
      $('#loader').show();
    },
    success: function(employeeInfo){

    $('#employeeModalTable').empty()

    $.each(employeeInfo.data, function(i){ 

    $('#employeeModalTable').append(
      `
      <tr>
      <td>${employeeInfo.data[i].lastName}</td>
      <td>${employeeInfo.data[i].email} <a href="mailto:${employeeInfo.data[i].email}"><i class="fas fa-envelope-open-text"></i></a></td>
      </tr>`
      )
    })
  },
  error: function(){
    alert('Error retrieving information');
  },
  complete: function(){
    $('#loader').hide();
  }
 })
}) 

//======= DEPARTMENT/LOCATION LIST - QUICK ACCESS FUNCTIONALITY =======

$('[data-bs-target="#departmentListModal"]').click(function () {

$.ajax({
  type: 'POST',
  dataType: 'JSON',
  cache: false,
  url: 'resources/php/getAllDepartments.php',
  success: function(departments) {

    $.ajax({
      type: 'POST',
      dataType: 'JSON',
      cache: false,
      url: 'resources/php/getAllLocations.php',
      success: function(locations) {

          $('#departmentModalTable').empty()
      
          var allDeptLocationsID = []
      
          $.each(departments.data, function(index){
            allDeptLocationsID.push(departments.data[index].locationID)
          })
      
          var allLocLocationsID = []
          $.each(locations.data, function(index){
            allLocLocationsID.push([locations.data[index].id, locations.data[index].name])
          })
      
          for(let i = 0; i < departments.data.length ; i++){  
            
          $('#departmentModalTable').append(
            `<tr>
            <td>${departments.data[i].name}</td>
            <td id="location${i}"></td>
            </tr>`
            )
          }
      
          var departmentLocations = [];
      
          allDeptLocationsID.forEach( function(locationID) {
      
            for(let i = 0 ; i < allLocLocationsID.length ; i++){ 
      
            if(locationID === allLocLocationsID[i][0]){
      
              departmentLocations.push(allLocLocationsID[i][1])
      
              }
            }
          })
      
          for(let i = 0; i < departmentLocations.length ; i ++ ){ 
            $(`#location${i}`).text(departmentLocations[i])
          }
      
        },
      error: function(){
          alert('Error retrieving information');
      }
    })
  },
error: function(){
    alert('Error retrieving information');
}
})
})


//======= SHOWS CURRENT LOCATION FOR SELECTED DEPARTMENT =======

$('#selectDepartmentsUpdate').change(function (){
  $.ajax({
    type: 'POST',
    dataType: 'JSON',
    cache: false,
    url: 'resources/php/getAllLocations.php',
    success: function(locations) {
        $.each(locations.data, function(i){
            if($("#selectDepartmentsUpdate option:selected").val()[0] === locations.data[i].id){
              $("#currentLocation").text(locations.data[i].name)
            }
        })
    },
    error: function(){
      alert('Error retrieving information');
  }
})
})

//======= NAV BAR AND DIFFERENT SECTIONS FUNCTIONALITY =======

$('#allEmployeesLabel').click(function () {

$('#home').hide();
$('#allEmployeesSection').show();
$('#employeeList').show();

$('.resetFilter').click(function(){
  $('#selectDepartmentsFilter').val("default")
  $('#selectLocationsFilter').val("default")
  $('#emptyMessage').hide()
})

$('.filterName').css("display", "flex");
$('.filterLoc').hide();
$('.filterDept').hide();

})


$('#locationsLabel').click(function () {
  $('#home').hide();
  $('#allEmployeesSection').show();
  $('#employeeList').show();

  $('.resetFilter').click(function(){
    $('#selectDepartmentsFilter').val("default")
    $('#selectLocationsFilter').val("default")
    $('#emptyMessage').hide()
  })
    
  $('.filterLoc').css("display", "flex");
  $('.filterName').hide();
  $('.filterDept').hide();

})

$('#departmentsLabel').click(function () {
  $('#home').hide();
  $('#allEmployeesSection').show();
  $('#employeeList').show();

  $('.resetFilter').click(function(){
    $('#selectDepartmentsFilter').val("default")
    $('#selectLocationsFilter').val("default")
    $('#emptyMessage').hide()
  })

  $('.filterDept').css("display", "flex");
  $('.filterName').hide();
  $('.filterLoc').hide();
})

$('#selectDepartmentsUpdate').change(function (){
   $('#editDepartmentName').val($('#selectDepartmentsUpdate option:selected').text()) 
}) 

$('#selectLocationsUpdate').change(function (){
  $('#editLocationName').val($('#selectLocationsUpdate option:selected').text()) 
}) 


$(".homeButton").click(function() {
  $('#allEmployeesSection').hide()
  $('#employeeList').hide()
  $(".searchInput").val("")
  $('#selectDepartmentsFilter').val("default")
  $('#selectLocationsFilter').val("default")
  $('#emptyMessage').hide();
  $('#home').show()
})

$('.backButton').click(function (){
  $('#manageDepartments').hide();
  $('#home').show();
  $('#manageEmployees').hide();
  $('#home').show();
  $('#manageLocations').hide();
  $('#home').show();
})

$('#addRemoveEmployee').click(function () {
  $('#home').hide();
  $('#manageEmployees').show();
})
$('#addRemoveDepartment').click(function () {
  $('#home').hide();
  $('#manageDepartments').show();
})
$('#addRemoveLocation').click(function () {
  $('#home').hide();
  $('#manageLocations').show();
})


$('.dropdownDepartments').click(function () {
  $('.filterDept').css("display", "flex");
  $('.filterLoc').hide();
  $('.filterName').hide();
})
$('.dropdownLocation').click(function () {
  $('.filterLoc').css("display", "flex");
  $('.filterDept').hide();
  $('.filterName').hide();
})
$('.dropdownName').click(function () {
  $('.filterName').css("display", "flex");
  $('.filterDept').hide();
  $('.filterLoc').hide();
})


$(document).click(function (){
if($('.modal:visible').length == 0){
   $('[required]').val("")
   $('#editDepartmentName').val("")
   $('[name="jobTitle"]').val("")
   $('#selectlName').attr('disabled', 'disabled')
}
})


for (let i = 1 ; i < 9 ; i++) { 

$(`.uploadForm${i}`).submit(function(event){

  $('.saveModal').click()
  event.preventDefault(); 

  $('.confirm').click(function (){ 
    $(`.uploadForm${i}`)[0].submit()
  })

})

}

$('.refresh').click(function (){
  window.location.href = 'http://localhost/projects/companydirectory/index.html';
})


});



